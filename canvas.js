(function($) {
$(function() {
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      return window.setTimeout(callback, 1000 / 60);
    };
})();

var can;
var ctx;

var w;
var h;

var padLeft = 0;
var padTop = 0;

var canWidth = 1920;
var canHeight = 700;

var deltaTime;
var lastTime;

var cloudPic = new Image();
var starPic = new Image();
var logoPic = new Image();

var stars = [];
var num = 100;

var alive = 0;


function init() {
  can = document.getElementById("canvas");
  ctx = can.getContext("2d");

  w = can.width;
  h = can.height;

  document.addEventListener('mousemove', mousemove, false);

  starPic.src = "http://www.raccoon-tech.com/wp-content/uploads/2016/03/star.png";
  for (var i = 0; i < num; i++) {
    stars[i] = new starObj();
    stars[i].init();
  }

  lastTime = Date.now();
  gameLoop();
}

function gameLoop() {
  window.requestAnimFrame(gameLoop);
  var now = Date.now();
  deltaTime = now - lastTime;
  lastTime = now;

  fillCanvas();
  drawStars();
  aliveUpdate();
  drawPic();
}

function fillCanvas() {
  var my_gradient=ctx.createLinearGradient(0,0,0,700);
  my_gradient.addColorStop(0,"#23408E");
  my_gradient.addColorStop(0.5,"#274A91");
  my_gradient.addColorStop(1,"#376B9B");
  ctx.fillStyle=my_gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawPic() {


}

function mousemove(e) {
  if (e.offsetX || e.layerX) {

    // var px = e.offsetX == undefined ? e.layerX : e.offsetX;
    // var py = e.offsetY == undefined ? e.layerY : e.offsetY;

    // if (px > padLeft && px < (padLeft + canWidth) && py > padTop && py < (padTop + canHeight)) {
    //   switchy = true;
    // } else {
    //   switchy = false;
    // }
  }
}

var starObj = function() {
  this.x;
  this.y;

  this.w;
  this.h;

  this.k;
  this.b;
  this.s;

  this.Spd;
  this.picNo;
  this.timer;
  this.beta;
}
//重置
starObj.prototype.init = function() {
  this.x = Math.random() * canWidth;
  this.y = Math.random() * canHeight;

  this.s = Math.abs(this.x-960)/960*100;

  this.k=(this.y-524)/(this.x-960); //中心为(350,960)
  this.b=this.y-this.x*this.k;

  //初始速度
  // this.Spd = Math.random()*3+2; //[2,5)
  this.Spd = this.s*0.01+Math.random()*0.01;
  this.picNo = Math.floor(Math.random() * 7);
  this.timer = 0;

  this.beta = Math.random() * Math.PI * 0.5;
}

starObj.prototype.update = function() {
  
  this.Spd=this.Spd*1.02;
  this.w = this.Spd*0.7+7;
  this.h = this.Spd*0.7+7;


  //星星移动x
  if (this.x<960) {
    this.x = this.x - this.Spd;
  }else{
    this.x = this.x + this.Spd;
  };

  this.w = this.Spd*0.7+7;

  this.y = this.x*this.k+this.b;


  //重生
  if (this.x > (1910) || this.x < (10))
    this.init();
  else if (this.y > (690) || this.y < (10))
    this.init();
  //闪烁
  this.timer += deltaTime;
  if (this.timer > 130) {
    this.picNo += 1;
    this.picNo %= 7;
    this.timer = 0;
  }
}

starObj.prototype.draw = function() {
  ctx.save();
  //透明度
  ctx.globalAlpha = Math.sin(this.beta);
  ctx.drawImage(starPic, this.picNo * 7, 0, 7, 7, this.x, this.y, this.w, this.h);
  ctx.restore();
}

function drawStars() {
  for (var i = 0; i < num; i++) {
    stars[i].update();
    stars[i].draw();
  }
}

function aliveUpdate() {

}

init();

});
})(jQuery);