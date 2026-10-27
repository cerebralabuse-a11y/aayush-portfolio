import { createPortfolioApi } from './portfolio-api.js';

export const backend = createPortfolioApi(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
