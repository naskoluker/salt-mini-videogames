import { 
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2 } from '@angular/core';
import { Snake } from './snake.model';
import { Coords2D } from '../coords2-d';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, OnDestroy {

  @ViewChild('canvasSnake', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  snake: Snake;
  gridSize = 20;

  apple: Coords2D;

  ctx: CanvasRenderingContext2D;

  id: any;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.snake = new Snake({ x: 10, y: 10 }, 5, [], 0, 0);
    this.apple = { x: 0, y: 0 };
    this.generateApple();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.renderer.listen('document', 'keydown', (evt) => {this.keyPush(evt)});
    this.game();
    this.id = setInterval(() => {
      this.game();
    }, 1000/15);
  }

  ngOnDestroy(): void {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  game() {
    console.log('e');
    this.snake.move(this.gridSize);
    this.drawBackground();
    this.ctx.fillStyle = "lime";
    for (var i = 0; i < this.snake.trail.length; i++) {
      this.ctx.fillRect(
        this.snake.trail[i].x * this.gridSize,
        this.snake.trail[i].y * this.gridSize,
        this.gridSize - 2,
        this.gridSize - 2);
      if (this.snake.trail[i].x == this.snake.head.x && this.snake.trail[i].y == this.snake.head.y) {
        this.snake.tail = 5;
      }
    }
    this.snake.trail.push({ x: this.snake.head.x, y: this.snake.head.y });

    while(this.snake.trail.length > this.snake.tail) {
      this.snake.trail.shift();
    }

    if (this.apple.x == this.snake.head.x && this.apple.y == this.snake.head.y) {
      this.snake.tail++;
      this.generateApple();
    }

    this.drawApple();
  }

  drawBackground() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 400, 400);
  }

  generateApple() {
    this.apple.x = Math.floor(Math.random() * this.gridSize);
    this.apple.y = Math.floor(Math.random() * this.gridSize);
  }

  private drawApple() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.apple.x * this.gridSize, this.apple.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
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
