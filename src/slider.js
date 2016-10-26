import Base from './core/base';

class Slider extends Base{
  constructor(...args) {
    super(...args);
  }
  start(){}
  stop(){}
}

export default {
    Slider, slider(...args){
      return new Slider(...args);
    }
}
