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

  ctx: CanvasRenderingContext2D;
  canvasSize: number = 600;
  gridSize: number = 30;
  interval: number;

  snake: Snake;
  apple: Coords;
  objectSize: number = this.canvasSize / this.gridSize;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.snake = new Snake();
    this.generateNewApple();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.renderer.listen('document', 'keydown', (evt) => this.keyPush(evt));
    this.interval = window.setInterval(() => {
      this.game();
    }, 1000/12);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  game(): void {
    const alive = this.snake.move();
    const head = this.snake.getHead();
    if (alive && this.snakeInGrid()) {
      if (this.apple.x == head.x && this.apple.y == head.y) {
        this.eatApple();
      } else if (this.snake.tail < this.snake.trail.length) {
        this.snake.trail.shift();
      }
    } else {
      this.snake = new Snake();
      this.generateNewApple();
    }
    this.drawBackground();
    this.drawApple();
    this.drawSnake();
  }

  drawSnake(): void {
    this.ctx.fillStyle = "MediumSpringGreen";
    for (let i = 0; i < this.snake.trail.length; i++) {
      this.ctx.fillRect(
        this.snake.trail[i].x * this.objectSize,
        this.snake.trail[i].y * this.objectSize,
        this.objectSize - 1,
        this.objectSize - 1);
    }
  }

  drawBackground(): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  eatApple(): void {
    this.snake.tail++;
    this.generateNewApple();
  }

  /**
   * Generates a new apple with random coordinates.
   */
  generateNewApple(): void {
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

  keyPush(evt: any): void {
    this.snake.changeDirection(evt.keyCode);
  }

  private snakeInGrid(): boolean {
    const { x, y } = this.snake.getHead();
    return x >= 0 && y >= 0 && x < this.gridSize && y < this.gridSize;
  }
}
