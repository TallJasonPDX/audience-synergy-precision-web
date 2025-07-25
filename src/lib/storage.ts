import { supabase } from "@/integrations/supabase/client";

/**
 * Get the public URL for a file in the blog-images bucket
 */
export function getBlogImageUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(path);
    
  return data.publicUrl;
}

/**
 * Upload an image to the blog-images bucket
 */
export async function uploadBlogImage(
  file: File, 
  folder: 'featured' | 'content' | 'thumbnails' = 'content'
): Promise<{ path: string; url: string } | null> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filename, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const url = getBlogImageUrl(data.path);
    
    return {
      path: data.path,
      url
    };
  } catch (error) {
    console.error('Error in uploadBlogImage:', error);
    return null;
  }
}

/**
 * Delete an image from the blog-images bucket
 */
export async function deleteBlogImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([path]);
      
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBlogImage:', error);
    return false;
  }
}