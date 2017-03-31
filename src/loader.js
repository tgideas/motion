import Base from './core/base';
import jsLoader from './loader/javascript';
import imgLoader from './loader/image';
import cssLoader from './loader/css';
import audioLoader from './loader/audio';
import videoLoader from './loader/video';
import getType from './util/url/type';
import './util/polyfill/promise.always';
import './util/polyfill/object.assign';

const NOOP = function () {};


const DEFAULTS = {
  resource : [],
  autoStart : true,
  type : 0,
  minTime : 0,
  attr : 'preload',
  success : NOOP,
  error : NOOP,
  complete : NOOP
};

const STATUS = {
  READY : 0,
  LOADING : 1,
  SUCCESS : 2,
  ERROR : 3
};

const LOADER = {
  JAVASCRIPT : jsLoader,
  IMAGE : imgLoader,
  CSS : cssLoader,
  AUDIO : audioLoader,
  VIDEO : videoLoader
};

class Loader extends Base{
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
        };
      }else{
        options.resource = (options.resource || []).concat(resource);
      }
    }else{
      options = resource;
    }

    this.options = Object.assign({}, DEFAULTS, options);

    //format resouce;
    this.options.resource.forEach((v, i) => {
      this.options.resource[i] = {
        url : v,
        status : STATUS.READY
      };
    });

    if(this.options.autoStart === true){
      this.start();
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
    let count = 0;
    let totalLen = this.options.resource.length;
    let start = Date.now();

    let load = (v) => {
      if(v.status === STATUS.READY){
        let curStart = Date.now();
        let type = getType(v.url).toUpperCase();
        if (['MP3'].indexOf('type') > -1) {
          type = 'AUDIO';
        }else if(['MP4'].indexOf('type') > -1){
          type = 'VIDEO';
        }
        v.status = STATUS.LOADING;
        let loader = LOADER[type];
        loader(v.url).then((data) => {
          return data;
        }, (data) => {
          return data;
        }).always((data) => {
          let end = Date.now();
          let dif = end - curStart;
          let done = () => {
            ++count;
            this.options[data.status](data, count, totalLen);
            this.trigger(data.status, data, count, totalLen);
            if (count >= totalLen) {
              let durTime = Date.now() - start;
              this.options.complete.call(this, durTime);
              this.trigger('complete', durTime);
            }
          };
          dif < this.options.minTime ? setTimeout(done, this.options.minTime - dif) : done();
        });
      }
    };
    if (this.options.type === 1) {
      this.on('success', (data, count, totalLen) => {
        count < totalLen && load(this.options.resource[count]);
      });
      totalLen && load(this.options.resource[count]);
    } else {
      this.options.resource.forEach((v, i)=>{
        load(v);
      });
    }
  }
}

export default {
  Loader, loader(...args){
    return new Loader(...args);
  }
};
