import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { getBlogImageUrl } from "@/lib/storage";
import DOMPurify from 'dompurify';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  published_at: string;
  blog_categories: { name: string; slug: string } | null;
  blog_authors: { name: string; bio: string | null } | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          featured_image_url,
          published_at,
          blog_categories (name, slug),
          blog_authors (name, bio)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .eq('site_id', 'audiencesynergy')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Healthcare Media News
          </Link>

          {/* Article Header */}
          <article>
            <header className="mb-8">
              {post.blog_categories && (
                <Badge variant="secondary" className="mb-4">
                  {post.blog_categories.name}
                </Badge>
              )}
              
              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </div>
                {post.blog_authors && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.blog_authors.name}
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8">
                <img
                  src={getBlogImageUrl(post.featured_image_url)}
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary">
              <div dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
                  ALLOW_DATA_ATTR: false
                })
              }} />
            </div>

            {/* Author Bio */}
            {post.blog_authors?.bio && (
              <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  About {post.blog_authors.name}
                </h3>
                <p className="text-muted-foreground">
                  {post.blog_authors.bio}
                </p>
              </div>
            )}
          </article>

          {/* Call to Action */}
          <div className="mt-16 text-center p-8 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to reach your target healthcare audience?
            </h3>
            <p className="text-muted-foreground mb-4">
              Let's discuss how our precision targeting can help grow your practice or organization.
            </p>
            <Button asChild>
              <Link to="/#contact">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;