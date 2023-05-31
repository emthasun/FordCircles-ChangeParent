export default class Circle {
  constructor(x, y, radius, type, ctx) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.type = type;
    this.parentCircle = null;
    this.angle = 0;
    this.speed = 0.01;
    this.draw();
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    const gradient = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    if (this.type == 0) {
      //gradient.addColorStop(0, 'rgb(0, 0, 0)');
      gradient.addColorStop(0, "rgb(0, 0, 20)");
      gradient.addColorStop(0.6, "rgb(30, 30, 150)");
      gradient.addColorStop(1, "rgb(70, 70, 250)");
    } else if (this.type == 1) {
      gradient.addColorStop(1, "rgb(255, 255, 255)");
      gradient.addColorStop(0.93, "rgb(200, 200, 255)");
      // gradient.addColorStop(0.4, 'rgb(100, 100, 200)');
      gradient.addColorStop(0.1, "rgb(60, 60, 180)");
    }

    this.ctx.fillStyle = gradient;
    // this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    // just in case we want to move the circle
    this.angle += this.speed;
  }
}
