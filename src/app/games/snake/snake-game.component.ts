import { 
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2, 
  ElementRef
} from '@angular/core';
import { Coords } from '../shared/interfaces/coords.interface';
import { Snake } from './snake';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  canvasSize: number = 600;
  private gridSize: number = 30;
  private interval: number;

  private snake: Snake;
  private apple: Coords;
  private objectSize: number;

  constructor(
    private renderer: Renderer2
  ) {
    this.objectSize = this.canvasSize / this.gridSize; 
  }

  ngOnInit(): void {
    this.snake = new Snake();
    this.generateNewApple();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.renderer.listen('document', 'keydown', (evt: KeyboardEvent): void => this.keyPush(evt));
    this.interval = window.setInterval((): void => {
      this.game();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  private game(): void {

    const alive = this.snake.move();

    if (alive && this.snakeInGrid()) {

      const head = this.snake.getHead();
      const trail = this.snake.getTrail();
      const tail = this.snake.getTail();

      if (this.apple.x == head.x && this.apple.y == head.y) {
        this.eatApple();
      }

      this.drawBackground();
      this.drawApple();
      this.drawSnake(trail);
    } else {
      this.snake = new Snake();
      this.generateNewApple();
    }
  }

  private drawSnake(trail: Array<Coords>): void {
    this.ctx.fillStyle = "MediumSpringGreen";
    for (let i = 0; i < trail.length; i++) {
      this.ctx.fillRect(
        trail[i].x * this.objectSize,
        trail[i].y * this.objectSize,
        this.objectSize - 1,
        this.objectSize - 1);
    }
  }

  private drawBackground(): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  private eatApple(): void {
    this.snake.grow();
    this.generateNewApple();
  }

  /**
   * Generates a new apple with random coordinates.
   */
  private generateNewApple(): void {
    this.apple = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    }
  }

  private drawApple(): void {
    this.ctx.fillStyle = "OrangeRed";
    this.ctx.beginPath();
    this.ctx.arc(
      this.apple.x * this.objectSize + this.objectSize/2,
      this.apple.y * this.objectSize + this.objectSize/2,
      this.objectSize/2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  private keyPush(evt: KeyboardEvent): void {
    this.snake.changeDirection(evt.keyCode);
  }

  /**
   * Checks if the snake is inside of the grid
   * @returns true if it's in the grid, false if it's not
   */
  private snakeInGrid(): boolean {
    const { x, y } = this.snake.getHead();
    return x >= 0 && y >= 0 && x < this.gridSize && y < this.gridSize;
  }
}
