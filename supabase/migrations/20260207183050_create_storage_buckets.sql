/*
  # Create Storage Buckets for Images

  1. Storage Buckets
    - `article-images` - For article cover images
    - `content-images` - For content thumbnails and images
    - `collection-images` - For collection thumbnails
    - `profile-avatars` - For user profile pictures

  2. Security
    - Public read access for all buckets
    - Authenticated users can upload to article-images and content-images (admin check via RLS)
    - All users can upload profile avatars (with user ID verification)
    
  3. Policies
    - Public SELECT access
    - Authenticated INSERT with proper checks
    - Users can DELETE/UPDATE their own uploads
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('article-images', 'article-images', true),
  ('content-images', 'content-images', true),
  ('collection-images', 'collection-images', true),
  ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Article images policies (admin only)
CREATE POLICY "Public can view article images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'article-images');

CREATE POLICY "Admins can upload article images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can update article images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'article-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can delete article images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

-- Content images policies (admin only)
CREATE POLICY "Public can view content images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'content-images');

CREATE POLICY "Admins can upload content images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'content-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can update content images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'content-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can delete content images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'content-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

-- Collection images policies (admin only)
CREATE POLICY "Public can view collection images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'collection-images');

CREATE POLICY "Admins can upload collection images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'collection-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can update collection images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'collection-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

CREATE POLICY "Admins can delete collection images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'collection-images' 
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin'
  );

-- Profile avatars policies (users can manage their own)
CREATE POLICY "Public can view profile avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );