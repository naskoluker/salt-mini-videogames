import { MovementKeycodes } from "../shared/enums/movement-keys.enum";
import { Coords } from "../shared/interfaces/coords.interface";
import { MovementDirection } from "../shared/interfaces/movement.interface";

export class Snake {

    private head: Coords;
    tail: number;
    trail: Array<Coords>;
    movementDirection: MovementDirection;

    constructor() {
        this.head = { x: 15, y: 15 };
        this.tail = 5;
        this.trail = [{ x: 15, y: 15 }];
        this.movementDirection = MovementDirection.NONE;
    }

    /**
     * Moves the snake head to a new position
     * @returns true if the snake is alive or false if the snake is dead after the move
     */
    public move(): boolean {
        this.moveSnake();
        if (this.isMoving()) this.trail.push({ ...this.head });
        return !(this.isMoving()) || !this.checkIfSnakeEatsItself();
    }

    private checkIfSnakeEatsItself(): boolean {
        for (let i = 0; i < this.trail.length - 1; i++) {
            if (this.trail[i].x == this.head.x && this.trail[i].y == this.head.y) {
                return true;
            }
        }
        return false;
    }

    private isMoving() {
        return this.movementDirection != MovementDirection.NONE;
    }

    public getHead() {
        return this.head;
    }

    private moveSnake(): void {
        switch(this.movementDirection) {
            case MovementDirection.LEFT:
                this.head.x--;
                break;
            case MovementDirection.RIGHT:
                this.head.x++;
                break;
            case MovementDirection.UP:
                this.head.y--;
                break;
            case MovementDirection.DOWN:
                this.head.y++;
                break;
        }
    }

    public changeDirection(keyCode: number) {
        switch(keyCode) {
            case MovementKeycodes.ARROW_LEFT:
            case MovementKeycodes.A:
                this.moveLeft();
                break;
            case MovementKeycodes.ARROW_UP:
            case MovementKeycodes.W:
                this.moveUp();
                break;
            case MovementKeycodes.ARROW_RIGHT:
            case MovementKeycodes.D:
                this.moveRight();
                break;
            case MovementKeycodes.ARROW_DOWN:
            case MovementKeycodes.S:
                this.moveDown();
                break;
        }
    }

    /**
     * Changes the movement direction of the snake to left unless it is currently moving right
     */
    private moveLeft() {
        if (this.movementDirection !== MovementDirection.RIGHT) {
            this.movementDirection = MovementDirection.LEFT;
        }
    }

    /**
     * Changes the movement direction of the snake to up unless it is currently moving down
     */
    private moveUp() {
        if (this.movementDirection !== MovementDirection.DOWN) {
            this.movementDirection = MovementDirection.UP;
        }
    }

    /**
     * Changes the movement direction of the snake to right unless it is currently moving left
     */
    private moveRight() {
        if (this.movementDirection !== MovementDirection.LEFT) {
            this.movementDirection = MovementDirection.RIGHT;
        }
    }

    /**
     * Changes the movement direction of the snake to down unless it is currently moving up
     */
    private moveDown() {
        if (this.movementDirection !== MovementDirection.UP) {
            this.movementDirection = MovementDirection.DOWN;
        }
    }
}
