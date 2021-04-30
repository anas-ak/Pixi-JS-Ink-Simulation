let FRAME_RATE = 30;
let BG = [82, 220, 201];
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
        this.numLayers = options.numLayers || NUM_LAYERS;
        this.createVertices();
        this.color = [200, 125, 150];
    }

    createVertices() {
        this.layers = [];
        var points = [];
        let x, y, a;

        for(let i = 0; i < this.sides; i++) {
            if(window.CP.shouldStopExecution(0)) break;

            a = Math.PI * 2 * i / this.sides;
            x = this.r * Math.cos(a);
            y = this.r * Math.sin(a);
            points.push([x, y]);
        }

        window.CP.exitedLoop(0);
        this.layers.push(points);

        let c;
    }
}