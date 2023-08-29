const $ = (arg) => document.querySelector(arg);
const mod = (n, m) => ((n % m) + m) % m;

const title = $("#title");
const visualData = {};
const visuals = [
    {
        "name": "Stars",
        "setup": (g, canvas) => {
            visualData.stars = [];
            for(let i = 0; i < 200; i++) {
                visualData.stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 5 + 3,
                });
            };
            visualData.angle = Math.random() * Math.PI * 2;
            
            visualData.changeXT = 0;
            visualData.changeYT = 0;
            visualData.changeX = 0;
            visualData.changeY = 0;
            window.addEventListener("mousemove", (evt) => {
                const mouseX = evt.pageX - title.offsetWidth / 2;
                const mouseY = evt.pageY - title.offsetHeight / 2;
                const angle = Math.atan2(mouseY, mouseX);

                visualData.changeXT = -Math.cos(angle) * Math.abs(mouseX / (title.offsetWidth / 2));
                visualData.changeYT = -Math.sin(angle) * Math.abs(mouseY / (title.offsetHeight / 2));
            });
        },
        "draw": (g, canvas) => {
            g.fillStyle = "#fff";
            visualData.stars.forEach(star => {
                g.beginPath();
                g.arc(
                    mod(star.x, canvas.width + star.size * 2) - star.size,
                    mod(star.y, canvas.height + star.size * 2) - star.size,
                    star.size, 0, Math.PI * 2);
                g.fill();

                star.x += star.size * visualData.changeX;
                star.y += star.size * visualData.changeY;
            });
            visualData.changeX += (visualData.changeXT - visualData.changeX) / 15;
            visualData.changeY += (visualData.changeYT - visualData.changeY) / 15;
        },
        foreground: "#fff",
        background: "#000",
    },
    {
        "name": "Clouds",
        "setup": (g, canvas) => {
            visualData.clouds = [];
            visualData.img = document.createElement("img");
            visualData.aspectRatio = 406 / 800;
            visualData.img.src = "./assets/cloud.png";
            const numOfClouds = is_fine ? 30 : 10;
            for(let i = 0; i < numOfClouds; i++) {
                visualData.clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 2 - canvas.height,
                    size: Math.random() * 300 + 100,
                });
            }
            visualData.mouseYT = 0;
            visualData.mouseY = 0;
            window.addEventListener("mousemove", (evt) => {
                visualData.mouseYT = (evt.pageY - title.offsetHeight / 2) / (canvas.height / 2);
            });
        },
        "draw": (g, canvas) => {
            visualData.mouseY += (visualData.mouseYT - visualData.mouseY) / 5;
            visualData.clouds.sort((a, b) => (a.size - b.size)).forEach(cloud => {
                g.filter = `contrast(${cloud.size / 400})`
                g.drawImage(visualData.img, cloud.x, cloud.y - visualData.mouseY * cloud.size, cloud.size, cloud.size * visualData.aspectRatio);
                cloud.x = mod(cloud.x + cloud.size, canvas.width + cloud.size) - cloud.size;
                cloud.x -= cloud.size / 50;
                g.filter = `contrast(1)`;
            });
        },
        foreground: "#fff",
        background: "#91c3c9",
    },
    {
        "name": "Cookie Wallpaper",
        "setup": (g, canvas) => {
            visualData.y = 0;
            visualData.yv = 0;
            visualData.x = 0;

            window.addEventListener("mousemove", (evt) => {
                visualData.mouseX = evt.clientX;
                visualData.mouseY = evt.clientY;
            });
        },
        "draw": (g, canvas) => {
            g.fillStyle = "#905ed1";
            for(let i = 0; i < visualData.x; i++) {
                g.fillRect((i * 2) * 30, 0, 30, window.innerHeight);
            }
            const width = 30;
            const x = visualData.x * 2 * width;
            g.fillRect(x, 0, width, visualData.y);
            if (visualData.mouseX > x && visualData.mouseX < x + width &&
                visualData.mouseY > visualData.y && visualData.mouseY < visualData.y + visualData.yv) {
                    visualData.yv = -15;
            }
            visualData.y += visualData.yv;
            visualData.yv += 1;
            
            if (visualData.y > window.innerHeight) {
                visualData.y = 0;
                visualData.yv = 0;
                visualData.x += 1;
            }
        },
        foreground: "#fff",
        background: "#6632a8",
    }
];

const is_fine = matchMedia('(pointer:fine)').matches;
const is_coarse = matchMedia('(pointer:coarse)').matches;

