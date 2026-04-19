star_container = document.createElement("div");
document.addEventListener("DOMContentLoaded", function(event) {
   document.body.appendChild(star_container);
});

star_purple = new Image();
star_purple.src = "/Stars/star-purple.png";
star_purple.addEventListener("load", () => {
  star_scattering_stars();
});

parallax_layers = [];
mouse_position = new Vector2(0, 0);

function update_parallax(layer) {
  for (const layer of parallax_layers) {
    layer.MoveToward(mouse_position);
  }
}

function star_scattering_stars() {
  var canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  var layer = new ParallaxLayer(canvas, 0.25);
  scatter_images(canvas, star_purple, 200);
  parallax_layers.push(layer);
  star_container.appendChild(canvas);
}

function scatter_images(canvas, image, count) {
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < count; i++) {
    let x = getRandomArbitrary(0, canvas.width);
    let y = getRandomArbitrary(0, canvas.height);
    ctx.drawImage(image, x, y);
  }
}

function ParallaxLayer(canvas, move_rate, origin=null, lerp=0.05) {
  this.canvas = canvas;
  this.moveRate = move_rate;
  if (origin === null) {
    origin = new Vector2(0, 0); 
  }
  this.origin = origin;
  this.lerp = lerp;
  
  this.MoveToward = function(position) {
    let move_toward = new Vector2(0 ,0);
    move_toward.x = position.x * this.moveRate;
    move_toward.y = position.x * this.moveRate;
    this.canvas.x = lerp(this.canvas.x, move_toward.x, this.lerp) + this.origin.x;
    this.canvas.y = lerp(this.canvas.y, move_toward.y, this.lerp) + this.origin.y;
  };
}

function Vector2(x, y) {
  this.x = x;
  this.y = y;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}