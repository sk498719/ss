/*
  # Add Community Likes Feature

  ## Overview
  This migration adds social features to community posts:
  - Adds a `likes_count` column to track total likes on posts
  - Creates a `post_likes` table to track which users liked which posts
  - Adds RLS policies for secure like management

  ## New Columns
  - `community_posts.likes_count` (integer, default 0) - Cached count of likes

  ## New Tables
  - `post_likes`
    - `id` (uuid, primary key)
    - `post_id` (uuid, foreign key to community_posts)
    - `user_id` (uuid, foreign key to profiles)
    - `created_at` (timestamptz)
    - Unique constraint on (post_id, user_id)

  ## Security
  - Enable RLS on `post_likes` table
  - Policy: Users can view all likes
  - Policy: Users can insert their own likes
  - Policy: Users can delete their own likes
*/

-- Add likes_count to community_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN likes_count integer DEFAULT 0;
  END IF;
END $$;

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all likes
CREATE POLICY "Anyone can view likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can insert their own likes
CREATE POLICY "Users can like posts"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can unlike posts"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes count
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_likes_count_trigger'
  ) THEN
    CREATE TRIGGER update_likes_count_trigger
      AFTER INSERT OR DELETE ON post_likes
      FOR EACH ROW
      EXECUTE FUNCTION update_post_likes_count();
  END IF;
END $$;