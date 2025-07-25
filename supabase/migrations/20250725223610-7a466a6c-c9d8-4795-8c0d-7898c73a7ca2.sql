-- Enable RLS on sites table
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Create policies for sites table
CREATE POLICY "Sites are publicly readable" 
ON sites 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage sites" 
ON sites 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Update storage policies to be more restrictive
DROP POLICY IF EXISTS "Allow public uploads to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from blog-images" ON storage.objects;

-- Create more secure storage policies
CREATE POLICY "Allow authenticated users to upload to blog-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
  AND (storage.extension(name) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif']))
  AND octet_length(name) < 500
);

CREATE POLICY "Allow authenticated users to update blog-images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow authenticated users to delete from blog-images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Blog images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');