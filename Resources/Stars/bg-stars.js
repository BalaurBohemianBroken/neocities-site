// TODO: Fix scrollbars

// I'm not thrilled with the result of this.
// I thought about changing it so that each star is its own element and has its own parallax speed.
// This would give a slightly more authentic look to the movement of the stars, more depth.
// I opted not to entirely for performance.
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

function scatter_stars(star_path, count, size_min, size_max, custom_parallax=0) {
  let parallax;
  if (custom_parallax !== 0) {
    parallax = custom_parallax * parallax_factor;
  }
  else {
    parallax = (size_min + size_max) * parallax_factor;
  }
  let star = new Image();
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
    let move_toward = new Vector2(0, 0);
    move_toward.x = target_position.x * this.moveRate;
    move_toward.y = target_position.y * this.moveRate;
    this.position.x = lerp(this.position.x, move_toward.x, this.lerpSpeed);
    this.position.y = lerp(this.position.y, move_toward.y, this.lerpSpeed);
    
    this.canvas.style.left = this.position.x + this.origin.x + "px";
    this.canvas.style.top = this.position.y + this.origin.x + "px";
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
  return ((to - from) * t) + from;
}


parallax_layers = [];
parallax_factor = 0.04;
mouse_position = new Vector2(0, 0);
scroll_position = new Vector2(0, 0);

star_container = document.createElement("div");
star_container.setAttribute("id", "stars");
document.addEventListener("DOMContentLoaded", function(event) {
   document.body.prepend(star_container);
});

// TODO: arrange by parallax level
scatter_stars("/Resources/Stars/star.png", 100, 0.1, 0.25);
scatter_stars("/Resources/Stars/star-red.png", 100, 0.1, 0.25);
scatter_stars("/Resources/Stars/star.png", 100, 0.25, 0.4);
scatter_stars("/Resources/Stars/star-red.png", 100, 0.25, 0.4);

scatter_stars("/Resources/Stars/star-pink.png", 60, 0.2, 0.35);
scatter_stars("/Resources/Stars/star-pink.png", 40, 0.35, 0.5);

scatter_stars("/Resources/Stars/star-purple.png", 60, 0.4, 0.6);
scatter_stars("/Resources/Stars/star-purple.png", 40, 0.6, 0.8);

scatter_stars("/Resources/Stars/star.png", 50, 0.3, 0.45);
scatter_stars("/Resources/Stars/star.png", 50, 0.45, 0.6);
scatter_stars("/Resources/Stars/star.png", 25, 0.5, 0.7);
scatter_stars("/Resources/Stars/star.png", 25, 0.7, 0.9);

scatter_stars("/Resources/Stars/nova.png", 10, 1.2, 1.2, 0.1);
scatter_stars("/Resources/Stars/nova.png", 8, 1.4, 1.4, 0.2);
scatter_stars("/Resources/Stars/nova.png", 6, 1.6, 1.6, 0.3);
scatter_stars("/Resources/Stars/nova.png", 4, 1.8, 1.8, 0.4);
scatter_stars("/Resources/Stars/nova.png", 2, 2, 2, 0.5);

document.addEventListener("mousemove", update_mouse_position);
setInterval(update_parallax, 25);
