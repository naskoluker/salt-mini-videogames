import { 
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2 } from '@angular/core';
import { BiDimensionalCoords } from '../model/bi-dimensional-coords';
import { Snake } from './model/snake.model';

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
    this.snake = new Snake({ x: 10, y: 10 }, 5, [], 0, 0);
    this.apple = { x: 0, y: 0 };
    this.generateNewApple();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.renderer.listen('document', 'keydown', (evt) => {this.keyPush(evt)});
    this.interval = setInterval(() => {
      this.game();
    }, 1000/15);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  game() {
    this.snake.move(this.gridSize);
    this.drawBackground();
    this.drawSnake();
    if (this.apple.x == this.snake.head.x && this.apple.y == this.snake.head.y) {
      this.eatApple();
    }
    this.drawApple();
  }

  drawSnake() {
    this.ctx.fillStyle = "lime";
    for (let i = 0; i < this.snake.trail.length; i++) {
      this.ctx.fillRect(
        this.snake.trail[i].x * this.objectSize,
        this.snake.trail[i].y * this.objectSize,
        this.objectSize - 1,
        this.objectSize - 1);
      if (this.snake.trail[i].x == this.snake.head.x && this.snake.trail[i].y == this.snake.head.y) {
        this.snake.tail = 5;
      }
    }

    this.snake.trail.push({ x: this.snake.head.x, y: this.snake.head.y });
    while(this.snake.trail.length > this.snake.tail) {
      this.snake.trail.shift();
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
   * Generates the new coordinates for the apple.
   */
  generateNewApple() {
    this.apple.x = Math.floor(Math.random() * this.gridSize);
    this.apple.y = Math.floor(Math.random() * this.gridSize);
  }

  private drawApple() {
    this.ctx.fillStyle = "red";
    this.ctx.beginPath();
    this.ctx.arc(this.apple.x * this.objectSize + this.objectSize/2, this.apple.y * this.objectSize + this.objectSize/2, this.objectSize/2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  keyPush(evt: any) {
    switch(evt.keyCode) {
      case 37: // left
        this.snake.left();
        break;
      case 38: // up
        this.snake.up();
        break;
      case 39: // right
        this.snake.right();
        break;
      case 40: // down
        this.snake.down();
        break;
    }
  }
}
