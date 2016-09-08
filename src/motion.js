import Film from './film';
import Lazyload from './lazyload';
import Loader from './loader';
import Lottery from './lottery';
import Slider from './slider';

export default {
  Film,film(...args){
    return new Film(...args);
  },
  Lazyload,lazyload(...args){
    return new Lazyload(...args);
  },
  Loader,loader(...args){
    return new Loader(...args);
  },
  Lottery,lottery(...args){
    return new Lottery(...args);
  },
  Slider,slider(...args){
    return new Slider(...args);
  }
}
