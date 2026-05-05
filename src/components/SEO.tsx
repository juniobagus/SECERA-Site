import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  ogImage, 
  canonicalUrl,
  type = 'website'
}) => {
  const siteName = 'SECERA';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Secera menghadirkan koleksi modest fashion modern dengan kualitas premium dan desain eksklusif.";
  const metaDescription = description || defaultDescription;
  const url = canonicalUrl || window.location.href;
  const image = ogImage || '/og-image-default.jpg'; // Path to default OG image

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
