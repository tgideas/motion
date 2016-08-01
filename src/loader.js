import Base from './core/base';

const EMPTYFUNC = function () {};

const OPS = {
  resource : [],
  loading : EMPTYFUNC,
  complete : EMPTYFUNC,
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
  }

  start(){}
  stop(){}
}
