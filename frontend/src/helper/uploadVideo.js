import API_BASE_URL from '../config/api';

const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;

const uploadVideo = async (file) => {
  if (!file?.type?.startsWith('video/')) throw new Error('Please select a valid video file.');
  if (file.size > 100 * 1024 * 1024) throw new Error('Video must be smaller than 100MB.');

  if (!cloudName || cloudName.includes('your')) {
    const localFormData = new FormData();
    localFormData.append('video', file);
    const localResponse = await fetch(`${API_BASE_URL}/api/admin/upload-video`, { method: 'POST', credentials: 'include', body: localFormData });
    const localResult = await localResponse.json();
    if (!localResponse.ok || !localResult.success) throw new Error(localResult.message || 'Video upload failed.');
    return localResult.data.url;
  }

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
