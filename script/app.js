const qr = new QRious({
  element: document.getElementById('qr'),
  size: 260,
  background: "white",
  foreground: "#0f172a", // Darker foreground for better contrast in the new theme
  level: 'H' // High error correction for better reliability
});

const resultWrapper = document.getElementById('resultWrapper');
const resultText = document.getElementById('resultText');
const uploadInput = document.getElementById('uploadInput');
let decodedData = "";

// Generate QR Code
document.getElementById('generateBtn').onclick = () => {
  const value = document.getElementById('textInput').value.trim();
  if (!value) {
    showNotification("Please enter some text!", "error");
    return;
  }
  qr.value = value;
  showNotification("QR Code generated successfully!", "success");
};

// Download QR Code
document.getElementById('downloadBtn').onclick = () => {
  const canvas = document.getElementById('qr');
  if (qr.value === "https://github.com/neocotic/qrious") {
    showNotification("Please generate a QR code first!", "error");
    return;
  }
  const link = document.createElement('a');
  link.download = `QR_Pro_${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showNotification("Image download started!", "success");
};

// Handle File Upload & Decoding
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
        decodedData = code.data.trim();
        resultText.innerText = decodedData;
        resultWrapper.classList.remove('hidden');
        showNotification("QR Code decoded successfully!", "success");
      } else {
        showNotification("No QR Code detected in this image.", "error");
        decodedData = "";
        resultWrapper.classList.add('hidden');
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};

// Copy to Clipboard
document.getElementById('copyBtn').onclick = function() {
  if (!decodedData) return;
  
  navigator.clipboard.writeText(decodedData).then(() => {
    const original = this.innerHTML;
    this.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => { this.innerHTML = original; }, 2000);
    showNotification("Copied to clipboard!", "success");
  });
};

// Visit Link
document.getElementById('visitBtn').onclick = function() {
  if (!decodedData) return;

  const isProtocol = decodedData.startsWith("http://") || decodedData.startsWith("https://");
  const isWww = decodedData.toLowerCase().startsWith("www.");
  const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(decodedData);

  let url;
  if (isProtocol) {
    url = decodedData;
  } else if (isWww || isDomain) {
    url = `https://${decodedData}`;
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(decodedData)}`;
  }
  window.open(url, '_blank');
};

// Helper: Simple Notification (Toast System)
function showNotification(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      container.removeChild(toast);
    }, 400);
  }, 3000);
}