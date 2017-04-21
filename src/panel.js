import Base from './core/base';
import {animate} from './animation';

const EFFECTS = {
	fadeOut : [{opacity:1},{opacity:0}],
	fadeIn: [{opacity:0},{opacity:1}],
	flipX:[{transform: 'rotateX(0deg)'}, {transform: 'rotateX(-180deg)'}],
	flipY:[{transform: 'rotate3d(10, 12, -18, 180deg)'}, {transform: 'rotate3d(1, 2, -1, 0deg)'}]
};

const DEFAULTS = {
	effect : 'fadeOut'
};

class Panel extends Base{
  constructor(dom, options) {
    super(dom, options);
    this.options = Object.assign({}, DEFAULTS, options);
    this.el = dom;
    let keyframes = EFFECTS[this.options.effect] || this.options.effect;
    this.animation = animate(this.el, keyframes);

    this.animation.on('running', (v, p, t) => {
    	this.trigger('running', v, p, t);
    });
  }
  progress(p){
  	this.animation.currentTime = p * 1000;
  	return this;
  }

  show(){
  	if (this.animation.currentTime == 500) {
		return this;
	}
  	if (this.animation.direction == 'reverse') {
  		this.animation.reverse();
  	}
  	if (this.animation.currentTime > 500) { //超过了一半 需要往回播放
  		this.animation.reverse();
  	}

  	let running = (v, p, t) =>{
  		console.log(t, 't');
		if (t >= 500) {
			this.animation.pause().off('running', running);
			this.animation.currentTime = 500;
		}
	};

  	this.animation.on('running', running).play();
  	return this;
  }

  hide(){

  	if (this.animation.currentTime === 0 || this.animation.currentTime === 1000) {
  		return this;
  	}

  	if (this.animation.direction === 'reverse') {
  		this.animation.reverse();
  	}

  	if (this.animation.currentTime < 500) {
  		this.animation.reverse();
  	}
  	this.animation.play();
  	return this;
  }
}

export default {
  Panel, panel(...args){
    return new Panel(...args);
  }
};
