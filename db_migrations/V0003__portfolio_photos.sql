CREATE TABLE IF NOT EXISTS t_p94533950_cake_site_kaliningra.portfolio_photos (
  id         serial PRIMARY KEY,
  url        text NOT NULL,
  title      text NOT NULL DEFAULT 'Работа',
  created_at timestamp NOT NULL DEFAULT now()
);
