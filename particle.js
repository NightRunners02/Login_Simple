const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particlesArray;

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

class Particle {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  const colors = ["#00fff9", "#ff00c1", "#0ff", "#fff"];
  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speedX = (Math.random() - 0.5) * 1.5;
    const speedY = (Math.random() - 0.5) * 1.5;
    particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();
