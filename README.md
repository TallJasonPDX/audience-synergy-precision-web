# AudienceSynergy - Healthcare Data Targeting Platform

AudienceSynergy is a precision healthcare audience targeting platform that provides deterministic, NPI-verified physician data for healthcare marketing campaigns. Our platform enables pharmaceutical companies, medical device manufacturers, and healthcare service providers to reach the right healthcare professionals with unprecedented accuracy.

## 🎯 Platform Overview

### Core Value Proposition
- **Deterministic Targeting**: NPI-verified physician data for 93% coverage of US physicians
- **Precision Marketing**: Move beyond behavioral assumptions to verified healthcare professional data
- **Physician-Level Reporting**: Detailed analytics and engagement metrics
- **High Performance**: 4.7% average CTR on HCP banner campaigns

### Target Audience
- Pharmaceutical companies
- Medical device manufacturers
- Healthcare technology companies
- Medical education providers
- Healthcare service organizations

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing and navigation
- **TanStack Query** - Server state management and caching
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates
- **Edge Functions** - Serverless API endpoints (Deno runtime)

### Deployment & Hosting
- **Lovable Platform** - Integrated development and hosting
- **Custom domain support** - Professional domain configuration
- **Automatic deployments** - CI/CD pipeline integration

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── Hero.tsx         # Landing page hero section
│   ├── ValueProposition.tsx  # Deterministic vs traditional comparison
│   ├── AudienceTypes.tsx     # Target audience showcase
│   ├── ServiceOptions.tsx    # Service offerings
│   ├── KeyMetrics.tsx   # Performance metrics display
│   ├── SocialProof.tsx  # Testimonials and case studies
│   ├── CTASection.tsx   # Call-to-action sections
│   ├── Header.tsx       # Navigation header
│   └── Footer.tsx       # Site footer
├── pages/               # Route components
│   ├── Index.tsx        # Homepage
│   ├── Audiences.tsx    # Audience targeting page
│   ├── Industries.tsx   # Industry solutions
│   ├── Services.tsx     # Service offerings
│   ├── Blog.tsx         # Blog listing page
│   ├── BlogPost.tsx     # Individual blog post
│   └── NotFound.tsx     # 404 error page
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
└── assets/              # Static assets and images
```

## 🎨 Design System

### Color Palette
The platform uses a sophisticated healthcare-focused color scheme:
- **Primary**: Professional blue tones for trust and reliability
- **Secondary**: Complementary accent colors for CTAs and highlights
- **Semantic colors**: Success, warning, error, and info states
- **Dark/Light modes**: Full theme support with automatic switching

### Typography
- **Inter font family** - Clean, modern, and highly readable
- **Responsive scale** - Fluid typography that adapts to screen sizes
- **Semantic hierarchy** - Clear content structure and information flow

### Components
- **Consistent spacing** - 8px grid system for perfect alignment
- **Accessible interactions** - WCAG compliant hover, focus, and active states
- **Responsive design** - Mobile-first approach with breakpoint optimization

## 📊 Blog System

### Database Schema
```sql
-- Blog Categories
blog_categories (id, name, slug, description, created_at)

-- Blog Authors  
blog_authors (id, name, email, bio, avatar_url, created_at)

-- Blog Posts
blog_posts (id, title, slug, excerpt, content, featured_image_url, 
           published, published_at, category_id, author_id, created_at, updated_at)
```

### Features
- **Category filtering** - Organize content by healthcare topics
- **Author management** - Multiple authors with profiles and bios
- **Rich content** - HTML content support with images and formatting
- **SEO optimization** - Slug-based URLs and meta information
- **Publication workflow** - Draft and published states
- **Responsive design** - Optimized reading experience across devices

### Content Management
- **Supabase backend** - Secure, scalable content storage
- **RLS policies** - Published content publicly accessible
- **Real-time updates** - Instant content synchronization
- **Image handling** - Featured images and inline content images

## 🚀 Blog API

### API Endpoint
```
POST https://hnjqgdttknlyarxijpsy.supabase.co/functions/v1/blog-api
```

### Authentication
The API uses bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_BLOG_API_TOKEN
```

