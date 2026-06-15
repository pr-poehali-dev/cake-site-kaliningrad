ALTER TABLE t_p94533950_cake_site_kaliningra.orders
  ADD COLUMN IF NOT EXISTS print text NULL,
  ADD COLUMN IF NOT EXISTS photo_url text NULL,
  ADD COLUMN IF NOT EXISTS estimated_price text NULL,
  ADD COLUMN IF NOT EXISTS kg text NULL,
  ADD COLUMN IF NOT EXISTS qty text NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

CREATE TABLE IF NOT EXISTS t_p94533950_cake_site_kaliningra.messages (
  id         serial PRIMARY KEY,
  order_id   integer NOT NULL REFERENCES t_p94533950_cake_site_kaliningra.orders(id),
  sender     text NOT NULL,
  text       text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
