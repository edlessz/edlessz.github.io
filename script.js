const setFaviconColor = (color) => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;

  //draw circle
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, 2 * Math.PI);
  ctx.fill();

  const dataUrl = canvas.toDataURL();
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = dataUrl;
};

const color = `hsl(${Math.random() * 360}deg, 72%, 60%)`;
document.querySelector(":root").style.setProperty("--accent", color);
setFaviconColor(color);
