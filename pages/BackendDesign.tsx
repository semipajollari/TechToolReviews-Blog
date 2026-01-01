
import React, { useEffect } from 'react';

const BackendDesign: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const CodeBlock = ({ title, code, language = 'json' }: { title: string; code: string; language?: string }) => (
    <div className="my-10 group">
      <div className="flex items-center justify-between bg-gray-900 dark:bg-black p-4 rounded-t-2xl border-x border-t border-gray-800">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</span>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
        </div>
      </div>
      <div className="bg-gray-950 p-6 sm:p-10 rounded-b-2xl border-x border-b border-gray-800 overflow-x-auto shadow-2xl relative">
        <pre className={`text-indigo-400 font-mono text-sm leading-relaxed`}>
          <code>{code}</code>
        </pre>
        <button className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
          <i className="far fa-copy"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20">
          <div className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full mb-8 text-[10px] font-black uppercase tracking-widest">
            <i className="fas fa-microchip"></i>
            <span>Architectural Spec v1.0</span>
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-gray-900 dark:text-gray-50 tracking-tightest leading-[0.9] mb-8">
            System <br/><span className="text-indigo-600">Blueprint.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
            A production-ready MongoDB architecture designed for global scalability, real-time affiliate tracking, and seamless content delivery.
          </p>
        </header>

        {/* 1. Database Models */}
        <section className="mb-24">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-database text-xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">MongoDB Collections</h2>
          </div>

          <CodeBlock 
            title="BlogPost Model Schema"
            code={`{
  _id: ObjectId,
  title: String,
  slug: { type: String, unique: true, index: true },
  content: String, // Rich Text / Markdown
  excerpt: String,
  featuredImage: String, // CDN URL
  images: [String],
  categoryId: { type: ObjectId, ref: 'Category' },
  tags: [String],
  affiliateLinks: [{
    label: String,
    url: String,
    position: { type: String, enum: ['top', 'middle', 'bottom', 'cta-box'] }
  }],
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  author: String,
  seoMeta: {
    title: String,
    description: String
  },
  createdAt: Date,
  updatedAt: Date
}`}
          />

          <CodeBlock 
            title="Subscriber & Social Tracking"
            code={`// Subscriber Schema
{
  _id: ObjectId,
  email: { type: String, unique: true, lowercase: true },
  isVerified: Boolean,
  subscribedAt: Date,
  source: { type: String, enum: ['website', 'popup', 'footer'] }
}

// SocialLink Analytics Schema
{
  _id: ObjectId,
  platform: { type: String, enum: ['instagram', 'linkedin'] },
  url: String,
  clickCount: { type: Number, default: 0 },
  lastClickedAt: Date
}`}
          />
        </section>

        {/* 2. API Routes */}
        <section className="mb-24">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-network-wired text-xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">RESTful Interface</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-12">
            {[
              { method: 'GET', path: '/api/posts', desc: 'Fetch articles with pagination & search.' },
              { method: 'GET', path: '/api/posts/:slug', desc: 'Retrieve single post by SEO slug.' },
              { method: 'POST', path: '/api/subscribe', desc: 'Register new email for newsletter.' },
              { method: 'GET', path: '/api/redirect/:platform', desc: 'Track analytics & redirect to social.' },
              { method: 'POST', path: '/api/media/upload', desc: 'S3/Cloudinary multi-part upload.' }
            ].map((route, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-600/30 transition-all">
                <span className={`inline-block px-3 py-1 rounded-lg font-black text-xs mb-3 sm:mb-0 sm:mr-6 w-fit ${route.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {route.method}
                </span>
                <code className="text-gray-900 dark:text-gray-200 font-bold mr-6 mb-2 sm:mb-0">{route.path}</code>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium sm:ml-auto">{route.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Logic & Strategy */}
        <section className="mb-24">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-brain text-xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">System Logic</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">1. Email Subscription Flow</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-medium">
              We implement a **Double-Opt-In** strategy. Upon POST to `/api/subscribe`, a JWT token is generated and emailed to the user. The verification link triggers `/api/subscribe/verify`, updating the `isVerified` flag. This prevents spam and ensures high deliverability (ESP: SendGrid/Postmark).
            </p>

            <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">2. Affiliate Link Tracking</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-medium">
              Instead of direct hard-coding, affiliate links are stored in the database. This allows for global updates to referral IDs without redeploying code. Analytics are handled via an interceptor route that logs click-through-rates (CTR) per article.
            </p>

            <div className="bg-indigo-600 text-white p-10 sm:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden my-16">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Production Guardrails</h3>
                <ul className="space-y-4 text-lg font-medium opacity-90">
                  <li className="flex items-start"><i className="fas fa-check-circle mt-1 mr-4"></i> Rate Limiting: 10 sub/hour per IP</li>
                  <li className="flex items-start"><i className="fas fa-check-circle mt-1 mr-4"></i> Redis Caching for frequent GET /posts</li>
                  <li className="flex items-start"><i className="fas fa-check-circle mt-1 mr-4"></i> Slug collisions check during pre-save hook</li>
                  <li className="flex items-start"><i className="fas fa-check-circle mt-1 mr-4"></i> Multi-region MongoDB Atlas cluster</li>
                </ul>
              </div>
              <div className="absolute top-[-10%] right-[-10%] opacity-10 rotate-12">
                 <i className="fas fa-shield-alt text-[20rem]"></i>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center pt-20 border-t border-gray-100 dark:border-gray-900">
           <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">End of Specification // 2026 Verified</p>
        </footer>
      </div>
    </div>
  );
};

export default BackendDesign;
