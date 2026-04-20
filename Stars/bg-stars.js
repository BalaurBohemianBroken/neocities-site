function update_mouse_position(e) {
  mouse_position.x = e.clientX;
  mouse_position.y = e.clientY;
}

function update_parallax() {
  let target_position = new Vector2(0, 0);
  target_position.x = mouse_position.x + window.scrollX;
  target_position.y = mouse_position.y + window.scrollY;
  for (const layer of parallax_layers) {
    layer.MoveToward(target_position);
  }
}

function scatter_stars(star_path, count, size_min, size_max) {
  let parallax = (size_min + size_max) / 2;
  var star = new Image();
  star.src = star_path;
  star.addEventListener("load", () => {
    var layer = new ParallaxLayer(1920, 1080, parallax);
    scatter_images(layer.canvas, star, count, size_min, size_max);
    parallax_layers.push(layer);
    star_container.appendChild(layer.canvas);
  });
  
}

function scatter_images(canvas, image, count, image_size_min=1, image_size_max=1) {
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < count; i++) {
    let x = random_range(0, canvas.width);
    let y = random_range(0, canvas.height);
    let scale = random_range(image_size_min, image_size_max);
    let w = scale * image.width;
    let h = scale * image.height;
    ctx.drawImage(image, x, y, w, h);
  }
}

function ParallaxLayer(w, h, move_rate, origin=null, lerpSpeed=0.05) {
  this.canvas = document.createElement("canvas");
  this.canvas.width = w;
  this.canvas.height = h;
  this.moveRate = move_rate;
  if (origin === null) {
    origin = new Vector2(0, 0); 
  }
  this.origin = origin;
  this.lerpSpeed = lerpSpeed;
  this.position = new Vector2(0, 0);
  
  this.MoveToward = function(target_position) {
    let move_toward = new Vector2(0 ,0);
    move_toward.x = target_position.x * this.moveRate;
    move_toward.y = target_position.y * this.moveRate;
    this.position.x = lerp(this.position.x, move_toward.x, this.lerpSpeed) + this.origin.x;
    this.position.y = lerp(this.position.y, move_toward.y, this.lerpSpeed) + this.origin.y;
    
    this.canvas.style.left = this.position.x + "px";
    this.canvas.style.top = this.position.y + "px";
  };
}

function Vector2(x, y) {
  this.x = x;
  this.y = y;
}

function random_range(min, max) {
  return Math.random() * (max - min) + min;
}

function lerp(from, to, t) {
  return (from + (to - from)) * t;
}


parallax_layers = [];
mouse_position = new Vector2(0, 0);
scroll_position = new Vector2(0, 0);

star_container = document.createElement("div");
star_container.setAttribute("id", "stars");
document.addEventListener("DOMContentLoaded", function(event) {
   document.body.prepend(star_container);
});

scatter_stars("/Stars/star-red.png", 200, 0.1, 0.4);
scatter_stars("/Stars/star-pink.png", 100, 0.2, 0.5);
//scatter_stars("/Stars/star-yellow.png", 100, 0.3, 0.6, 0.4);
scatter_stars("/Stars/star-purple.png", 100, 0.4, 0.8);
//scatter_stars("/Stars/star-blue.png", 50, 0.5, 0.9, 0.6);
scatter_stars("/Stars/star.png", 200, 0.1, 0.4);
scatter_stars("/Stars/star.png", 100, 0.3, 0.6);
scatter_stars("/Stars/star.png", 50, 0.5, 0.9);

document.addEventListener("mousemove", update_mouse_position);
setInterval(update_parallax, 50);
