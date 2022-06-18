import { Keycodes } from "../shared/enums/keycodes.enum";
import { Coords } from "../shared/interfaces/coords.interface";
import { MovementDirection } from "../shared/interfaces/movement.interface";

export class Snake {

    private head: Coords;
    private tail: number;
    private trail: Array<Coords>;
    private movementDirection: MovementDirection;
    private lastMovementDirection: MovementDirection;

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
        if (this.isMoving()) {
            this.moveSnake();
            this.trail.push({ ...this.head });
        }
        if (this.tail < this.trail.length) {
            this.trail.shift();
        }
        return !(this.isMoving()) || !this.checkIfSnakeEatsItself();
    }

    private checkIfSnakeEatsItself(): boolean {
        for (let i = 0; i < this.trail.length - 4; i++) {
            if (this.trail[i].x == this.head.x && this.trail[i].y == this.head.y) {
                return true;
            }
        }
        return false;
    }

    private isMoving() {
        return this.movementDirection != MovementDirection.NONE;
    }

    public getHead(): Coords {
        return this.head;
    }

    public getTrail(): Array<Coords> {
        return this.trail;
    }

    public getTail(): number {
        return this.tail;
    }

    public grow() {
        this.tail++;
    }

    private moveSnake(): void {
        this.lastMovementDirection = this.movementDirection; 
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

    /**
     * Changes the direction of movement unless the snake has
     * not moved since the previous time it changed directions
     */
    public changeDirection(keyCode: number): void {
        switch(keyCode) {
            case Keycodes.ARROW_LEFT:
            case Keycodes.A:
                this.moveLeft();
                break;
            case Keycodes.ARROW_UP:
            case Keycodes.W:
                this.moveUp();
                break;
            case Keycodes.ARROW_RIGHT:
            case Keycodes.D:
                this.moveRight();
                break;
            case Keycodes.ARROW_DOWN:
            case Keycodes.S:
                this.moveDown();
                break;
        }
    }

    /**
     * Changes the movement direction of the snake to left unless it is currently moving right
     */
    private moveLeft(): void {
        if (this.lastMovementDirection !== MovementDirection.RIGHT) {
            this.movementDirection = MovementDirection.LEFT;
        }
    }

    /**
     * Changes the movement direction of the snake to up unless it is currently moving down
     */
    private moveUp(): void {
        if (this.lastMovementDirection !== MovementDirection.DOWN) {
            this.movementDirection = MovementDirection.UP;
        }
    }

    /**
     * Changes the movement direction of the snake to right unless it is currently moving left
     */
    private moveRight(): void {
        if (this.lastMovementDirection !== MovementDirection.LEFT) {
            this.movementDirection = MovementDirection.RIGHT;
        }
    }

    /**
     * Changes the movement direction of the snake to down unless it is currently moving up
     */
    private moveDown(): void {
        if (this.lastMovementDirection !== MovementDirection.UP) {
            this.movementDirection = MovementDirection.DOWN;
        }
    }
}
