import Base from './core/base';
import Panel from './panel';


const DEFAULTS = {
	target: 'body',
	  activeClass: 'current',
	  panel: null,
	  effect:'none',
	  index:0,
	  autoplay:false,
	  loop:false,
	  control:false
};
class Slider extends Base{
  constructor(target, options) {
    super();
    if (arguments.length == 2) { //传递了两个参数
    	options.target = target;
    }else if(typeof target == 'object'){
    	options = target;
    }else{
    	options = {
    		'target': target
    	};
    }
    this.options = Object.assign({}, DEFAULTS, options);

    this.index = this.options.index;

    if (typeof this.options.target === 'string') {
      this.target = document.querySelector(this.options.target);
    }else{
      this.target = this.options.target;
    }

    if (this.options.panel) {
      this.panelList = this.target.querySelectorAll(this.options.panel);
    }else{
      this.panelList = this.target.children;
    }

    for (var i = 0; i < this.panelList.length; i++) {
      this.panelList[i] = new Panel(this.panelList[i], {
        effect : this.options.effect
      });
    }

    this._runHandler = (v, p, t) => {

    };
  }
  /**
   * 激活指定序号的panel
   * 
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  active(index){
  	this.panelList[this.index].off('running', this._runHandler);
  	this.panelList[index].show();
  	this.index = index;
  	this.panelList[this.index].on('running', this._runHandler);
  }

  next(){
  	this.active(this.index + 1);
  	return this;
  }

  prev(){
  	this.active(this.index - 1);
  }

}

export default {
    Slider, slider(...args){
      return new Slider(...args);
    }
};
