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

    this.animation.on('running', function(){
    	console.log(arguments);
    });
  }
  play(){}

  auto(){
	this.animation.play();
  }
}

export default {
  Panel, panel(...args){
    return new Panel(...args);
  }
};
