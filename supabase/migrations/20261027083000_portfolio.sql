-- Only these three narrow functions are public. Messages and counters stay private.
create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public, anon, authenticated;

create table portfolio_private.click_counter (
  id boolean primary key default true check (id),
  total bigint not null default 0 check (total between 0 and 9007199254740990)
);
insert into portfolio_private.click_counter (id) values (true);

create table portfolio_private.messages (
  id uuid primary key,
  sender_name text not null check (char_length(sender_name) between 2 and 80),
  sender_email text not null check (char_length(sender_email) between 3 and 254),
  message_body text not null check (char_length(message_body) between 10 and 3000),
  created_at timestamptz not null default now()
);
create index messages_created_at_idx on portfolio_private.messages (created_at);
create index messages_sender_created_idx on portfolio_private.messages (sender_email, created_at);
alter table portfolio_private.click_counter enable row level security;
alter table portfolio_private.messages enable row level security;
revoke all on all tables in schema portfolio_private from public, anon, authenticated;

create function public.get_portfolio_clicks() returns bigint
language sql stable security definer set search_path = ''
as $$ select total from portfolio_private.click_counter where id = true $$;

create function public.increment_portfolio_clicks() returns bigint
language sql volatile security definer set search_path = ''
as $$ update portfolio_private.click_counter set total = total + 1 where id = true returning total $$;

create function public.submit_portfolio_message(
  submission_id uuid, sender_name text, sender_email text, message_body text, website text default ''
) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  clean_name text := btrim(sender_name);
  clean_email text := lower(btrim(sender_email));
  clean_message text := btrim(message_body);
begin
  -- Honeypot: quietly discard automated submissions without revealing the trap.
  if coalesce(website, '') <> '' then return; end if;
  if submission_id is null or clean_name is null or char_length(clean_name) not between 2 and 80
    or clean_email is null or char_length(clean_email) > 254
    or clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or clean_message is null or char_length(clean_message) not between 10 and 3000 then
    raise exception 'Please check the message fields.' using errcode = '22023';
  end if;
  -- Serialize submissions so concurrent requests cannot bypass the limits.
  perform pg_catalog.pg_advisory_xact_lock(76381271);
  if exists (select 1 from portfolio_private.messages where id = submission_id) then return; end if;
  if (select count(*) from portfolio_private.messages where created_at > now() - interval '1 day') >= 100
    or (select count(*) from portfolio_private.messages where messages.sender_email = clean_email
      and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Please try later or use email.' using errcode = 'P0429';
  end if;
  insert into portfolio_private.messages (id, sender_name, sender_email, message_body)
    values (submission_id, clean_name, clean_email, clean_message);
end;
$$;

revoke all on function public.get_portfolio_clicks() from public;
revoke all on function public.increment_portfolio_clicks() from public;
revoke all on function public.submit_portfolio_message(uuid,text,text,text,text) from public;
grant execute on function public.get_portfolio_clicks() to anon, authenticated;
grant execute on function public.increment_portfolio_clicks() to anon, authenticated;
grant execute on function public.submit_portfolio_message(uuid,text,text,text,text) to anon, authenticated;

-- Public downloads; uploads/deletes require the owner's dashboard or a server credential.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 5242880, array['image/jpeg','image/png','image/webp']);
