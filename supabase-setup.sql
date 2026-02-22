-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- 1. Create orders table
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  print_type TEXT NOT NULL,
  paper_size TEXT NOT NULL,
  copies INTEGER NOT NULL DEFAULT 1,
  instructions TEXT,
  address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  document_url TEXT NOT NULL,
  document_name TEXT,
  receipt_url TEXT NOT NULL,
  amount_paid INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public)
VALUES ('orders', 'orders', true);

-- 3. Allow public read access to the orders bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'orders');

-- 4. Allow service role to upload files
CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'orders');
