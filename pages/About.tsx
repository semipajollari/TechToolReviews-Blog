import React from 'react';
import { BRAND_NAME } from '../constants';
import { useLanguage } from '../i18n';

const About: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-32 pb-20 space-y-24 bg-white dark:bg-gray-950 transition-colors">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-gray-50 mb-8 tracking-tight">{t.about.mission}.</h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
          {t.about.missionText}
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
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">{t.about.whyWeStarted}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {t.about.whyWeStartedText1}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {t.about.whyWeStartedText2}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">500+</span>
                <span className="text-xs font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.about.toolsTested}</span>
              </div>
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 block mb-1">100k+</span>
                <span className="text-xs font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">{t.about.monthlyReaders}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-black py-24 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-gray-50 mb-16 uppercase tracking-tight">{t.about.techToolStandard}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-vial text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">{t.about.rigorousTesting}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{t.about.rigorousTestingText}</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-shield-alt text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">{t.about.unbiasedReviews}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{t.about.unbiasedReviewsText}</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                <i className="fas fa-sync text-2xl"></i>
              </div>
              <h3 className="text-xl font-black dark:text-gray-50 uppercase tracking-tight">{t.about.constantUpdates}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{t.about.constantUpdatesText}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;