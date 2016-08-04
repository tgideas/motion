import Base from './core/base';
import jsLoader from './loader/javascript';

const NOOP = function () {};

const OPS = {
  resource : [],
  loading : NOOP,
  complete : NOOP,
  type : 0,
  minTime : 0,
  attr : 'preload'
}

export default class Loader extends Base{
  constructor(resource, options) {
    super();
    if(typeof resource == 'string'){
      resource = [].concat(resource);
    }
    if(Array.isArray(resource)){
      if(typeof options === 'function'){
        var tempFunc = options;
        options = {
          complete : tempFunc,
          resource : resource
        }
      }else{
        options.resource = (options.resource || []).concat(resource);
      }
    }else{
      options = resource;
    }
    this.options = Object.assign({}, OPS, options);

    console.log(this.options);

    jsLoader('https://raw.githubusercontent.com/rgrove/lazyload/release-2.0.1/lazyload.js').then((...args) => {
        console.log(...args)
    }).catch((...args)=>{
        console.log(...args);
    })
  }
  start(){}
  stop(){}
}
