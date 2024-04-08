const $ = (arg) => document.querySelector(arg);

const runPhysics = () => {
    const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

    const engine = Engine.create();

    const render = Render.create({
        element: $("#render"),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: document.documentElement.offsetHeight
        }
    });

    $("#render")

    const runner = Runner.create();

    Render.run(render);
    Runner.run(runner, engine);

    Array.from(document.getElementsByClassName("physics")).forEach(obj => {
        const rect = obj.getBoundingClientRect();
        const phyObj = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height);
        phyObj.element = obj;
        obj.body = phyObj;
        Composite.add(engine.world, phyObj);
    });

    Array.from(document.getElementsByClassName("page")).forEach(obj => {
        const rect = obj.getBoundingClientRect();
        const phyObj = Bodies.rectangle(rect.left + rect.width / 2, rect.bottom, rect.width, 50, { isStatic: true, });
        Composite.add(engine.world, phyObj);
    });

    const animate = () => {
        engine.world.bodies.forEach(obj => {
            if (obj.element) {
                if (obj.element.parentElement !== document.body) document.body.appendChild(obj.element);
                obj.element.style.position = "absolute";
                obj.element.style.left = `${obj.position.x - obj.element.offsetWidth / 2}px`;
                obj.element.style.top = `${obj.position.y - obj.element.offsetHeight / 2}px`;
                obj.element.style.transform = `rotateZ(${obj.angle}rad)`
            }
        });
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};