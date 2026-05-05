import React from 'react';
import { Globe, Search, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface SEOFieldsProps {
  slug: string;
  setSlug: (val: string) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  ogImage: string;
  setOgImage: (val: string) => void;
  titlePlaceholder?: string;
  urlPrefix?: string;
}

const SEOFields: React.FC<SEOFieldsProps> = ({
  slug, setSlug,
  seoTitle, setSeoTitle,
  seoDescription, setSeoDescription,
  ogImage, setOgImage,
  titlePlaceholder = "Page Title",
  urlPrefix = ""
}) => {
  const displayPrefix = urlPrefix ? `${urlPrefix.replace(/^\/|\/$/g, '')} › ` : '';
  const inputPrefix = `/${urlPrefix ? `${urlPrefix.replace(/^\/|\/$/g, '')}/` : ''}`;

  return (
    <div className="space-y-6 bg-stone-50/50 p-6 rounded-xl border border-stone-200">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-stone-600" />
        <h3 className="text-lg font-medium text-stone-900">Search Engine Optimization (SEO)</h3>
      </div>

      {/* Google Preview */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm mb-6 max-w-2xl">
        <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          <span>secera.id › {displayPrefix}{slug || '...'}</span>
        </div>
        <div className="text-blue-700 text-xl font-medium hover:underline cursor-pointer mb-1 truncate">
          {seoTitle || titlePlaceholder}
        </div>
        <div className="text-stone-600 text-sm line-clamp-2">
          {seoDescription || "Provide a meta description to see how your page might appear in search results."}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Slug */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <LinkIcon className="w-4 h-4" />
            Custom URL Slug
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">{inputPrefix}</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="custom-slug-here"
              style={{ paddingLeft: `${(inputPrefix.length * 0.6) + 0.5}rem` }}
              className="w-full pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all"
            />
          </div>
          <p className="text-[11px] text-stone-500">Only alphanumeric characters and hyphens allowed.</p>
        </div>

        {/* OG Image */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <ImageIcon className="w-4 h-4" />
            Social Share Image (OG Image URL)
          </label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">Meta Title</label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder={titlePlaceholder}
          maxLength={60}
          className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all"
        />
        <div className="flex justify-between items-center px-1">
          <p className="text-[11px] text-stone-500">Appears as the clickable headline in search results.</p>
          <span className={`text-[10px] ${seoTitle.length > 55 ? 'text-amber-500' : 'text-stone-400'}`}>
            {seoTitle.length}/60
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">Meta Description</label>
        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder="Enter description for search engines..."
          maxLength={160}
          rows={3}
          className="w-full px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all resize-none"
        />
        <div className="flex justify-between items-center px-1">
          <p className="text-[11px] text-stone-500">Brief summary of the page content (120-160 characters).</p>
          <span className={`text-[10px] ${seoDescription.length > 150 ? 'text-amber-500' : 'text-stone-400'}`}>
            {seoDescription.length}/160
          </span>
        </div>
      </div>
    </div>
  );
};

export default SEOFields;
