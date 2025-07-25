import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogPostPayload {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  featured_image_url?: string;
  published?: boolean;
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check authorization
    const authHeader = req.headers.get('Authorization');
    const blogApiToken = Deno.env.get('BLOG_API_TOKEN');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const providedToken = authHeader.replace('Bearer ', '');
    if (providedToken !== blogApiToken) {
      return new Response(JSON.stringify({ error: 'Invalid API token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const payload: BlogPostPayload = await req.json();

    // Validate required fields
    if (!payload.title || !payload.content) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: title and content are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate slug from title
    const slug = createSlug(payload.title);

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      return new Response(JSON.stringify({ 
        error: `A post with slug "${slug}" already exists` 
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle category lookup/creation
    let categoryId = null;
    if (payload.category) {
      const { data: existingCategory } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', payload.category)
        .single();

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        // Create new category
        const { data: newCategory, error: categoryError } = await supabase
          .from('blog_categories')
          .insert({
            name: payload.category,
            slug: createSlug(payload.category),
          })
          .select('id')
          .single();

        if (categoryError) {
          console.error('Error creating category:', categoryError);
          return new Response(JSON.stringify({ 
            error: 'Failed to create category' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        categoryId = newCategory.id;
      }
    }

    // Handle author lookup/creation
    let authorId = null;
    if (payload.author) {
      const { data: existingAuthor } = await supabase
        .from('blog_authors')
        .select('id')
        .eq('name', payload.author)
        .single();

      if (existingAuthor) {
        authorId = existingAuthor.id;
      } else {
        // Create new author with basic info
        const { data: newAuthor, error: authorError } = await supabase
          .from('blog_authors')
          .insert({
            name: payload.author,
            email: `${createSlug(payload.author)}@audiencesynergy.com`,
          })
          .select('id')
          .single();

        if (authorError) {
          console.error('Error creating author:', authorError);
          return new Response(JSON.stringify({ 
            error: 'Failed to create author' 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        authorId = newAuthor.id;
      }
    }

    // Create blog post
    const blogPostData = {
      title: payload.title,
      slug,
      content: payload.content,
      excerpt: payload.excerpt || null,
      category_id: categoryId,
      author_id: authorId,
      featured_image_url: payload.featured_image_url || null,
      published: payload.published ?? false,
      published_at: payload.published ? new Date().toISOString() : null,
    };

    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert(blogPostData)
      .select(`
        *,
        blog_categories(name),
        blog_authors(name)
      `)
      .single();

    if (postError) {
      console.error('Error creating blog post:', postError);
      return new Response(JSON.stringify({ 
        error: 'Failed to create blog post',
        details: postError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        published: newPost.published,
        category: newPost.blog_categories?.name,
        author: newPost.blog_authors?.name,
        created_at: newPost.created_at,
      }
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in blog-api function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});