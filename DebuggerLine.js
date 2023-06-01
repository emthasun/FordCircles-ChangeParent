export default class DebuggerLine {
  constructor(x, y, len, angle, ctx) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.angle = angle;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.strokeStyle = "yellow";
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.len, 0);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }
}
