import * as Tone from "tone";
import Circle from "./Circle";
//import DebuggerLine from "./DebuggerLine";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.numerator = [0, 1];
    this.denominator = [1, 1];
    this.copyNumerator;
    this.copyDenominator;
    this.changeParent;
    this.tangentPoints = [];
    this.currentIndex;

    //1 - Launch Ball
    //2 - Remove Ball
    this.mode = 2;

    this.removedParent = [];

    this.previousParent = null;

    /**
     * Calcul  de la largeur de l'ensemble des cercles pour que ça prenne toute la largeur de l'écran
     */
    this.ford_circles_width = window.innerWidth / 2.2;
    /**
     * Calcul des ford circles par rapport à la séquence de Farey
     */
    this.fareySequence(3);
    /**
     * listener pour le redimensionnement de la fenêtre
     */
    window.addEventListener("resize", this.resize.bind(this));
    /**
     * listener pour le click de la souris
     */
    // memory for the extra circles (the blue ones)
    this.childCircles = [];
    document.addEventListener("click", this.checkClick.bind(this));

    document.addEventListener("keyup", this.keyUpHandler.bind(this));

    //this.debuggerLine = null;

    this.setup();
  }

  keyUpHandler(ev) {
    switch (ev.keyCode) {
      case 49:
        this.mode = 1;
        break;
      case 50:
        this.mode = 2;
        break;
      default:
        break;
    }
    console.log("mode: " + this.mode);
  }

  setup() {
    this.buildFordCircles();
    this.calculateTangentPoints();
    this.draw();
  }

  calculateTangentPoints() {
    // Reset the tangent points array
    this.tangentPoints = [];
    console.log(this.tangentPoints);

    // Iterate over each pair of circles
    for (let i = 0; i < this.fordCircles.length; i++) {
      const circle1 = this.fordCircles[i];
      for (let j = i + 1; j < this.fordCircles.length; j++) {
        const circle2 = this.fordCircles[j];

        // Calculate the distance between the circle centers
        const d = this.distance(circle1.x, circle1.y, circle2.x, circle2.y);

        // Calculate the sum of the radii
        const sumOfRadii = circle1.radius + circle2.radius;

        // Check if the circles are tangent (within a small threshold)
        if (Math.abs(d - sumOfRadii) < 0.01) {
          // Calculate the angle between the centers of the circles
          const angle = Math.atan2(
            circle2.y - circle1.y,
            circle2.x - circle1.x
          );

          const x_tan1 = circle1.x + circle1.radius * Math.cos(angle);
          const y_tan1 = circle1.y + circle1.radius * Math.sin(angle);

          this.tangentPoints.push({ x: x_tan1, y: y_tan1, name1: i, name2: j });
        }
      }
    }
  }

  drawTangentPoints() {
    // Set the style for the tangent points
    this.ctx.fillStyle = "red";

    // Draw a small red circle at each tangent point
    this.tangentPoints.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  checkClick(e) {
    //check if click is inside any circle
    this.fordCircles.forEach((circle, index) => {
      const dist = this.distance(e.clientX, e.clientY, circle.x, circle.y);

      if (dist < circle.radius) {
        if (this.mode === 1 && this.removedParent.includes(index)) {
          this.addChildCircle(circle, index);

          const randomSoundNumber = Math.floor(Math.random() * 19) + 1;
          this.audio = new Audio(`Assets/sound${randomSoundNumber}.wav`);

          this.audio.play();
        } else if (this.mode == 2 && !this.removedParent.includes(index)) {
          this.removedParent.push(index);
          circle.changeColor([
            "rgb(255, 255, 255)",
            "rgb(240, 240, 240)",
            "rgb(200, 200, 200)",
          ]);

          // this.synth.triggerAttackRelease(
          //   `${this.notes[Math.floor(Math.random() * this.notes.length)]}${
          //     Math.floor(Math.random() * 3) + 1.5
          //   }`,
          //   "1n"
          // );
        }
      }
    });
  }

  compareIndex(tangent1, tangent2, currentParentIndex) {
    // console.log(tangent1, tangent2, currentParentIndex); // Debug statement

    if (currentParentIndex == tangent1) {
      return tangent2;
    } else {
      return tangent1;
    }
  }

  addChildCircle(parentCircle, name) {
    const circleIndex = name;
    this.currentIndex = name;
    console.log("currentIndex:" + this.currentIndex);
    const miniradius = parentCircle.radius / 4;
    const x = parentCircle.x;
    const y = parentCircle.y - parentCircle.radius + miniradius;
    const circle = new Circle(x, y, miniradius, 1, this.ctx);
    circle.parentCircle = parentCircle;
    circle.angle = 0;
    circle.parentName = name;
    this.childCircles.push(circle);
  }

  // -> Create Function to compare Tangentpoint index's and currentIndex
  // -> return otherIndex -> in Collision Function
  //-> exchange parentCircle with otherIndex

  fareySequence(step) {
    this.copyNumerator = JSON.parse(JSON.stringify(this.numerator));
    this.copyDenominator = JSON.parse(JSON.stringify(this.denominator));

    for (let i = 1; i <= step; i++) {
      let index = 1;
      //handle numerators
      for (let j = 0; j < this.numerator.length - 1; j++) {
        let newTop = this.numerator[j] + this.numerator[j + 1];
        this.copyNumerator.splice(j + index, 0, newTop);
        index++;
      }
      index = 1;
      //handle denominators
      for (let j = 0; j < this.denominator.length - 1; j++) {
        let newBottom = this.denominator[j] + this.denominator[j + 1];
        this.copyDenominator.splice(j + index, 0, newBottom);
        index++;
      }

      this.numerator = JSON.parse(JSON.stringify(this.copyNumerator));
      this.denominator = JSON.parse(JSON.stringify(this.copyDenominator));
    }

    // tous les centre
    this.centers = [];
    for (let i = 0; i < this.numerator.length; i++) {
      const positionX =
        this.ford_circles_width * (this.numerator[i] / this.denominator[i]);
      this.centers.push(positionX);
    }
  }

  radius(q) {
    return 1 / (2 * q ** 2);
  }

  //Ford Circles
  buildFordCircles() {
    // memory for the circles
    this.fordCircles = [];
    // pour centrer les cercles en x
    const offsetX = window.innerWidth / 2 - this.ford_circles_width / 2;
    // pour centrer les cercles en y
    const baseline = window.innerHeight / 2 + this.ford_circles_width / 2;
    // on construit les cercles
    for (let i = 0; i < this.centers.length; i++) {
      const radius = this.radius(this.denominator[i]) * this.ford_circles_width;
      const x = this.centers[i] + offsetX;
      const y = baseline - radius;
      const circle = new Circle(x, y, radius, 0, this.ctx);
      circle.audio = new Audio(`Assets/sound${i <= 19 ? i + 1 : 20}.wav`);
      this.fordCircles.push(circle);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.fordCircles.forEach((circle) => {
      circle.draw();
    });

    const tolerance = 1; // Tolerance in pixels

    this.childCircles.forEach((circle) => {
      const centerX = circle.parentCircle.x;
      const centerY = circle.parentCircle.y;
      const radius = circle.parentCircle.radius; // - circle.radius;
      const x = centerX + radius * Math.cos(circle.angle);
      const y = centerY + radius * Math.sin(circle.angle);
      circle.update(x, y);
      circle.draw();

      let collisionPoint = null;
      const collision = this.tangentPoints.some((point) => {
        const distance = Math.sqrt(
          (point.x - circle.x) ** 2 + (point.y - circle.y) ** 2
        );
        const isWithinRange = distance <= /*circle.radius + */ tolerance;
        if (isWithinRange) {
          collisionPoint = point;
          return true;
        }
        return false;
      });

      if (collision) {
        this.changeParent = this.compareIndex(
          collisionPoint.name1,
          collisionPoint.name2,
          circle.parentName
        );

        if (
          this.changeParent !== this.previousParent &&
          circle.prevParent != this.changeParent &&
          this.removedParent.includes(this.changeParent)
        ) {
          this.previousParent = this.changeParent;
          // console.log(this.changeParent);

          console.log("hit");
          console.log("changeParent:  " + this.changeParent);
          // const dx = collisionPoint.x - circle.x;
          // const dy = collisionPoint.y - circle.y;
          // circle.angle = Math.atan2(dy, dx);
          // get the angle from the new parent center
          const dx = collisionPoint.x - this.fordCircles[this.changeParent].x;
          const dy = collisionPoint.y - this.fordCircles[this.changeParent].y;
          // const len = this.distance(
          //   this.fordCircles[this.changeParent].x,
          //   this.fordCircles[this.changeParent].y,
          //   collisionPoint.x,
          //   collisionPoint.y
          // );
          //this.debuggerLine = new DebuggerLine(
          //   this.fordCircles[this.changeParent].x,
          //   this.fordCircles[this.changeParent].y,
          //   len,
          //   Math.atan2(dy, dx),
          //   this.ctx
          // );

          //should get the ratio between the previous parent and the new one
          const ratio =
            circle.parentCircle.radius /
            this.fordCircles[this.changeParent].radius;

          circle.parentCircle = this.fordCircles[this.changeParent];
          circle.prevParent = circle.parentName;
          circle.parentName = this.changeParent;
          circle.angle = Math.atan2(dy, dx);
          // to keep "constant speed"
          circle.speed *= -ratio;
          circle.targetRadius = this.fordCircles[this.changeParent].radius / 4;
          this.fordCircles[this.changeParent].audio.play();
        }
      }
    });

    //this.drawTangentPoints();

    //if (this.debuggerLine) this.debuggerLine.draw();

    requestAnimationFrame(this.draw.bind(this));
  }

  // si on redimensionne la fenêtre on doit recalculer les centres des cercles, car les proportions changent
  // et on doit reconstruire les cercles
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ford_circles_width = window.innerWidth / 2;

    // remove extra circles
    this.childCircles = [];

    this.centers = [];
    for (let i = 0; i < this.numerator.length; i++) {
      const positionX =
        this.ford_circles_width * (this.numerator[i] / this.denominator[i]);
      this.centers.push(positionX);
    }
    this.buildFordCircles();
  }

  //calcul de la distance entre deux points
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // calcul de map d'une valeur d'un intervalle à un autre
  map(value, start1, stop1, start2, stop2) {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }
}

const app = new App();
