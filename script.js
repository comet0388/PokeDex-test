const video = document.getElementById('camera');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');
const capturedImage = document.getElementById('capturedImage');

// Debug permission state
if (navigator.permissions) {
  navigator.permissions.query({ name: 'camera' })
    .then(result => {
      console.log('Camera permission state:', result.state);
      resultDiv.innerText = `Permission state: ${result.state}`;
    })
    .catch(err => console.error('Permission API error:', err));
} else {
  console.log('Permissions API not supported');
}

// Initialize camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }, // Rear camera preferred
      audio: false
    });
    video.srcObject = stream;
    console.log('Camera started successfully');
    resultDiv.innerText = "Camera started. Ready to capture!";
  } catch (err) {
    console.error('Camera access error:', err);
    resultDiv.innerText = "Camera access failed. Check permissions in settings.";
  }
}

initCamera();

// Capture frame
captureButton.addEventListener('click', () => {
  if (!video.srcObject) {
    resultDiv.innerText = "Camera not active. Check permissions.";
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImage.src = canvas.toDataURL('image/png');
  capturedImage.style.display = 'block';
  resultDiv.innerText = "Image captured! Ready for processing...";
});
