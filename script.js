const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const lastfm = async (user, method) => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=${method}&user=${user}&api_key=1f62f0c0081f372b2d4979b2ae154cbd&format=json`
  );
  const data = await response.json();
  return data;
};

lastfm("edscamera", "user.getRecentTracks").then((data) => {
  const newestTrack = data.recenttracks.track[0];

  $("#track-title").innerText = newestTrack.name;
  $("#track-artist").innerText = newestTrack.artist["#text"];
  $("#track-album").innerText = newestTrack.album["#text"];
  $("#track-image").src = newestTrack.image.find((x) => x.size === "large")[
    "#text"
  ];

  $$(".track-display").forEach((x) => (x.style.display = "flex"));
});

const canvas = $("canvas");
const g = canvas.getContext("2d");
const natural = (x) => 1 / (1 + Math.exp(-x));
const getShakeMult = (x) => natural(x - 4) - natural(x - 12);
const getSpaceMult = (x) => natural(x - 8);
const animate = () => {
  const container = $("#container");

  const start = performance.now();
  const stars = [...Array(100)].map((x) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.1,
  }));

  const angle = Math.random() * Math.PI;

  const loop = () => {
    const secondsEllapsed = (performance.now() - start) / 1000;
    const shakeMult = getShakeMult(secondsEllapsed);
    const randomX = (Math.random() - 0.5) * shakeMult;
    const randomY = (Math.random() - 0.5) * shakeMult;

    container.style.transform = `translate(${randomX}em, ${randomY}em)`;
    canvas.style.opacity = getSpaceMult(secondsEllapsed);

    g.fillStyle = "black";
    g.fillRect(0, 0, canvas.width, canvas.height);

    g.fillStyle = "white";
    stars.forEach((star) => {
      g.beginPath();
      g.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      g.fill();
      star.x += star.size * Math.cos(angle);
      star.y += star.size * Math.sin(angle);
      star.y += star.size * shakeMult * 10;
      if (star.x > canvas.width + star.size) star.x = -star.size;
      if (star.y > canvas.height + star.size) star.y = -star.size;
      if (star.x < -star.size) star.x = canvas.width + star.size;
      if (star.y < -star.size) star.y = canvas.height + star.size;
    });

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};

const launchBtn = $("#btn_launch");
launchBtn.addEventListener("click", () => {
  if (launchBtn.classList.contains("hide")) return;
  $("#btn_launch").classList.add("hide");
  animate();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
