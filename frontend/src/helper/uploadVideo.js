const MAX_FALLBACK_SIZE = 12 * 1024 * 1024;
const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;

const toDataUrl = (file) => new Promise((resolve, reject) => {
  if (file.size > MAX_FALLBACK_SIZE) {
    reject(new Error('Cloud storage is not configured. Videos must be under 12MB for local fallback.'));
    return;
  }
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read the selected video.'));
  reader.readAsDataURL(file);
});

const uploadVideo = async (file) => {
  if (!file?.type?.startsWith('video/')) throw new Error('Please select a valid video file.');
  if (file.size > 100 * 1024 * 1024) throw new Error('Video must be smaller than 100MB.');

  if (!cloudName || cloudName.includes('your')) return toDataUrl(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mern_product');
  formData.append('folder', 'adoo-property-videos');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, { method: 'POST', body: formData });
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(result.error?.message || 'Video upload failed.');
  return result.secure_url || result.url;
};

export default uploadVideo;
