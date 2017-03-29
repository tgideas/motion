import Base from './core/base';

class Film extends Base{
  constructor(...args) {
    super(...args);
  }
  play(){}
  pause(){}
}

export default {
  Film, film(...args){
    return new Film(...args);
  }
};
