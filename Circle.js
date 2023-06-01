export default class Circle {
  constructor(x, y, radius, type, ctx) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.targetRadius = radius;
    this.ctx = ctx;
    this.type = type;
    this.parentCircle = null;
    this.angle = 0;
    this.speed = 0.005;
    this.draw();
  }

  update(x, y) {
    this.x = x;
    this.y = y;

    this.radius += (this.targetRadius - this.radius) * 0.1;
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
      // this.ctx.stroke();
      // this.ctx.strokeStyle = "white";
      this.ctx.fillStyle = gradient;
      gradient.addColorStop(0, "rgb(250, 150, 20)");
      gradient.addColorStop(0.5, "rgb(250, 100, 210)");
      gradient.addColorStop(1, "rgb(210, 190, 255)");
    } else if (this.type == 1) {
      gradient.addColorStop(1, "rgb(255, 255, 255)");
      gradient.addColorStop(0.93, "rgb(240, 240, 240)");
      // gradient.addColorStop(0.4, 'rgb(100, 100, 200)');
      gradient.addColorStop(0.1, "rgb(200, 200, 200)");
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