### Request Format
```json
{
  "title": "Your Blog Post Title",
  "content": "<p>Your HTML content...</p>",
  "excerpt": "Brief excerpt (optional)",
  "category": "Category Name (optional - creates if doesn't exist)",
  "author": "Author Name (optional - creates if doesn't exist)",
  "featured_image_url": "https://example.com/image.jpg (optional)",
  "published": true
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Your Blog Post Title",
    "slug": "your-blog-post-title",
    "published": true,
    "category": "Category Name",
    "author": "Author Name",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Responses
- **400 Bad Request** - Missing required fields or validation errors
- **401 Unauthorized** - Invalid or missing API token
- **409 Conflict** - Post with same slug already exists
- **500 Internal Server Error** - Server error

### Features
- **Automatic slug generation** - SEO-friendly URLs from titles
- **Category auto-creation** - Creates new categories if they don't exist
- **Author auto-creation** - Creates new authors if they don't exist
- **Duplicate prevention** - Prevents posts with identical slugs
- **Flexible publishing** - Create drafts or publish immediately
- **Rich content support** - Full HTML content with images

### Usage Examples

#### Create Published Post
```bash
curl -X POST https://hnjqgdttknlyarxijpsy.supabase.co/functions/v1/blog-api \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Healthcare Data Revolution",
    "content": "<p>The future of healthcare targeting...</p>",
    "excerpt": "Exploring the latest trends in healthcare data",
    "category": "Industry Insights",
    "author": "AudienceSynergy Team",
    "published": true
  }'
```

#### Create Draft Post
```bash
curl -X POST https://hnjqgdttknlyarxijpsy.supabase.co/functions/v1/blog-api \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Draft Article",
    "content": "<p>Work in progress...</p>",
    "published": false
  }'
```

### Setup Requirements
1. Configure `BLOG_API_TOKEN` secret in Supabase project settings
2. Ensure proper RLS policies are in place for blog tables
3. API token should be kept secure and not exposed in frontend code

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ with npm
- Git for version control

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd audiencesynergy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The project uses Supabase for backend services. Configuration is handled automatically through the Lovable platform integration.

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Standards
- **TypeScript strict mode** - Full type safety enforcement
- **ESLint configuration** - Consistent code style and quality
- **Component organization** - Single responsibility and reusability
- **Custom hooks** - Shared logic extraction and testing

## 🎯 Key Features

### Lead Generation
- **Contact forms** - Multiple touchpoints for lead capture
- **Demo scheduling** - Calendar integration for sales meetings
- **Newsletter signup** - Content marketing and nurturing
- **Consent management** - GDPR/CCPA compliant data collection

### Performance Monitoring
- **Real-time metrics** - Live dashboard with key performance indicators
- **Analytics integration** - Comprehensive user behavior tracking
- **Conversion tracking** - Lead generation and campaign effectiveness

### Content Marketing
- **Healthcare blog** - Industry insights and thought leadership
- **Resource library** - Whitepapers, case studies, and guides
- **SEO optimization** - Search engine visibility and organic growth

## 🚀 Deployment

### Lovable Platform
The project is configured for seamless deployment on the Lovable platform:
- **Automatic builds** - Triggered by code changes
- **Preview environments** - Branch-based staging deployments
- **Custom domains** - Professional domain configuration
- **SSL certificates** - Automatic HTTPS encryption

### Manual Deployment
For alternative hosting providers:
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## 📝 License

This project is proprietary software developed for AudienceSynergy's healthcare targeting platform.

## 🤝 Contributing

This is a private project. For internal development guidelines and contribution standards, please refer to the internal development documentation.

---

Built with ❤️ for the healthcare marketing industry