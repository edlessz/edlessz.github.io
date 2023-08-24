//#region STAR BACKGROUND
const canvas = document.querySelector("canvas");
const g = canvas.getContext("2d");

const prng = (a) => {
    a = parseFloat(a);
    return (function () {
        var t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    })();
};

const starOffset = {
    "x": 0,
    "y": 0,
};
const starVelocity = {
    "x": screen.width >= 480 ? 0 : 2,
    "y": screen.width >= 480 ? 0 : 2,
}
const targetStarVelocity = {
    "x": starVelocity.x,
    "y": starVelocity.y,
}

mod2 = (a, b) => ((a % b) + b) % b;

const starCount = (window.innerWidth * window.innerHeight / 500) / 2700 * 500;

const starData = [];
for (let i = 0; i < starCount; i++) starData.push({
    "size": prng(i * 5) * 10,
    "i": i,
});
const maevePlanetSrc = Object.assign(document.createElement("img"), { "src": "./images/maeve-planet.png" });

starData.push({
    "img": maevePlanetSrc,
    "size": 116,
    "i": starData.length,
    "click": () => {
        window.open("./hint.html", "_blank");
    },
});

window.setInterval(() => {
    if (window.innerWidth != canvas.width || window.innerHeight != canvas.height) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    g.fillStyle = "#000";
    g.fillRect(0, 0, canvas.width, canvas.height);

    g.fillStyle = "#fff";
    starData.sort((a,b)=>(a.size-b.size)).forEach(star => {
        const i = star.i;
        if (!star.img) {
            g.beginPath();
            g.ellipse(
                mod2(prng(i) * canvas.width + starOffset.x * (star.size / 10), canvas.width + star.size * 3) - star.size * 2,
                mod2(prng(i * 2) * canvas.height + starOffset.y * (star.size / 10), canvas.height + star.size * 3) - star.size * 2,
                star.size, star.size, 0, 0, 2 * Math.PI);
            g.fill();
        } else {
            const ax = prng(i) * 2 * canvas.width + starOffset.x - star.size * 2
            const ay = prng(i * 2) * canvas.height + starOffset.y - star.size * 2;
            g.drawImage(star.img,
                ax,
                ay,
                star.size, 160 / (233 / star.size)
            );
            if (Math.sqrt((mouse.y - ay)**2 + (mouse.x - ax)**2) < star.size && star.click && mouse.down) {
                mouse.down = false;
                star.click();
            } 
        }
    });

    starOffset.x += starVelocity.x;
    starOffset.y += starVelocity.y;
    starVelocity.x += (targetStarVelocity.x - starVelocity.x) / 50;
    starVelocity.y += (targetStarVelocity.y - starVelocity.y) / 50;
}, 1000 / 60);

const mouse = {
    "x": 0,
    "y": 0,
    "down": false,
}

window.addEventListener("mousemove", (evt) => {
    if (screen.width >= 480) {
        targetStarVelocity.x = (-(evt.clientX - canvas.width / 2) / 30);
        targetStarVelocity.y = (-(evt.clientY - canvas.height / 2) / 30);
    }
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
});
window.addEventListener("mousedown", evt => {
    mouse.down = true;
});
window.addEventListener("mouseup", evt => {
    mouse.down = false;
});

//#endregion
//#region CONTAINERS

const containers = {
    "games": [
        {
            "title": "Stick Together",
            "page": "https://edwardscamera.com/stick-together",
            "github": "stick-together",
            "img": "./thumbs/stick-together.png",
            "webValue": 1,
            "mobileValue": 2,
        },
        {
            "title": "Infinisweeper",
            "page": "https://edwardscamera.com/infinisweeper",
            "github": "infinisweeper",
            "img": "./thumbs/infinisweeper.png",
            "webValue": 2,
            "mobileValue": 1,
        },
        {
            "title": "Limited Resources",
            "page": "https://edwardscamera.com/limited-resources",
            "github": "limited-resources",
            "img": "./thumbs/limited-resources.png",
            "webValue": 3,
            "value": 3,
            "mobileValue": 3,
        },
    ].sort((a, b) => screen.width >= 480 ? a.webValue - b.webValue : a.mobileValue - b.mobileValue),
    "apps": [
        {
            "title": "Minecraft Server Shell",
            "page": "https://github.com/edwardscamera/minecraft-server-shell",
            "github": "minecraft-server-shell",
        },
        {
            "title": "Logic Board",
            "page": "https://edwardscamera.com/logic-board/",
            "github": "logic-board",
        },
        {
            "title": "Meet Manager",
            "page": "https://github.com/edwardscamera/MeetManager",
            "github": "MeetManager",
        },
        {
            "title": "Array Map Creator",
            "page": "http://edwardscamera.com/array-map-creator/",
            "github": "array-map-creator",
        }
    ],
};
window.addEventListener("load", () => {
    Array.from(document.getElementsByClassName("container")).forEach(container => {
        const dataName = container.getAttribute("data");
        containers[dataName].forEach(item => {
            const sub = document.createElement("div");
            container.appendChild(sub);

            sub.innerHTML = `
                <a href="${item.page}" target="_blank">
                    ${"img" in item ? `<img src="${item.img}">` : ""}
                    <h2>${item.title}</h2>
                </a>
                <p id="${dataName}__${item.github}">${(() => {
                    window.fetch(`https://api.github.com/repos/edwardscamera/${item.github}`).then(r => r.json()).then(data => {
                        document.querySelector(`#${dataName}__${item.github}`).innerText = data.description;
                    });
                })()}</p>
            `;
        });
    });
    setTimeout(() => window.scrollTo(0, 0), 1);
});

//#endregion