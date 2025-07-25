-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog authors table
CREATE TABLE public.blog_authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  author_id UUID REFERENCES public.blog_authors(id),
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public reading
CREATE POLICY "Blog categories are publicly readable"
ON public.blog_categories FOR SELECT
USING (true);

CREATE POLICY "Blog authors are publicly readable"
ON public.blog_authors FOR SELECT
USING (true);

CREATE POLICY "Published blog posts are publicly readable"
ON public.blog_posts FOR SELECT
USING (published = true);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON public.blog_categories(slug);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Industry News', 'industry-news', 'Latest news and trends in healthcare marketing'),
('Case Studies', 'case-studies', 'Real-world examples of successful healthcare campaigns'),
('Best Practices', 'best-practices', 'Tips and strategies for healthcare marketing'),
('Regulatory Updates', 'regulatory-updates', 'Important compliance and regulatory changes');

-- Insert a default author
INSERT INTO public.blog_authors (name, email, bio) VALUES
('AudienceSynergy Team', 'content@audiencesynergy.com', 'Healthcare marketing experts dedicated to helping you reach the right audiences with precision and compliance.');