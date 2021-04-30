let FRAME_RATE = 30;
let BG = [129, 197, 228];   // Color of outer background
let SMOOTH = true;
let NUM_SIDES = 7;
let NUM_LAYERS = 5;
let DRAW_LAYERS = 3;

let ctx;

class MyShape {
    constructor(options) {
        this.setup(options || {});
    }

    setup(options) {
        this.ox = options.x || window.innerWidth / 2;
        this.oy = options.y || window.innerHeight / 2;
        this.sides = options.sides || NUM_SIDES;
        this.r = options.t || Math.min(window.innerWidth, window.innerHeight) * 0.17;
        this.numlayers = options.numLayers || NUM_LAYERS;
        this.createVertices();
        this.color = [44, 201, 94];     // start color of ink blot
    }

    createVertices() {
        this.layers = [];
        var points = [];
        let x, y, a;
        for (let i = 0; i < this.sides; i++) {

            a = Math.PI * 2 * i / this.sides;
            x = this.r * Math.cos(a);
            y = this.r * Math.sin(a);
            points.push([x, y]);
        }

        this.layers.push(points);

        let c;
        for (let i = 0; i < this.numlayers; i++) {

            c = i / this.layers.length;
            a = Math.cos(c * c * 1.7) * 0.6 + 0.3;
            this.fracture(this.layers[this.layers.length - 1], a);
        }

    }

    fracture(layer, amt) {
        let pts = [...layer, layer[0]];
        let newPts = [];
        let x0, y0, x1, y1, a, ar, d, dx, dy, l, x, y;
        for (let i = 0; i < pts.length - 1; i++) {

            x0 = pts[i][0];
            y0 = pts[i][1];
            x1 = pts[i + 1][0];
            y1 = pts[i + 1][1];
            dx = x1 - x0;
            dy = y1 - y0;
            d = Math.sqrt(dx * dx + dy * dy);
            a = Math.atan2(dy, dx) - Math.PI / 2 + (Math.random() * 0.4 - 0.2);

            l = d * amt * Math.random();
            x = x0 + dx / 2 + Math.cos(a) * l;
            y = y0 + dy / 2 + Math.sin(a) * l;

            // move x0 & y0 outwards
            ar = Math.atan2(y0, x0);
            x0 = x0 + Math.cos(ar) * d * 0.1;
            y0 = y0 + Math.sin(ar) * d * 0.1;
            newPts.push([x0, y0]);
            newPts.push([x, y]);
        }

        this.layers.push(newPts);
    }

    morph(layerIndex) {
        let a, l = layerIndex || Math.ceil(Math.random() * (this.layers.length - 1));
        
        for (let i = this.numlayers; i >= l; i--) {

            this.layers.pop();
        }


        for (let i = l - 1; i < this.numlayers; i++) {

            a = Math.sin(i / this.layers.length * Math.PI / 2) * 0.7;
            this.fracture(this.layers[this.layers.length - 1], a);
        }

    }

    travel() {
        let r;
        this.layers.forEach((layer, i) => {
            r = Math.sin(i / this.layers.length * -Math.PI / 2) * 8;
            layer.forEach(pt => {
                pt[0] = pt[0] + r * (Math.random() - 0.5);
                pt[1] = pt[1] + r * (Math.random() - 0.5);
            });
        });
    }

    draw() {
        if (this.layers.length === 0) {
            return;
        }
        let alpha;
        let c;
        this.layers.forEach((layer, i) => {
            if (i > this.layers.length - DRAW_LAYERS - 1) {
                c = 1 - i / this.layers.length;
                alpha = c * c * 0.15 + 0.08;
                this.drawLayer(layer, alpha);
            }
        });
        let l = this.layers[this.layers.length - 1];
        // this.drawLayer(l);
        this.travel();
    }

    drawLayer(points, a) {
        let alpha = a == undefined ? 1 : a;
        if (points.length < 4) {
            return;
        }
        ctx.beginShape();
        ctx.noStroke();
        // ctx.stroke(128, 12);
        if (!SMOOTH) {
            let pts = [...points, points[0]];
            pts.forEach(pt => {
                ctx.vertex(
                    (this.ox + pt[0]) / ctx._pixelDensity,
                    (this.oy + pt[1]) / ctx._pixelDensity);
                
            });
        } else {
            let ptsSmooth = [...points, points[0], points[1], points[2]];
            ptsSmooth.forEach(pt => {
                ctx.curveVertex(
                    this.ox + pt[0],    // ctx._pixelDensity,
                    this.oy + pt[1]     // ctx._pixelDensity,
                );
            });
        }

        ctx.fill(...this.color, 8 * alpha);
        ctx.endShape();
    }}

let shape = new MyShape();

setup = () => {
    ctx = createGraphics(window.innerWidth, window.innerHeight);
    ctx._pixelDensity = 1;
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(FRAME_RATE);
    draw();
    shape.ox = window.innerWidth / 2;
    shape.oy = window.innerHeight / 2;
};

window.addEventListener('resize', () => setup());

let n = 0;
let nm = 4520;
let nn;
draw = () => {
    n = (n + 1) % nm;
    nn = n / nm;
    background([...BG, 9]);
    ctx.fill(256, 22);
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    shape.draw();
    blend(ctx, 0, 0, window.innerWidth, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight, MULTIPLY);
    if (n % 44 === 0) {
        shape.morph(3);
    }
    if (n % 937 === 0) {
        shape.morph(5);
    }
    if (n % 131 === 0) {
        shape.morph(6);
    }
    if (n % 515 === 0) {
        shape.color = [
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255)];
    }
};