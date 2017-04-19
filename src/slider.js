import Tab from './tab';


const DEFAULTS = {
	target: 'body',
	direction: 'x'
};
class Slider extends Tab{
  constructor(target, options) {
    super(target, options);
  }
  start(){}
  stop(){}
}

export default {
    Slider, slider(...args){
      return new Slider(...args);
    }
};
