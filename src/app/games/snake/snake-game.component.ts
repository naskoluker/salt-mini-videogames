import { 
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2, 
  ElementRef
} from '@angular/core';
import { Keycodes } from '../shared/enums/keycodes.enum';
import { Coords } from '../shared/interfaces/coords.interface';
import { Snake } from './snake';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  CANVAS_SIZE: number = 600;
  private GRID_SIZE: number = 30;

  private ctx: CanvasRenderingContext2D;
  private interval: number;

  private snake: Snake;
  private apple: Coords;
  score: number;
  private objectSize: number;

  constructor(
    private renderer: Renderer2
  ) {
    this.objectSize = this.CANVAS_SIZE / this.GRID_SIZE;
    this.score = 0;
  }

  async ngOnInit(): Promise<void> {
    this.snake = new Snake(this.GRID_SIZE / 2);
    this.getContext().then((ctx: CanvasRenderingContext2D): void => {
      this.ctx = ctx;
      this.drawBackground();
      this.generateNewApple();
      this.renderer.listen('document', 'keydown', (evt: KeyboardEvent): void => this.keyPush(evt));
      this.interval = window.setInterval((): void => {
        this.game();
      }, 100);
    });
  }

  private async getContext(): Promise<CanvasRenderingContext2D> {
    return await this.canvas.nativeElement.getContext('2d');
  }

  ngOnDestroy(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  private game(): void {

    const alive: boolean = this.snake.move();

    if (alive && this.snakeInGrid()) {
      const head = this.snake.getHead();
      if (this.apple.x == head.x && this.apple.y == head.y) {
        this.eatApple();
      }
    } else {
      this.drawBackground();
      this.snake = new Snake(this.GRID_SIZE / 2);
      this.score = 0;
      this.generateNewApple();
    }
    this.drawSnake();
  }

  private drawSnake(): void {
    const trail: Array<Coords> = this.snake.getTrail();
    const lastTailCoords =  this.snake.getLastTailCoord();
    if (lastTailCoords) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        lastTailCoords.x * this.objectSize,
        lastTailCoords.y * this.objectSize,
        this.objectSize - 1,
        this.objectSize - 1);
    }

    this.ctx.fillStyle = "MediumSpringGreen";
    this.ctx.fillRect(
      trail[trail.length - 1].x * this.objectSize,
      trail[trail.length - 1].y * this.objectSize,
      this.objectSize - 1,
      this.objectSize - 1);
  }

  private drawBackground(): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
  }

  private eatApple(): void {
    this.snake.grow();
    this.score++;
    this.generateNewApple();
  }

  /**
   * Generates a new apple with random coordinates.
   */
  private generateNewApple(): void {

    const trail: Array<Coords> = this.snake.getTrail();
    const oldApple = this.apple;

    let apple: Coords;
    let distanceX: number;
    let distanceY: number;
    let longestDistance: number;
    let found: boolean;

    while (this.apple !== apple || this.apple === undefined) {
      found = false;
      apple = {
        x: Math.floor(Math.random() * this.GRID_SIZE),
        y: Math.floor(Math.random() * this.GRID_SIZE)
      }

      for (let i = 0; i < trail.length; i += longestDistance) {
        distanceX = Math.abs(apple.x - trail[i].x);
        distanceY = Math.abs(apple.y - trail[i].y);
        longestDistance = distanceX > distanceY ? distanceX : distanceY;
        if (longestDistance === 0) {
          found = true;
          break;
        }
      }

      if (!found) {
        this.apple = apple;
      }
    }

    this.drawApple(oldApple, this.apple);
  }

  /**
   * Erases the old apple and draws the new one
   */
  private drawApple(oldApple: Coords, newApple: Coords): void {
    if (oldApple) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        oldApple.x * this.objectSize,
        oldApple.y * this.objectSize,
        this.objectSize,
        this.objectSize);
      this.ctx.beginPath();
    }

    this.ctx.fillStyle = "OrangeRed";
    this.ctx.beginPath();
    this.ctx.arc(
      newApple.x * this.objectSize + this.objectSize/2,
      newApple.y * this.objectSize + this.objectSize/2,
      this.objectSize/2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  private keyPush(evt: KeyboardEvent): void {
    switch (evt.keyCode) {
      case Keycodes.ARROW_LEFT:
      case Keycodes.ARROW_UP:
      case Keycodes.ARROW_RIGHT:
      case Keycodes.ARROW_DOWN:
        evt.preventDefault();
        break;
    }
    this.snake.changeDirection(evt.keyCode);
  }

  /**
   * Checks if the snake is inside of the grid
   * @returns true if it's in the grid, false if it's not
   */
  private snakeInGrid(): boolean {
    const { x, y } = this.snake.getHead();
    return x >= 0 && y >= 0 && x < this.GRID_SIZE && y < this.GRID_SIZE;
  }
}
