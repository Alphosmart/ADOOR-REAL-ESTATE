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

// Still image for a video, used where a listing has a video but no photos
export const getVideoThumbnail = (url = '') => {
  const embedUrl = getEmbedUrl(url);
  if (!embedUrl?.startsWith('https://www.youtube.com/embed/')) return null;
  return `https://img.youtube.com/vi/${embedUrl.split('/').pop()}/hqdefault.jpg`;
};

export const VideoThumbnail = ({ src, alt = 'Property video', className = '' }) => {
  if (!src) return null;
  const thumbnail = getVideoThumbnail(src);
  if (thumbnail) return <img src={thumbnail} alt={alt} loading="lazy" className={className} />;
  // Direct files: the #t fragment makes the browser paint the first frame
  if (!getEmbedUrl(src)) return <video src={`${src}#t=0.1`} muted playsInline preload="metadata" className={className} />;
  return <div className={`flex items-center justify-center text-4xl text-gray-500 ${className}`}>▶</div>;
};

export default PropertyVideo;
