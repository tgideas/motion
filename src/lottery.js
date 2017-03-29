import Base from './core/base';
import imageLoader from './loader/image';
import tween from './util/animation/tween';
import './util/polyfill/object.assign';

const DEFAULTS = {
  container : 'lottery',
  background : '',
  startBtn : '',
  prize : [],
  index : 0,
  width : '',
  height : '',
  offset : 0,
  start : function () {},
  end : function () {}
};

class Lottery extends Base{
  constructor(options) {
    super();
    this.options = Object.assign({}, DEFAULTS, options);
    if (!(this.options.container && this.options.background && this.options.startBtn)) {
      throw '[Lottery]缺少必要的参数：container|background|startBtn';
    }
    if (this.options.prize.length === 0) {
      throw '[Lottery]未配置奖品信息：prize';
    }
    if (/^\w/.test(this.options.container)) {
      this.container = document.getElementById(this.options.container);
    } else {
      this.container = document.querySelector(this.options.container);
    }
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.index = this.options.index;
    this.angle = 360 - 360 / this.options.prize.length * this.index;
    this.isPlaying = false;

    let allLoaded = () => {
      this.scaledBtn = {
        width : this.startBtn.width * this.scale,
        height : this.startBtn.width * this.scale
      };
      this.draw(this.angle * Math.PI / 180);
    };

    imageLoader(this.options.background).then((data) => {
      this.background = data.dom;
      this.width = this.options.width || this.background.width;
      this.height = this.options.height || this.background.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.scale = this.width / this.background.width;
      if (this.startBtn) allLoaded();
    }, function () {
      throw '[Lottery]奖品图片加载出错';
    });
    imageLoader(this.options.startBtn).then((data) => {
      this.startBtn = data.dom;
      if (this.background) allLoaded();
    }, function () {
      throw '[Lottery]按钮图片加载出错';
    });
  }
  /**
   * draw image with rotate angle
   * @param  {Number} ang rotate angle
   * @return {[type]}     [description]
   */
  draw(ang){
    let context = this.context;
    context.save();
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.translate(this.canvas.width/2, this.canvas.height/2);
    context.rotate(ang);
    context.translate(-this.canvas.width/2, -this.canvas.height/2);
    context.drawImage(this.background, 0, 0, this.background.width, this.background.height, 0, 0, this.width, this.height);
    context.restore();
    context.drawImage(this.startBtn, 0, 0, this.startBtn.width, this.startBtn.height, (this.width - this.scaledBtn.width)/2, (this.height - this.scaledBtn.height)/2, this.scaledBtn.width, this.scaledBtn.height);
    return this;
  }
  start(){}
  stop(index){
    if (this.isPlaying) {
      return this;
    }
    this.isPlaying = true;
    let offsetValue = Math.round(this.options.offset * Math.random());
    offsetValue = Math.random() > 0.5 ? offsetValue : -offsetValue;
    tween({
      begin: this.angle,
      change: (8 + Math.round(Math.random() * 6)) * 360 - this.angle +  (360 - (360 / this.options.prize.length * index) + offsetValue),
      ease: 'easeOutQuint',
      duration: 10000,
      calc: (val) => {
        this.draw(val * Math.PI / 180) ;
      },
      end: (final) => {
        this.angle = final % 360;
        this.isPlaying = false;
        this.options.end(this.options.prize[this.index = index], index);
        this.trigger('end', this.options.prize[index], index);
      }
    });
    return this;
  }
}

export default {
  Lottery, lottery(...args){
    return new Lottery(...args);
  }
};
