class PromptBox {
    element = null;
    button = null;
    onReturn = (val) => {};
    charLimit = 10;

    constructor(text, onReturn, charLimit, defaultValue) {
        if (text === undefined) text = "";
        if (onReturn === undefined) this.onReturn = (val) => {};
        if (!Number.isInteger(charLimit) || charLimit < 0) this.charLimit = 9999;
        if (defaultValue === undefined) defaultValue = "";

        this.backdrop = document.createElement('DIV');
        Object.assign(this.backdrop.style, {
            position: 'absolute',
            width: window.innerWidth + 'px',
            height: window.innerHeight + 'px'
        });

        this.element = document.createElement('INPUT');
        this.element.value = defaultValue;
        this.element.style.position = 'absolute';

        this.button = document.createElement('BUTTON');
        this.button.innerHTML = '&#10004;';
        Object.assign(this.button.style, {
            color: '#00ff00',
            position: 'absolute',
            left: this.element.offsetWidth + 'px',
            backgroundColor: 'Transparent',
            outline: 'None',
            border: 'None',
            userSelect: 'None'
        });
        this.button.onmouseover = () => { this.button.style.color = '#009900' };
        this.button.onmouseout = () => { this.button.style.color = '#00ff00' };

        this.text = document.createElement('h1');
        this.text.innerHTML = text;
        Object.assign(this.text.style, {
            color: '#ffffff',
            position: 'absolute',
            userSelect: 'None'
        });

        this.button.onclick = () => {
            this.element.value = this.element.value.slice(0, charLimit);
            this.onReturn(this.element.value);
            this.hide();
        };
        this.backdrop.onresize = () => {
            Object.assign(this.backdrop.style, {
                position: 'absolute',
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px'
            });
            this.element.style.top = (window.innerHeight / 2 - this.element.offsetHeight / 2) + 'px';
            this.button.style.top = (window.innerHeight / 2 - this.button.offsetHeight / 2) + 'px';
            this.element.style.left = (window.innerWidth / 2 - this.element.offsetWidth / 2) + 'px';
            this.button.style.left = (window.innerWidth / 2 - this.element.offsetWidth / 2) + this.element.offsetWidth - this.button.offsetWidth + 'px';
            this.text.style.left = (window.innerWidth / 2 - this.text.offsetWidth / 2) + 'px';
            this.text.style.top = (window.innerHeight / 2 - this.element.offsetHeight - this.text.offsetHeight * 2) + 'px';
        }
        this.element.onclick = () => {
            this.element.value = this.element.value.slice(0, charLimit);
        };
        this.element.onkeydown = (event) => {
            this.element.value = this.element.value.slice(0, charLimit);
            if (event.key === "Enter") this.button.click();
        };
        this.backdrop.append(this.element, this.button, this.text);
        document.body.appendChild(this.backdrop);

        window.addEventListener('resize', this.backdrop.onresize);
        this.backdrop.onresize();
    }
    setTextStyle(style) { Object.assign(this.text.style, style); this.backdrop.onresize(); }
    setInputStyle(style) { Object.assign(this.element.style, style); this.backdrop.onresize(); }
    setButtonStyle(style) { Object.assign(this.button.style, style); this.backdrop.onresize(); }
    setBackgroundStyle(style) { Object.assign(this.backdrop.style, style); this.backdrop.onresize(); }
    hide() {
        window.removeEventListener('resize', this.backdrop.onresize);
        this.backdrop.remove();
    }
    show() {
        window.addEventListener('resize', this.backdrop.onresize);
        document.body.appendChild(this.backdrop);
    }
}
class SliderBox {
    constructor(text, onReturn, min, max) {
        // Set undefined arguments to default values
        if (text === undefined) text = "";
        if (min === undefined) min = 0;
        this.onReturn = (onReturn === undefined ? val => {} : onReturn);
        if (max === undefined) max = 10;
        // Backdrop Container Initalization
        this.backdrop = document.createElement('DIV');
        this.backdrop.style.position = 'absolute';
        // Question Text Initalization
        this.text = document.createElement('H1');
        this.text.innerHTML = text;
        Object.assign(this.text.style, {
            color: '#ffffff',
            position: 'absolute',
            userSelect: 'None'
        });
        // Slider Initalization
        this.slider = document.createElement('INPUT');
        Object.assign(this.slider, {
            type: 'range',
            min: min,
            max: max,
            value: min,
            margin: 0
        });
        this.slider.style.position = 'absolute';
        // Button Initalization
        this.button = document.createElement('BUTTON');
        this.button.innerHTML = '&#10004;';
        Object.assign(this.button.style, {
            color: '#00ff00',
            position: 'absolute',
            backgroundColor: 'Transparent',
            outline: 'None',
            border: 'None',
            userSelect: 'None',
            margin: 0
        });
        this.button.onmouseover = () => { this.button.style.color = '#009900' };
        this.button.onmouseout = () => { this.button.style.color = '#00ff00' };
        this.button.onclick = () => {
            this.onReturn(window.parseInt(this.slider.value));
            this.hide();
        };
        // Indicator Initalization
        this.indicator = document.createElement('h6');
        Object.assign(this.indicator.style, {
            color: 'white',
            position: 'absolute',
            userSelect: 'none',
            margin: 0,
            height: 'auto',
            width: 'auto',
            whiteSpace: 'nowrap'
        });
        // Set Indicator
        this.indicator.innerText = min;
        this.slider.onmouseenter = () => this.indicatorUpdate = window.setInterval(() => {
            this.indicator.innerText = this.slider.value;
            this.backdrop.onresize();
        }, 100);
        this.slider.onmouseleave = () => clearInterval(this.indicatorUpdate);
        // Resize Listener
        this.backdrop.onresize = () => {
            Object.assign(this.backdrop.style, {
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px'
            });
            this.text.style.left = (window.innerWidth / 2 - this.text.offsetWidth / 2) + 'px';
            this.text.style.top = (window.innerHeight / 2 - this.slider.offsetHeight - this.text.offsetHeight * 2) + 'px';
            this.slider.style.left = (window.innerWidth / 2 - this.slider.offsetWidth / 2) + 'px';
            this.slider.style.top = (window.innerHeight / 2 - this.slider.offsetHeight / 2) + 'px';
            this.button.style.left = (window.innerWidth / 2 + this.slider.offsetWidth / 2) + 'px';
            this.button.style.top = (window.innerHeight / 2 - this.slider.offsetHeight / 2) + 'px';
            this.indicator.style.left = ((window.innerWidth / 2 - this.slider.offsetWidth / 2) - this.indicator.clientWidth - 5) + 'px';
            this.indicator.style.top = (window.innerHeight / 2 - this.slider.offsetHeight / 2) + 4 + 'px';
        }
        // Append Elements
        this.backdrop.append(this.slider, this.button, this.text, this.indicator);
        document.body.appendChild(this.backdrop);
        // Initial Positioning
        window.addEventListener('resize', this.backdrop.onresize);
        this.backdrop.onresize();
    }
    setTextStyle(style) { Object.assign(this.text.style, style); this.backdrop.onresize(); }
    setButtonStyle(style) { Object.assign(this.button.style, style); this.backdrop.onresize(); }
    setIndicatorStyle(style) { Object.assign(this.indicator.style, style); this.backdrop.onresize(); }
    setSliderStyle(style) { Object.assign(this.slider.style, style); this.backdrop.onresize(); }
    setSliderProperties(properties) { Object.assign(this.slider, properties); this.backdrop.onresize(); }
    show() {
        window.addEventListener('resize', this.backdrop.onresize);
        document.body.appendChild(this.backdrop);
    }
    hide() {
        window.removeEventListener('resize', this.backdrop.onresize);
        this.backdrop.remove();
    }
}
class ColorBox {
    constructor(text, onReturn, defaultColor) {
        // Set undefined arguments to default values
        if (text === undefined) text = "";
        if (onReturn === undefined) onReturn = () => {};
        if (defaultColor === undefined) defaultColor = '#ffffff';
        // Container Initalization
        this.backdrop = document.createElement('DIV');
        this.backdrop.style.position = 'absolute';
        // Question Text Initalization
        this.text = document.createElement('H1');
        this.text.innerHTML = text;
        Object.assign(this.text.style, {
            color: '#ffffff',
            position: 'absolute',
            userSelect: 'None'
        });
        // Color Picker Initalization
        this.color = document.createElement('INPUT');
        Object.assign(this.color, {
            type: 'color',
            value: defaultColor
        });
        this.color.style.position = 'absolute';
        // Button Initalization
        this.button = document.createElement('BUTTON');
        this.button.innerHTML = '&#10004;';
        Object.assign(this.button.style, {
            color: '#00ff00',
            position: 'absolute',
            backgroundColor: 'Transparent',
            outline: 'None',
            border: 'None',
            userSelect: 'None',
            margin: 0
        });
        this.button.onmouseover = () => { this.button.style.color = '#009900' };
        this.button.onmouseout = () => { this.button.style.color = '#00ff00' };
        this.button.onclick = () => {
            onReturn(this.color.value);
            this.hide();
        };
        // Resize Listener
        this.backdrop.onresize = () => {
            Object.assign(this.backdrop.style, {
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px'
            });
            this.text.style.left = (window.innerWidth / 2 - this.text.offsetWidth / 2) + 'px';
            this.text.style.top = (window.innerHeight / 2 - this.color.offsetHeight - this.text.offsetHeight * 2) + 'px';
            this.color.style.left = (window.innerWidth / 2 - this.color.offsetWidth / 2) + 'px';
            this.color.style.top = (window.innerHeight / 2 - this.color.offsetHeight / 2) + 'px';
            this.button.style.left = (window.innerWidth / 2 + this.color.offsetWidth / 2) + 'px';
            this.button.style.top = (window.innerHeight / 2 - this.color.offsetHeight / 2) + 'px';
        }
        // Append Elements
        this.backdrop.append(this.color, this.text, this.button);
        document.body.append(this.backdrop);
        // Initial Positioning
        window.addEventListener('resize', this.backdrop.onresize);
        this.backdrop.onresize();
        // Show Color Menu
        window.setTimeout(() => { this.color.click(); }, 1);
    }
    setTextStyle(style) { Object.assign(this.text.style, style); this.backdrop.onresize(); }
    setButtonStyle(style) { Object.assign(this.button.style, style); this.backdrop.onresize(); }
    setPickerStyle(style) { Object.assign(this.color.style, style); this.backdrop.onresize(); }
    setPickerProperties(properties) { Object.assign(this.color, properties); this.backdrop.onresize(); }
    show() {
        window.addEventListener('resize', this.backdrop.onresize);
        document.body.appendChild(this.backdrop);
    }
    hide() {
        window.removeEventListener('resize', this.backdrop.onresize);
        this.backdrop.remove();
    }
}

