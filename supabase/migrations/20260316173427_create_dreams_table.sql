/*
  # DreamScale AI - Dreams Journal Schema

  1. New Tables
    - `dreams`
      - `id` (uuid, primary key) - Unique identifier for each dream entry
      - `user_id` (uuid, foreign key) - References auth.users, links dream to user
      - `dream_content` (text) - The user's dream description
      - `mood` (text) - Dominant feeling (joy, sad, creepy, mysterious, overwhelming)
      - `analysis` (text) - AI-generated psychological analysis of the dream
      - `created_at` (timestamptz) - When the dream was recorded
      - `updated_at` (timestamptz) - Last modification timestamp

  2. Security
    - Enable RLS on `dreams` table
    - Add policy for users to read their own dreams
    - Add policy for users to insert their own dreams
    - Add policy for users to update their own dreams
    - Add policy for users to delete their own dreams

  3. Notes
    - All dream entries are private to the user who created them
    - Timestamps auto-update for tracking purposes
*/

CREATE TABLE IF NOT EXISTS dreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dream_content text NOT NULL,
  mood text NOT NULL,
  analysis text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dreams"
  ON dreams FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dreams"
  ON dreams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams"
  ON dreams FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams"
  ON dreams FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS dreams_user_id_idx ON dreams(user_id);
CREATE INDEX IF NOT EXISTS dreams_created_at_idx ON dreams(created_at DESC);