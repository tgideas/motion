import Slider from './slider';


const DEFAULTS = {
	target: 'body',
  activeClass: 'current',
  effect:'none',
  panel:null
};
class Tab extends Slider{
  constructor(target, options) {
    super(target, options);

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
