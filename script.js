const setWave = (radius) => {
  const unit_size = "em";
  const size = 1;
  const height = radius + 3 / 3;
  const p = height * size;
  const r = +Math.sqrt(p * p + size * size).toFixed(2);
  const mask = `radial-gradient(${r}${unit_size} at 50% calc(100% - ${+(
    1 * size +
    p
  ).toFixed(2)}${unit_size}),#000 99%,#0000 101%) calc(50% - ${
    2 * size
  }${unit_size}) 0/${4 * size}${unit_size} 100%,
radial-gradient(${r}${unit_size} at 50% calc(100% + ${+p.toFixed(
    2
  )}${unit_size}),#0000 99%,#000 101%) 50% calc(100% - ${size}${unit_size})/${
    4 * size
  }${unit_size} 100% repeat-x`;

  document.querySelector(".top").style.setProperty("mask", mask);
};

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

window.addEventListener("scroll", () => {
  setWave(window.scrollY / 50);
});
setWave(window.scrollY);

const color = `hsl(${Math.random() * 360}deg, 72%, 60%)`;
document.querySelector(":root").style.setProperty("--accent", color);
setFaviconColor(color);
