/*
  # Fix RLS Policy for demo_requests table

  1. Changes
    - Drop the overly permissive RLS policy that allows unrestricted anonymous INSERT
    - Demo requests should only be submitted through the edge function (which uses service role key)
    - This prevents direct database access from bypassing validation and email notification logic
  
  2. Security
    - Removes `WITH CHECK (true)` policy that was flagged as insecure
    - Edge function uses service role key and bypasses RLS (as intended)
    - Anonymous users cannot directly insert into the table
    - Only authenticated users can view demo requests (existing policy remains)
  
  3. Notes
    - The edge function validates all required fields before insertion
    - Email notifications are sent when requests are submitted through the function
    - This ensures all demo requests go through proper validation and notification flow
*/

-- Drop the insecure policy that allows unrestricted anonymous INSERT
DROP POLICY IF EXISTS "Anyone can submit demo requests" ON demo_requests;

-- No replacement policy needed - the edge function uses service role key to bypass RLS
-- This is secure because:
-- 1. The edge function validates all inputs
-- 2. The edge function sends email notifications
-- 3. Direct database access is prevented for anonymous users
