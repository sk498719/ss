/*
  # Add Notifications System and Update Roles

  ## New Tables
  
  ### `notifications`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - recipient of notification
  - `type` (text) - 'new_content', 'new_community_post', 'new_article'
  - `title` (text) - notification title
  - `message` (text) - notification message
  - `link` (text) - URL to navigate to
  - `is_read` (boolean) - whether notification has been read
  - `created_at` (timestamptz)

  ## Updates
  - Update profiles.role to support 'admin' and 'facilitator' values
  - Add order_index to collections table

  ## Security
  - Enable RLS on notifications table
  - Users can only view and update their own notifications
  - Admins and facilitators can create notifications
*/

-- Update role constraint on profiles to include admin and facilitator
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('member', 'admin', 'facilitator'));

-- Add order_index to collections if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE collections ADD COLUMN order_index integer DEFAULT 0;
  END IF;
END $$;

-- Add order_index to collection_items if needed (rename from sort_order)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collection_items' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE collection_items ADD COLUMN order_index integer DEFAULT 0;
    UPDATE collection_items SET order_index = COALESCE(sort_order, 0);
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('new_content', 'new_community_post', 'new_article')),
  title text NOT NULL,
  message text NOT NULL,
  link text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can create notifications for all users
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_collections_order ON collections(order_index);
CREATE INDEX IF NOT EXISTS idx_collection_items_order ON collection_items(order_index);

-- Update RLS policies for collections to allow admins and facilitators to manage
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
DROP POLICY IF EXISTS "Admins and facilitators can insert collections" ON collections;
DROP POLICY IF EXISTS "Admins and facilitators can update collections" ON collections;
DROP POLICY IF EXISTS "Admins and facilitators can delete collections" ON collections;

CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and facilitators can manage collections"
  ON collections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  );

-- Update RLS policies for collection_items
DROP POLICY IF EXISTS "Collection items are viewable by everyone" ON collection_items;
DROP POLICY IF EXISTS "Admins and facilitators can manage collection items" ON collection_items;

CREATE POLICY "Collection items are viewable by everyone"
  ON collection_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and facilitators can manage collection items"
  ON collection_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  );

-- Update RLS policies for content to allow admins and facilitators to manage
DROP POLICY IF EXISTS "Content is viewable by everyone" ON content;
DROP POLICY IF EXISTS "Admins and facilitators can manage content" ON content;

CREATE POLICY "Content is viewable by everyone"
  ON content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and facilitators can manage content"
  ON content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  );

-- Update RLS policies for instructors
DROP POLICY IF EXISTS "Instructors are viewable by everyone" ON instructors;
DROP POLICY IF EXISTS "Admins and facilitators can manage instructors" ON instructors;

CREATE POLICY "Instructors are viewable by everyone"
  ON instructors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and facilitators can manage instructors"
  ON instructors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  );

-- Update RLS policies for articles
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON articles;
DROP POLICY IF EXISTS "Admins and facilitators can manage articles" ON articles;

CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and facilitators can manage articles"
  ON articles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'facilitator')
    )
  );
