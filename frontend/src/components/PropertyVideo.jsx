import React from 'react';

const getEmbedUrl = (url = '') => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (host.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host.includes('dailymotion.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.dailymotion.com/embed/video/${id}` : null;
    }
    if (host === 'dai.ly') return `https://www.dailymotion.com/embed/video/${parsed.pathname.slice(1)}`;
  } catch (error) {
    return null;
  }
  return null;
};

const PropertyVideo = ({ src, poster, className = 'w-full aspect-video', muted = false, onError, onLoadedMetadata }) => {
  if (!src) return null;
  const embedUrl = getEmbedUrl(src);
  if (embedUrl) return <iframe src={embedUrl} title="Property walkthrough video" className={className} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  return <video key={src} src={src} controls playsInline preload="metadata" poster={poster} muted={muted} onError={onError} onLoadedMetadata={onLoadedMetadata} className={className} />;
};

export default PropertyVideo;
