const $ = (arg) => document.querySelector(arg);

const canvas = $("canvas");
const g = canvas.getContext("2d");

const loadImages = (imageUrls, prefix) => {
    const data = {};
    imageUrls.forEach(url => {
        data[url] = document.createElement("img");
        data[url].src = (prefix ?? "") + url;
    });
    return data;
};

const images = loadImages(["cat_duck.png", "cat_halfsit.png", "cat_idle.png", "cat_jump1.png", "cat_jump2.png", "cat_walk.png"], "./assets/");

const resize = () => {
    const rect = document.documentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    objects = getObjects(["h1", "p", "li", "u"]);


};

window.addEventListener("resize", resize);
window.addEventListener("load", () => {
    resize();

    setTimeout(() => {
        Input.load();
        loop();
        setTimeout(() => {
            if (cat.mode !== "interact") cat.mode = "idle";
            cat.canSwitch = true;
        }, 20000);
    }, 5000);
});

const cat = {
    position: {
        x: $("h1").getBoundingClientRect().left + 80,
        y: -48,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    scale: {
        x: 48,
        y: 48,
    },
    ducking: false,
    moveSpeed: 3,
    frame: 0,
    facing: 1,
    state: "cat_idle.png",
    drawnState: "cat_idle.png",
    transitionFrames: 0,

    mode: "idle",
    canSwitch: false,
};
setInterval(() => {
    if (cat.transitionFrames > -1) cat.transitionFrames--;
    cat.frame++;

    if (cat.canSwitch && Math.random() > 0.99) {
        if (cat.mode !== "interact") {
            let list = ["idle", "roam"];
            if (mouse) list.push("chase");
            cat.ducking = false;
            cat.velocity.x = 0;
            cat.mode = list[Math.floor(Math.random() * list.length)];
        }
    }
}, 100);


const getObjects = (tags) => {
    const data = [];
    tags.forEach(tag => {
        Array.from(document.getElementsByTagName(tag)).forEach(element => {
            element.style.width = "fit-content";
            const rect = element.getBoundingClientRect();
            data.push({
                position: {
                    x: rect.left,
                    y: rect.top,
                },
                scale: {
                    x: rect.width,
                    y: rect.height
                },
            });
            element.style.width = "";
        });
    });
    return data;
};
let objects = null;

const draw = () => {
    g.resetTransform();
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.imageSmoothingEnabled = false;    
    g.translate(cat.position.x, cat.position.y);
    
    if (cat.velocity.y > 0) cat.state = "cat_jump2.png";
    else if (cat.velocity.y < 0) cat.state = "cat_jump1.png";
    else {
        if (cat.velocity.x !== 0) cat.state = "cat_walk.png";
        else if (cat.ducking) cat.state ="cat_duck.png";
        else cat.state = "cat_idle.png";    
    }

    if (cat.velocity.x !== 0) {
        cat.facing = Math.sign(cat.velocity.x);
    }
    g.scale(cat.facing, 1);

    g.drawImage(
        images[cat.drawnState], ((cat.frame * 16) % images[cat.drawnState].width), 0, 16, 16,
        cat.facing === -1 ? -cat.scale.x : 0, 0, 
        cat.scale.x, cat.scale.y
    );

    if (cat.drawnState !== cat.state && cat.drawnState !== "cat_halfsit.png") {
        const transitions = [
            ["cat_idle.png", "cat_walk.png"],
            ["cat_walk.png", "cat_idle.png"],
            ["cat_idle.png", "cat_jump1.png"],
            ["cat_jump2.png", "cat_idle.png"],
            ["cat_idle.png", "cat_duck.png"],
            ["cat_duck.png", "cat_idle.png"],

            ["cat_duck.png", "cat_walk.png"],
            ["cat_walk.png", "cat_duck.png"],
        ];
        if (transitions.findIndex(x => x[0] === cat.drawnState && x[1] === cat.state) > -1) {
            cat.drawnState = "cat_halfsit.png";
            cat.transitionFrames = 1;
        } else {
            cat.frame = 0;
            cat.drawnState = cat.state;
            cat.transitionFrames = -1;
        }
        
    }
    if (cat.transitionFrames == 0) {
        cat.frame = 0;
        cat.drawnState = cat.state;
        cat.transitionFrames = -1;
    }

    /*
    // Draw Hitboxes
    g.fillStyle = "#f00";
    g.fillRect(cat.position.x, cat.position.y, cat.scale.x, cat.scale.y);
    objects.forEach(obj => {
        g.fillRect(obj.position.x, obj.position.y, obj.scale.x, obj.scale.y);
    });
    */
};

const physics = () => {
    const collidingWith = (obj, future) => {
        return (
            cat.position.x + (future?.x ?? 0) < obj.position.x + obj.scale.x &&
            cat.position.x + (future?.x ?? 0) + cat.scale.x > obj.position.x &&
            cat.position.y + (future?.y ?? 0) < obj.position.y + obj.scale.y &&
            cat.position.y + (future?.y ?? 0) + cat.scale.y > obj.position.y
        );
    };
    const colliding = (future) => {
        if (cat.mode !== "interact") {
            const page = $(".page").getBoundingClientRect();
            if (cat.position.x + (future?.x ?? 0) < page.left + 64) return true;
            if (cat.position.x + (future?.x ?? 0) + cat.scale.x > page.left + page.width - 64) return true;
        }
        return objects.find(x => collidingWith(x, future));
    }
    const onGround = colliding({ x: 0, y: 1, });

    switch(cat.mode) {
        case "idle":
            cat.ducking = Math.floor(new Date().getTime() / 1000 / 15) % 2 === 0;
            break;
        case "interact":
            cat.velocity.x = cat.moveSpeed * ((Input.keyDown["ArrowRight"] ? 1 : 0) - (Input.keyDown["ArrowLeft"] ? 1 : 0));
            if (Input.keyDown["ArrowDown"] && onGround) cat.velocity.x = 0;
            if (Input.keyDown["ArrowUp"] && onGround) cat.velocity.y = -4;
            cat.ducking = Input.keyDown["ArrowDown"] ?? false;
            break;
        case "chase":
            if (mouse) {
                if (Math.abs(cat.position.x - mouse.x) > 48) cat.velocity.x = -cat.moveSpeed * Math.sign(cat.position.x - mouse.x);
                else cat.velocity.x = 0;
                if (cat.position.y - mouse.y < cat.scale.y / 2) {
                    cat.ducking = true;
                } else {
                    cat.ducking = false;
                    if (onGround) cat.velocity.y = -Math.min(4, (cat.position.y - mouse.y) / 16);
                }
            }
            break;
        case "roam":
            if (Math.random() < 0.01) {
                cat.velocity.x = (cat.position.x / window.innerWidth) > 0.5 ? -1 : 1;
                if (Math.random() > 0.7) cat.velocity.x = Math.random() > 0.5 ? -1 : 1;
                setTimeout(() => {
                    cat.velocity.x = 0;
                }, 2000 * Math.random() + 1000);
            }
            break;
    }

    if (cat.mode !== "chase" && mouse && onGround && (cat.position.x + cat.scale.x / 2 - mouse.x) ** 2 + (cat.position.y + cat.scale.y / 2 - mouse.y) ** 2 < cat.scale.x ** 2) {
        cat.velocity.y = -4;
    }
    if (cat.mode !== "interact" && (Input.keyDown["ArrowLeft"] || Input.keyDown["ArrowUp"] || Input.keyDown["ArrowRight"])) cat.mode = "interact";
   
    if (!onGround) cat.velocity.y += 0.1;

    cat.position.x += cat.velocity.x;
    if (colliding()) {
        while (colliding()) {
            cat.position.x -= Math.sign(cat.velocity.x) === 0 ? -1 : Math.sign(cat.velocity.x);
        }
        cat.velocity.x = 0;
    }
    cat.position.y += cat.velocity.y;
    if (colliding()) {
        while (colliding()) {
            cat.position.y -= Math.sign(cat.velocity.y) === 0 ? -1 : Math.sign(cat.velocity.y);
        }
        cat.velocity.y = 0;
    }

    if (cat.position.y > document.documentElement.getBoundingClientRect().height + cat.scale.y) cat.position.y = -cat.scale.y;
};

const loop = () => {
    physics();
    draw();
    requestAnimationFrame(loop);
};

let mouse = null;
window.addEventListener("mousemove", (evt) => {
    mouse = {
        x: evt.clientX + window.scrollX,
        y: evt.clientY + window.scrollY,
    };
});

class Input {
    static keyDown = {};
    static load() {
        window.addEventListener("keydown", evt => {
            Input.keyDown[evt.code] = true;
            if (["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(evt.code)) {
                evt.preventDefault();
            }
        });
        window.addEventListener("keyup", evt => {
            Input.keyDown[evt.code] = false;
        });
    }
}