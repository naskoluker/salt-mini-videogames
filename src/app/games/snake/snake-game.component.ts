import { 
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2 } from '@angular/core';
import { BiDimensionalCoords } from '../model/general-2d-game.model';
import { Snake } from './snake';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, OnDestroy {

  @ViewChild('canvasSnake', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  canvasSize = 600;
  gridSize: number = 30;
  interval: any;

  snake: Snake;
  apple: BiDimensionalCoords;
  objectSize: number = this.canvasSize / this.gridSize;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.snake = new Snake();
    this.generateNewApple();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.renderer.listen('document', 'keydown', (evt) => this.keyPush(evt));
    this.interval = setInterval(() => {
      this.game();
    }, 1000/12);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  game() {
    const alive = this.snake.move(this.gridSize);
    if (alive) {
      if (this.apple.x == this.snake.head.x && this.apple.y == this.snake.head.y) {
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

  drawSnake() {
    this.ctx.fillStyle = "MediumSpringGreen";
    for (let i = 0; i < this.snake.trail.length; i++) {
      this.ctx.fillRect(
        this.snake.trail[i].x * this.objectSize,
        this.snake.trail[i].y * this.objectSize,
        this.objectSize - 1,
        this.objectSize - 1);
    }
  }

  drawBackground() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  eatApple() {
    this.snake.tail++;
    this.generateNewApple();
  }

  /**
   * Generates a new apple with random coordinates.
   */
  generateNewApple() {
    this.apple = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    }
  }

  private drawApple() {
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

  keyPush(evt: any) {
    this.snake.changeDirection(evt.keyCode);
  }
}