let map = null;
let CANVAS = null;
let tilesize = 64;
let colors = [[255, 255, 255], [0, 0, 0]];
let selectedColor = 1;
let selectedTool = document.getElementById('Toolbar').children[0];
const btnInfo = document.getElementById('btnInfo');
const btnNew = document.getElementById('btnNew');
const btnImport = document.getElementById('btnImport');
const btnExport = document.getElementById('btnExport');
document.querySelector("html").style.overflowX = 'hidden';
document.querySelector("html").style.overflowY = 'hidden';
Math.__proto__.clamp = (val, min, max) => Math.max(Math.min(val, max), min);
btnInfo.onclick = () => setMode('info');
btnNew.onclick = () => {
    setMode('none');
    let widthInput = new SliderBox("Set width:", width => {
        let heightInput = new SliderBox("Set height:", height => {
            map = new Array(height);
            for(let row = 0; row < map.length; row++) {
                map[row] = new Array(width);
                for(let col = 0; col < map[row].length; col++) {
                    map[row][col] = 0;
                }
            }
            createCanvas(width, height);
            setMode('edit');
            resetView();
        }, 5, 32);
        heightInput.setTextStyle({ fontFamily: "'Roboto Mono', monospace" });
    }, 5, 32);
    widthInput.setTextStyle({ fontFamily: "'Roboto Mono', monospace" });
};
btnImport.onclick = () => {
    setMode('import');
    document.getElementById('ImpSubmit').onclick = () => {
        let input = document.getElementById('ImpField').value;
        try {
            input = input.replace(/ /g, '').split('=')[1];
            input = input.replace(/{/g, '[');
            input = input.replace(/}/g, ']');
            input = input.replace(/;/g, '');
            input = input.split('],');
            map = new Array(input.length);
            for(let i = 0; i < input.length; i++) {
                input[i] = input[i].replace(/]/g, '');
                input[i] = input[i].replace(/\[/g, '');
                map[i] = input[i].split(',');
            }
            map = map.map(row => row.map(item => window.parseInt(item)));
            let highestNumber = 0;
            for(let row = 0; row < map.length; row++) {
                for(let col = 0; col < map[row].length; col++) {
                    if (map[row][col] > highestNumber) highestNumber = map[row][col];
                }
            }
            colors = [[255, 255, 255], [0, 0, 0]];
            if (highestNumber > 1) {
                for(let i = 0; i < highestNumber - 1; i++) {
                    colors.push(hslToRgb(1.0 / (highestNumber) * i, 1.0, 0.5));
                }
            }
            setMode('edit');
            addColor();
            createCanvas();
        } catch(e) {
            document.getElementById('ImpField').value += '\n\nSyntax Error!';
            console.log(e);
        }
    };
};
btnExport.onclick = () => {
    setMode('export');
    let updateExport = () => {
        let out = "";
        let space = document.getElementById('ExpBeautify').checked;
        let comments = document.getElementById('ExpColor').checked;
        let comment = '//';
        let left_bracket = "[";
        let right_bracket = "]";
        try {
            if (map === null) { out = "No canvas to export!" }
            else {
                switch(document.getElementById('ExpLanguage').value) {
                    case 'javascript':
                        out += 'let arrayMap = [';
                        comment = '// ';
                        break;
                    case 'java':
                        out += 'int[][] arrayMap = {';
                        comment = '// ';
                        left_bracket = "{";
                        right_bracket = "}";
                        break;
                    case 'python':
                        out += 'arrayMap = [';
                        comment = '# ';
                        break;
                }
                for(let i = 0; i < map.length; i++) {
                    if (space && i !== 0) out += "\t";
                    out += `${left_bracket}${map[i].toString()}${right_bracket}`;
                    out += i === map.length - 1 ? right_bracket : ',';
                    if (space) out += '\n';
                }
                if (space) out = out.substr(0, out.length - 1);
                if (['java', 'javascript'].includes(document.getElementById('ExpLanguage').value)) {
                    out += ';';
                }
                if (comments) {
                    out += '\n\n';
                    for(let i = 0; i < colors.length; i++) {
                        out += `${comment+i} - rgb(${colors[i].toString()})\n`
                    }
                }
            }
        } catch(e) {
            out = 'Error generating export code\n\n' + e;
        }
        document.getElementById('ExpField').value = out;
    }
    document.getElementById('ExpLanguage').onchange = updateExport;
    document.getElementById('ExpBeautify').onchange = updateExport;
    document.getElementById('ExpColor').onchange = updateExport;
    updateExport();
}
const createCanvas = (width, height) => {
    if (CANVAS !== null) CANVAS.remove();
    CANVAS = document.createElement('CANVAS');
    CANVAS.width = tilesize * width;
    CANVAS.height = tilesize * height;
    CANVAS.onmouseenter = () => CANVAS.mousein = true;
    CANVAS.onmouseleave = () => CANVAS.mousein = false;
    Object.assign(CANVAS.style, {
        position: 'absolute',
        zIndex: -1,
        left: 0,
        top: 0 
    });
    document.getElementById('ScreenEdit').appendChild(CANVAS);
    updateCanvas();
    resetView();
    dragElement(CANVAS);
    CANVAS.onmousemove = (event) => {
        CANVAS.mousePosition = {
            x: event.offsetX,
            y: event.offsetY
        }
        if (CANVAS.mouseDown === true) {
            switch(selectedTool.alt) {
                case 'draw':
                case 'eraser':
                    map[Math.clamp(Math.floor(CANVAS.mousePosition.y / tilesize), 0, map.length - 1)][Math.clamp(Math.floor(CANVAS.mousePosition.x / tilesize), 0, map[0].length - 1)] = selectedTool.alt === 'draw' ? selectedColor : 0;
                    updateCanvas();
                    break;
            }
        }
    }
    window.addEventListener('mousedown', () => {
        CANVAS.mouseDown = true;
        if (selectedTool.alt === 'fill' && CANVAS.mousein) {
            let replaceCoord = [Math.clamp(Math.floor(CANVAS.mousePosition.y / tilesize), 0, map.length - 1), Math.clamp(Math.floor(CANVAS.mousePosition.x / tilesize), 0, map[0].length - 1)];
            let replace = map[replaceCoord[0]][replaceCoord[1]];
            
            if (replace !== selectedColor) floodFill(replaceCoord[1], replaceCoord[0], replace, selectedColor);
            updateCanvas();
        }
    });
    window.addEventListener('mouseup', () => CANVAS.mouseDown = false);
};
const floodFill = (x, y, rep, wit) => {
    if (map[y][x] === rep) map[y][x] = wit;
    if (x + 1 < map[0].length && map[y][x + 1] === rep) {
        floodFill(x + 1, y, rep, wit);
    }
    if (x - 1 > -1 && map[y][x - 1] === rep) {
        floodFill(x - 1, y, rep, wit);
    }
    if (y + 1 < map.length && map[y + 1][x] === rep) {
        floodFill(x, y + 1, rep, wit);
    }
    if (y - 1 > -1 && map[y - 1][x] === rep) {
        floodFill(x, y - 1, rep, wit);
    }
};
const updateCanvas = () => {
    if (CANVAS === null) return;
    let CTX = CANVAS.getContext('2d');
    CANVAS.width = tilesize * map[0].length;
    CANVAS.height = tilesize * map.length;
    for(let row = 0; row < map.length; row++) {
        for(let col = 0; col < map[row].length; col++) {
            CTX.fillStyle = `rgb(${colors[map[row][col]][0]}, ${colors[map[row][col]][1]}, ${colors[map[row][col]][2]})`;
            CTX.strokeStyle = `rgb(${255 - colors[map[row][col]][0]}, ${255 - colors[map[row][col]][1]}, ${255 - colors[map[row][col]][2]})`;
            CTX.fillRect(col * tilesize, row * tilesize, tilesize, tilesize);
            CTX.strokeRect(col * tilesize, row * tilesize, tilesize, tilesize);
        }
    }
};
const addColor = color => {
    if (color !== undefined) {
        let colorChoice = new ColorBox("Choose a color:", c => {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
            colors.push([window.parseInt(result[1], 16), window.parseInt(result[2], 16), window.parseInt(result[3], 16)]);
            addColor();
            document.getElementById('ColorList').scrollTop = document.getElementById('ColorList').scrollHeight;
        }, '#ff0000');
        colorChoice.setTextStyle({
            fontFamily: "'Roboto Mono', monospace",
            textShadow: '#000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px, #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px'
        });
    }
    while (document.getElementById('ColorList').children.length > 0) for(let e of document.getElementById('ColorList').children) e.remove();
    for(let i = 0; i < colors.length; i++) {
        let a = document.createElement('DIV');
        Object.assign(a.style, {
            backgroundColor: `rgb(${colors[i].toString()})`,
            color: `rgb(${255 - colors[i][0]}, ${255 - colors[i][1]}, ${255 - colors[i][2]})`,
            borderStyle: 'solid',
            borderColor: `rgb(${255 - colors[i][0]}, ${255 - colors[i][1]}, ${255 - colors[i][2]})`,
            fontFamily: "'Roboto Mono', monospace"
        });
        if (i === selectedColor) {
            a.style.fontWeight = 'bold';
            a.style.borderWidth = '8px';
        }
        a.innerText = `rgb(${colors[i].toString()})`;
        a.classList.add("Color");
        a.onclick = () => {
            selectedColor = i;
            addColor();
        }
        a.oncontextmenu = event => {
            event.preventDefault();
            let d = -1;
            for(let i = 0; i < colors.length; i++) {
                if (a.parentElement.children[i] === a) {
                    if (i === 0) return;
                    d = i;
                    colors.splice(i, 1);
                    addColor();
                    break;
                }
            }
            if (map !== null) {
                for(let row = 0; row < map.length; row++) {
                    for(let col = 0; col < map[row].length; col++) {
                        if (map[row][col] === d) map[row][col] = 0;
                    }
                }
                selectedColor = 0;
                updateCanvas();
            }
        };
        document.getElementById('ColorList').append(a);
    }
};
const changeSize = interval => {
    if (CANVAS === null) return;
    tilesize += interval;
    CANVAS.style.left = ((CANVAS.style.left.split('px')[0]) - interval * 2) + 'px';
    CANVAS.style.top = ((CANVAS.style.top.split('px')[0]) - interval * 2) + 'px';
    updateCanvas();
};
const resetView = () => {
    if (CANVAS === null) return;
    tilesize = 64;
    updateCanvas();
    CANVAS.style.left = window.innerWidth / 2 - CANVAS.offsetWidth / 2 + 'px';
    CANVAS.style.top = window.innerHeight / 2 - CANVAS.offsetHeight / 2 + 'px';
    updateCanvas();
};
const selectTool = tool => {
    for(let e of document.getElementById('Toolbar').children) e.classList.remove('ToolSelected');
    tool.classList.add('ToolSelected');
    selectedTool = tool;
};
const dragElement = elmnt => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        if (selectedTool.alt !== "move") return;
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
const setMode = mode => {
    document.getElementById('ScreenInfo').style.display = 'none';
    document.getElementById('ScreenEdit').style.display = 'none';
    document.getElementById('ScreenImport').style.display = 'none';
    document.getElementById('ScreenExport').style.display = 'none';
    switch(mode) {
        case 'info':
            document.getElementById('ScreenInfo').style.display = 'block';
            break;
        case 'edit':
            document.getElementById('ScreenEdit').style.display = 'block';
            break;
        case 'import':
            document.getElementById('ScreenImport').style.display = 'block';
            break;
        case 'export':
            document.getElementById('ScreenExport').style.display = 'block';
            break;
        default:
            return false;
    }
}
const hslToRgb = (h, s, l) => {
    let r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        let hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
selectTool(selectedTool);
setMode('none');
addColor();