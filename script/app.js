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

document.getElementById("textInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") document.getElementById("generateBtn").click();
});

document.getElementById('downloadBtn').onclick = () => {
  const canvas = document.getElementById('qr');
  const link = document.createElement('a');
  link.download = "qrcode_" + Date.now() + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

const uploadInput = document.getElementById('uploadInput');
const resultWrapper = document.getElementById('resultWrapper');
const resultText = document.getElementById('resultText');
const actionGroup = document.getElementById('actionGroup');

uploadInput.onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function() {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        showResult(code.data);
      } else {
        alert("No QR Code detected.");
        resultWrapper.style.display = "none";
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};

function showResult(data) {
  resultWrapper.style.display = "block";
  resultText.innerText = data;
  actionGroup.innerHTML = ""; 

  const copyBtn = document.createElement('button');
  copyBtn.className = "primary-btn";
  copyBtn.innerText = "Copy to Clipboard";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(data);
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Copied!";
    setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
  };
  actionGroup.appendChild(copyBtn);

 const visitBtn = document.createElement('button');
  visitBtn.className = "primary-btn secondary-color";
  visitBtn.innerText = "Visit in Browser";
  visitBtn.onclick = () => {
    const trimmed = data.trim();
    
    const isProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://");
    const isWww = trimmed.toLowerCase().startsWith("www.");
    const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(trimmed);

    if (isProtocol) {
      window.open(trimmed, '_blank');
    } else if (isWww || isDomain) {
      window.open(`https://${trimmed}`, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(trimmed)}`, '_blank');
    }
  };
  actionGroup.appendChild(visitBtn);
}