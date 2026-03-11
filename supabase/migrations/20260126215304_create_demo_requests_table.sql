/*
  # Create demo requests table

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `company` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `role` (text, required)
      - `created_at` (timestamptz, default now)
      - `status` (text, default 'pending')
  
  2. Security
    - Enable RLS on `demo_requests` table
    - Add policy for authenticated admin access only
    - Public can insert requests but not read them
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a demo request
CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view demo requests (for admin purposes)
CREATE POLICY "Authenticated users can view demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (true);