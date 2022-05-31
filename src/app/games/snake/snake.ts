import { BiDimensionalCoords, BiDimensionalMovementDirection, KeyboardArrows } from "../model/general-2d-game.model";

export class Snake {

    head: BiDimensionalCoords;
    tail: number;
    trail: Array<BiDimensionalCoords>;
    direction: BiDimensionalMovementDirection;

    constructor() {
        this.head = { x: 15, y: 15 };
        this.tail = 5;
        this.trail = [{ x: 15, y: 15 }];
        this.direction = { xv: 0, yv: 0 }
    }

    /**
     * Moves the snake head to a new position
     * @returns true if the snake is alive or false if the snake is dead after the move
     */
    move(gridSize: number): boolean {
        this.head.x += this.direction.xv;
        this.head.y += this.direction.yv;
        if (this.direction.xv || this.direction.yv) this.trail.push({ ...this.head });
        return !(this.direction.xv || this.direction.yv) || (!this.checkIfSnakeEatsItself() && !this.checkIfSnakeLeftGrid(gridSize));
    }

    private checkIfSnakeEatsItself(): boolean {
        for (let i = 0; i < this.trail.length - 1; i++) {
            if (this.trail[i].x == this.head.x && this.trail[i].y == this.head.y) {
                return true;
            }
        }
        return false;
    }

    private checkIfSnakeLeftGrid(gridSize: number): boolean {
        return this.head.x < 0 || this.head.x >= gridSize || this.head.y < 0 || this.head.y >= gridSize;
    }

    public changeDirection(keyCode: KeyboardArrows) {
        if (keyCode === KeyboardArrows.ARROW_LEFT)  this.direction = { xv: -1,  yv:  0 };
        if (keyCode === KeyboardArrows.ARROW_UP)    this.direction = { xv:  0,  yv: -1 };
        if (keyCode === KeyboardArrows.ARROW_RIGHT) this.direction = { xv:  1,  yv:  0 };
        if (keyCode === KeyboardArrows.ARROW_DOWN)  this.direction = { xv:  0,  yv:  1 };
    }
}
