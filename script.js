let model;
let video = document.getElementById("camera");
let captureButton = document.getElementById("capture");
let resultDiv = document.getElementById("result");
let capturedImageElement = document.getElementById("capturedImage");

// Load the Teachable Machine model
async function loadModel() {
    try {
        model = await tmImage.load("my_model/model.json", "my_model/metadata.json");
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
        resultDiv.innerText = "Failed to load the model!";
    }
}

// Start the camera (back camera preferred)
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false
        });
        video.srcObject = stream;
        video.play();
        console.log("Camera started");
    } catch (error) {
        console.error("Camera access error:", error);
        resultDiv.innerText = "Camera access failed! Please allow camera permissions.";
    }
}

// Capture image and run prediction
captureButton.addEventListener("click", async () => {
    if (!model) {
        resultDiv.innerText = "Model not loaded yet!";
        return;
    }

    // Create a canvas to capture the video frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Display captured image
    capturedImageElement.src = canvas.toDataURL("image/png");

    resultDiv.innerText = "Processing...";

    try {
        // Run prediction
        const prediction = await model.predict(canvas);
        if (prediction && prediction.length > 0) {
            // Get the highest probability label
            prediction.sort((a, b) => b.probability - a.probability);
            resultDiv.innerText = `Prediction: ${prediction[0].className} (${(prediction[0].probability * 100).toFixed(2)}%)`;
        } else {
            resultDiv.innerText = "No prediction result!";
        }
    } catch (error) {
        console.error("Prediction error:", error);
        resultDiv.innerText = "Error running prediction!";
    }
});

// Initialize
window.onload = async () => {
    await loadModel();
    await startCamera();
};
