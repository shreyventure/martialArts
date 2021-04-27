const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const kick = document.getElementById("kick");
const punch = document.getElementById("punch");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const block = document.getElementById("block");

var images = [];

var types = {
  idle: [0, 1, 2, 3, 4, 5, 6, 7],
  kick: [0, 1, 2, 3, 4, 5, 6],
  punch: [0, 1, 2, 3, 4, 5, 6],
  forward: [0, 1, 2, 3, 4, 5],
  backward: [0, 1, 2, 3, 4, 5],
  block: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const loadImage = (src, callback) => {
  const img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

var background;
loadImage("/images/background.jpg", (img) => {
  ctx.drawImage(img, 0, 0, 600, 600);
  background = img;
});

var i = 0;
var frames = 0;

var x = 0;
var y = 100;
const changeImage = () => {
  ctx.clearRect(0, 0, c.width, c.height);

  ctx.drawImage(background, 0, 0, 600, 600);
  ctx.drawImage(images[i], x, y, 500, 500);
  i = (i + 1) % frames;
};

const loadImages = (type_str, callback) => {
  if (type_str === "idle") frames = 8;
  else if (type_str === "forward" || type_str === "backward") frames = 6;
  else if (type_str === "block") frames = 9;
  else frames = 7;

  var count = frames;
  types[type_str].forEach((val) => {
    loadImage("/images/" + type_str + "/" + Number(val + 1) + ".png", (img) => {
      images[val] = img;
      count--;
      if (count === 0) {
        callback();
      }
    });
  });
};

var intervalRunning = -1;
var queue = [];

const main = () => {
  if (queue.length === 0)
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  else {
    while (queue.length !== 0) {
      loadImages(queue.shift(), () => {
        intervalRunning = setInterval(changeImage, 100);
      });
    }
  }
};

const kickHim = () => {
  clearInterval(intervalRunning);
  x += 80;
  loadImages("kick", () => {
    intervalRunning = setInterval(changeImage, 100);
  });
  setTimeout(() => {
    clearInterval(intervalRunning);
    x -= 80;
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  }, 700);
};

const punchHim = () => {
  clearInterval(intervalRunning);
  x += 60;
  loadImages("punch", () => {
    intervalRunning = setInterval(changeImage, 100);
  });
  setTimeout(() => {
    clearInterval(intervalRunning);
    x -= 60;
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  }, 700);
};

const forwardYouGo = () => {
  clearInterval(intervalRunning);
  x += 60;
  loadImages("forward", () => {
    intervalRunning = setInterval(changeImage, 100);
  });
  setTimeout(() => {
    clearInterval(intervalRunning);
    x -= 60;
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  }, 700);
};

const backwardYouGo = () => {
  clearInterval(intervalRunning);
  x -= 150;
  loadImages("backward", () => {
    intervalRunning = setInterval(changeImage, 100);
  });
  setTimeout(() => {
    clearInterval(intervalRunning);
    x += 150;
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  }, 700);
};

const blockHim = () => {
  clearInterval(intervalRunning);
  loadImages("block", () => {
    intervalRunning = setInterval(changeImage, 100);
  });
  setTimeout(() => {
    clearInterval(intervalRunning);
    loadImages("idle", () => {
      intervalRunning = setInterval(changeImage, 100);
    });
  }, 700);
};

kick.onclick = kickHim;
punch.onclick = punchHim;
forward.onclick = forwardYouGo;
backward.onclick = backwardYouGo;
block.onclick = blockHim;

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "ArrowUp") punchHim();
  if (e.key === "ArrowDown") kickHim();
  if (e.key === " ") speedUp();
  if (e.key === "b") blockHim();
  if (e.key === "ArrowRight") forwardYouGo();
  if (e.key === "ArrowLeft") backwardYouGo();
});

var speed = document.getElementById("speed");
const speedUp = () => main();

speed.onclick = speedUp;

main();
