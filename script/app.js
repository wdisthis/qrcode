const qr = new QRious({
  element: document.getElementById('qr'),
  size: 260,
  background: "white"
});

document.getElementById('generateBtn').onclick = () => {
  const value = document.getElementById('textInput').value.trim();
  if (!value) {
    alert("Input cannot be empty!");
    return;
  }
  qr.value = value;
};

document.getElementById("textInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    document.getElementById("generateBtn").click();
  }
});

document.getElementById('downloadBtn').onclick = () => {
  const canvas = document.getElementById('qr');
  const fileName = "qrcode_" + Date.now() + ".png";
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
};
