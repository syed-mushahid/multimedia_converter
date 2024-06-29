const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // Prevent CORS issues
      image.src = url;
    });
  
  export default async function getCroppedImg(imageSrc, crop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const safeCrop = (crop) => ({
      x: Math.max(0, crop.x),
      y: Math.max(0, crop.y),
      width: Math.max(0, crop.width),
      height: Math.max(0, crop.height),
    });
  
    const safeCropParams = safeCrop(crop);
  
    canvas.width = safeCropParams.width;
    canvas.height = safeCropParams.height;
  
    ctx.drawImage(
      image,
      safeCropParams.x,
      safeCropParams.y,
      safeCropParams.width,
      safeCropParams.height,
      0,
      0,
      safeCropParams.width,
      safeCropParams.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  }
  