window.addEventListener("load", () => {
    let cascadeCards = [];
    if (is_fine) {
        // Setup card cascading effect
        window.setInterval(() => {
            if (cascadeCards.length > 0) {
                cascadeCards[0].style.animation = "content-card 1s forwards";
                cascadeCards = cascadeCards.slice(1);
            }
        }, 50);
    }
    // Navbar Buttons
    const navbar = $("#navbar");
    Array.from(navbar.children).forEach(btn => {
        const markerTarget = btn.getAttribute("markerTarget");
        if (markerTarget) btn.addEventListener("click", () => {
            if (markerTarget === "Home") {
                window.scrollTo({
                    behavior: "smooth",
                    top: 0,
                });
                return;
            }
            $(`[marker=${markerTarget}]`).scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
    });
    
    if (is_fine) {
        const evalAnimations = () => {
            // Navbar Scroll
            const navbarClosedWidth = parseInt(window.getComputedStyle($(":root")).getPropertyValue("--navbarClosedWidth").replace(/px/g, ""));
            navbar.setAttribute("expanded", window.scrollY < window.innerHeight);
            
            const animationProgess = Math.min(window.scrollY / window.innerHeight, 1);
            const rightHidden = -(window.innerWidth * .3) + navbarClosedWidth;
    
            navbar.style.right = `${animationProgess * rightHidden}px`;
            $(":root").style.setProperty("--contentWidth", `${(window.innerWidth + (1 - animationProgess) * rightHidden) - navbarClosedWidth}px`);
    
            // Content Cards
            Array.from(document.getElementsByClassName("content-card")).forEach(card => {
                const scrollMargin = 0;
    
                const cardPos = card.getBoundingClientRect();
                const cardEnabled = cardPos.top < (window.innerHeight - window.innerHeight * scrollMargin) && cardPos.bottom > window.innerHeight * scrollMargin;
                const cardDisabled = cardPos.top > window.innerHeight;
    
                if (cardEnabled && !cascadeCards.includes(card)) cascadeCards.push(card);
                if (cardDisabled) {
                    card.style.animation = "unset";
                    if (cascadeCards.includes(card)) cascadeCards.splice(cascadeCards.indexOf(card), 1);
                }
            });
        };
        window.addEventListener("scroll", evalAnimations);
        window.addEventListener("resize", evalAnimations);
        evalAnimations();    
    }
    
    // Execute Visual
    const canvas = $("canvas");
    const g = canvas.getContext("2d");
    const visualID = Math.floor(Math.random() * visuals.length);
    $(":root").style.setProperty("--backgroundColor", visuals[visualID].background);
    $(":root").style.setProperty("--foregroundColor", visuals[visualID].foreground);
    $("#visualLabel").innerText = visuals[visualID].name + " | edwardscamera";

    const resizeCanvas = (evt) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas(null);
    window.addEventListener("resize", resizeCanvas);

    visuals[visualID].setup(g, canvas);
    window.setInterval(() => {
        g.fillStyle = visuals[visualID].background;
        g.fillRect(0, 0, canvas.width, canvas.height);
        visuals[visualID].draw(g, canvas);
    }, 1000 / 60);

    // Get last.fm data
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=edwardscamera&api_key=1f62f0c0081f372b2d4979b2ae154cbd&format=json`;
    window.fetch(url).then(raw => raw.json()).then(data => {
        $("#music-status").style.display = "none";
        $("#music-mostrecenttrack").style.display = "flex";
        const mostRecentTrack = data.recenttracks.track[0];
        $("#music-albumcover").src = mostRecentTrack.image.find(x => x.size === "medium")["#text"];
        $("#music-albumcover").alt = mostRecentTrack.album["#text"];
        $("#music-title").innerText = mostRecentTrack.name;
        $("#music-artist").innerText = mostRecentTrack.artist["#text"];
        $("#music-album").innerText = mostRecentTrack.album["#text"];
        $("#music-mostrecenttrack .music-timestamp").innerText = mostRecentTrack["@attr"]?.nowplaying ? "Now Playing" : mostRecentTrack.date["#text"];
        
        if (is_fine) $("#music-smallTracks").style.display = "table";
        for(let i = 1; i < 11; i++) {
            const trackData = data.recenttracks.track[i];
            const trackElm = document.createElement("tr");
            trackElm.innerHTML = `
                <td>${trackData.name}</td>
                <td>${trackData.artist["#text"]}</td>
                <td>${trackData.album["#text"]}</td>
                <td class="music-timestamp">${trackData.date["#text"]}</td>
            `;
            $("#music-smallTracks").appendChild(trackElm);
        };
    });

    // Footer button
    $("#topBtn").addEventListener("click", () => {
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        });
    });
});