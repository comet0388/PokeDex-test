const URL = "./my_model/";
let model;
let cameraStream;

// Load model when page loads
window.onload = async function() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");

    // Start camera
    const video = document.getElementById("camera");
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = cameraStream;
};

// Capture photo and predict
document.getElementById("capture").addEventListener("click", async () => {
    const video = document.getElementById("camera");

    // Create a temporary canvas to capture image frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Run prediction
    const prediction = await model.predict(canvas);
    const topPrediction = prediction.reduce((max, p) => 
        p.probability > max.probability ? p : max
    );

    // Display result
    document.getElementById("result").innerHTML = 
        `Detected: <strong>${topPrediction.className}</strong> 
         (${(topPrediction.probability * 100).toFixed(2)}%)`;
});
