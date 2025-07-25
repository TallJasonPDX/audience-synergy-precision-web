import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlogImageUrl } from "@/lib/storage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  blog_categories: { name: string; slug: string } | null;
  blog_authors: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          blog_categories (name, slug),
          blog_authors (name)
        `)
        .eq('published', true)
        .eq('site_id', 'audiencesynergy')
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('blog_categories.slug', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
        .eq('site_id', 'audiencesynergy')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Healthcare Media News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest insights, trends, and best practices in healthcare marketing and audience targeting.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="mb-2"
          >
            All Posts
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.slug)}
              className="mb-2"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {selectedCategory ? 'No posts in this category yet.' : 'No blog posts have been published yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                {post.featured_image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                     <img
                       src={getBlogImageUrl(post.featured_image_url)}
                       alt={post.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {post.blog_categories && (
                      <Badge variant="secondary" className="text-xs">
                        {post.blog_categories.name}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(post.published_at)}
                      </div>
                      {post.blog_authors && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.blog_authors.name}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;