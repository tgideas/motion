import Base from './core/base';
import jsLoader from './loader/javascript';
import getType from './util/url/type';

const NOOP = function () {};

const OPS = {
  resource : [],
  autoStart : true,
  success : NOOP,
  error : NOOP,
  complete : NOOP,
  type : 0,
  minTime : 0,
  attr : 'preload'
}

const STATUS = {
  READY : 0,
  LOADING : 1,
  SUCCESS : 2,
  ERROR : 3
}

const LOADER = {
  JAVASCRIPT : jsLoader,
  // IMAGE : imgLoader,
  // CSS : cssLoader
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

    console.log(options,'.....',OPS);

    this.options = Object.assign({}, OPS, options);

    //format resouce;
    this.options.resource.forEach((v, i) => {
      this.options.resource[i] = {
        url : v,
        status : STATUS.READY
      }
    });

    console.log(this.options);

    if(this.options.autoStart === true){
      this.start()
    }

  }
  /**
   * add resoure to load quene
   * @param {[type]} res [description]
   */
  add(res){
    this.options.resource.push({
      url : res,
      status : STATUS.READY
    });
    return this;
  }

  /**
   * remove resoure from load quene
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  remove(res){
    this.options.resource = this.options.resource.filter((v, i) => {
      return v.url !== res;
    });
    return this;
  }

  /**
   * start load resource
   * @return {[type]} [description]
   */
  start(){
    this.options.resource.forEach((v, i)=>{
      if(v.status === STATUS.READY){
        let type = getType(v.url).toUpperCase();
        v.status = STATUS.LOADING;
        let loader = LOADER[type];
        loader(v.url).then((data) => {
          this.options.success(data);
        }, (data) => {
          this.options.error(data);
        })
      }
    });
  }
}
