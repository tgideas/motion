import Base from './core/base';


const DEFAULTS = {
	target: 'body',
  activeClass: 'current',
  panel:null
};
class Tab extends Base{
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


  }
  
  active(index){

  }

  disable(index){

  }

  enable(index){

  }
}

export default {
    Tab, tab(...args){
      return new Slider(...args);
    }
};
