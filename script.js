let model;
let video = document.getElementById("camera");
let captureBtn = document.getElementById("capture");
let resultDiv = document.getElementById("result");
let snapshotImg = document.getElementById("snapshot");

const URL = "./model/"; // Path to your model folder

async function init() {
  try {
    model = await tmImage.load(`${URL}model.json`, `${URL}metadata.json`);
    console.log("Model loaded!");

    // Force back camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    });

    video.srcObject = stream;
  } catch (error) {
    console.error("Camera access failed:", error);
    resultDiv.innerText = "Camera access failed. Check permissions or try another browser.";
  }
}

captureBtn.addEventListener("click", async () => {
  try {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    snapshotImg.src = canvas.toDataURL("image/png");
    snapshotImg.style.display = "block";

    const prediction = await model.predict(canvas);
    let topPrediction = prediction.reduce((max, item) => item.probability > max.probability ? item : max);

    resultDiv.innerText = `Prediction: ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(2)}%)`;
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "Prediction failed.";
  }
});

init();
