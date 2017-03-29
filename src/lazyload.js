import Base from './core/base';

class Lazyload extends Base{
  constructor(...args) {
    super(...args);
  }
  start(){}
  stop(){}
}

export default {
  Lazyload, lazyload(...args){
    return new Lazyload(...args);
  }
};
