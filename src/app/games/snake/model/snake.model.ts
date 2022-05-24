import { BiDimensionalCoords } from "../../model/bi-dimensional-coords";

export class Snake {

    head: BiDimensionalCoords;
    tail: number;
    trail: Array<BiDimensionalCoords>;
    xv:  number;
    yv:  number;

    constructor(
        head: BiDimensionalCoords,
        tail: number,
        trail: Array<BiDimensionalCoords>,
        xv:  number,
        yv:  number
    ) {
        this.head = head;
        this.tail = tail;
        this.trail = trail;
        this.xv = xv;
        this.yv = yv;
    }

    move(gridSize: number) {
        this.head.x += this.xv;
        this.head.y += this.yv;

        if (this.head.x < 0) {
          this.head.x = gridSize - 1;
        }
        if (this.head.x > gridSize - 1) {
            this.head.x = 0;
        }
        if (this.head.y < 0) {
          this.head.y = gridSize - 1;
        }
        if (this.head.y > gridSize - 1) {
          this.head.y = 0;
        }
    }

    up() {
        this.xv = 0
        this.yv = -1;
    }

    down() {
        this.xv = 0
        this.yv = 1;
    }

    left () {
        this.xv = -1;
        this.yv =  0;
    }

    right() {
        this.xv = 1;
        this.yv = 0;
    }
}
