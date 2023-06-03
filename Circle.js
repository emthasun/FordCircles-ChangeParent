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
    this.colorStopType0 = [
      "rgb(250, 150, 20)",
      "rgb(250, 100, 210)",
      "rgb(210, 190, 255)",
    ];
    this.colorStopType1 = [
      "rgb(255, 255, 255)",
      "rgb(240, 240, 240)",
      "rgb(200, 200, 200)",
    ];
    this.draw();
  }

  update(x, y) {
    this.x = x;
    this.y = y;
    this.radius += (this.targetRadius - this.radius) * 0.1;
  }

  changeColor(newColor) {
    this.colorStopType0 = newColor;
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
      gradient.addColorStop(0, this.colorStopType0[0]);
      gradient.addColorStop(0.5, this.colorStopType0[1]);
      gradient.addColorStop(1, this.colorStopType0[2]);
    } else if (this.type == 1) {
      gradient.addColorStop(0, this.colorStopType1[0]);
      gradient.addColorStop(0.93, this.colorStopType1[1]);
      gradient.addColorStop(1, this.colorStopType1[2]);
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
