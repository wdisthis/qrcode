const qr = new QRious({
  element: document.getElementById('qr'),
  size: 260,
  background: "white"
});

document.getElementById('generateBtn').onclick = () => {
  const value = document.getElementById('textInput').value.trim();
  if (!value) {
    alert("Please enter some text!");
    return;
  }
  qr.value = value;
};

document.getElementById('downloadBtn').onclick = () => {
  const canvas = document.getElementById('qr');
  if (qr.value === "https://github.com/neocotic/qrious") {
    alert("Please generate a QR code first!");
    return;
  }
  const link = document.createElement('a');
  link.download = "qrcode_" + Date.now() + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

const uploadInput = document.getElementById('uploadInput');
const resultText = document.getElementById('resultText');
let decodedData = "";

uploadInput.onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function() {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width; canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        decodedData = code.data.trim();
        resultText.innerText = decodedData;
      } else {
        alert("No QR Code detected.");
        decodedData = "";
        resultText.innerText = "No QR Code detected.";
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};

document.getElementById('copyBtn').onclick = function() {
  if (!decodedData) {
    alert("Nothing to copy! Please scan an image first.");
    return;
  }
  navigator.clipboard.writeText(decodedData);
  const original = this.innerText;
  this.innerText = "Copied!";
  setTimeout(() => { this.innerText = original; }, 2000);
};

document.getElementById('visitBtn').onclick = function() {
  if (!decodedData) {
    alert("Nothing to visit! Please scan an image first.");
    return;
  }
  const isProtocol = decodedData.startsWith("http://") || decodedData.startsWith("https://");
  const isWww = decodedData.toLowerCase().startsWith("www.");
  const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(decodedData);

  if (isProtocol) {
    window.open(decodedData, '_blank');
  } else if (isWww || isDomain) {
    window.open(`https://${decodedData}`, '_blank');
  } else {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(decodedData)}`, '_blank');
  }
};