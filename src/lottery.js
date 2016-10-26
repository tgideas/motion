import Base from './core/base';
import imageLoader from './loader/image';
import tween from './util/animation/tween';

const DEFAULTS = {
  container : 'lottery',
  background : '',
  startBtn : '',
  prize : 8,
  width : '',
  height : ''
}

class Lottery extends Base{
  constructor(options) {
    super();
    this.options = Object.assign({}, DEFAULTS, options);
    if (!(this.options.container && this.options.background && this.options.startBtn)) {
      throw '[Lottery]缺少必要的参数：container|background|startBtn';
    }
    if (/^\w/.test(this.options.container)) {
      this.container = document.getElementById(this.options.container);
    } else {
      this.container = document.querySelector(this.options.container);
    }
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    imageLoader(this.options.background).then((data) => {
      console.log(data)
      this.background = data.dom;
      this.width = this.options.width || this.background.width;
      this.height = this.options.height || this.background.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.scale = this.width / this.background.width
      if (this.startBtn) {
        this.draw(0);
      }
    }, function () {
      throw '[Lottery]奖品图片加载出错'
    })
    imageLoader(this.options.startBtn).then((data) => {
      this.startBtn = data.dom
      if (this.background) {
        this.draw(0);
      }
    }, function () {
      throw '[Lottery]按钮图片加载出错'
    })
  }
  draw(ang){
    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.translate(this.canvas.width/2, this.canvas.height/2);
    this.context.rotate(ang);
    this.context.translate(-this.canvas.width/2, -this.canvas.height/2);
    this.context.drawImage(this.background, 0, 0, this.background.width, this.background.height, 0, 0, this.width, this.height);
    this.context.restore();
  }
  start(){}
  stop(index){
    console.log((3 + Math.round(Math.random() * 6)) * 360 - 360 / this.options.prize)
    tween({
      begin: 0,
      change: (3 + Math.round(Math.random() * 6)) * 360 - 360 / this.options.prize,
      ease: 'easeFromTo',
      duration: 10000,
      calc: (val) => {
        this.draw(Math.PI / 180 * val)
      },
      end: () => {
        // alert('恭喜中奖')
      }
    })
  }
}

export default {
  Lottery, lottery(...args){
    return new Lottery(...args);
  }
}
