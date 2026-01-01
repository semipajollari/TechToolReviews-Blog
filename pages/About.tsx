import React from 'react';
import { BRAND_NAME } from '../constants';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 space-y-24 bg-white dark:bg-gray-950 transition-colors">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-gray-50 mb-8 tracking-tight">Our Mission.</h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
          At {BRAND_NAME}, we believe technical complexity shouldn't be a barrier to business growth. We curate, test, and explain the modern tools that define the digital landscape.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
            alt="Team working" 
            className="rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800" 
          />
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Why we started this platform</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              Founded in 2024 by a group of developers and digital strategists, TechToolReviews was born out of frustration. The "best software" lists we saw online were filled with outdated recommendations and low-quality affiliate filler.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              We decided to build the resource we wanted to see: deeply technical, rigorously tested, and always focused on the "2026 perspective"—looking at where tools are going, not just where they've been.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">500+</span>
                <span className="text-xs font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">Tools Tested</span>
              </div>
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">100k+</span>
                <span className="text-xs font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">Monthly Readers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-black py-24 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-gray-50 mb-16 uppercase tracking-tight">The TechTool Standard</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-vial text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">Rigorous Testing</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">We don't just read the marketing copy. We set up real production environments and test workflows for at least 30 days before publishing.</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">Unbiased Reviews</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Our editorial team is separate from our business team. Our ratings cannot be bought or influenced by external partners.</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-sync text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">Constant Updates</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Software moves fast. We update our major guides every 90 days to ensure you're never reading outdated or legacy advice.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;