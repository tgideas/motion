const emitter = new WeakMap();

export default class EventEmitter {
  constructor() {
    emitter.set(this, {
      events : {}
    });
    this.eventLength = 0;
  }
  /**
   * add custom event for component
   * @param  {String}   event    event name
   * @param  {Function} callback event handler
   * @return {Object}            current object
   */
  on(event, callback){
    if(typeof callback === 'undefined'){
      throw new Error('You must provide a callback method.');
    }
    if(typeof callback !== 'function'){
      throw new Error('Listener must be a function');
    }

    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);

    this.eventLength++;
    return this;
  }

  /**
   * remove custom event for component
   * @param  {String}   event    event name
   * @param  {Function} callback event handler
   * @return {Object}            current object
   */
  off(event, callback){

    if(typeof this.events[event] === 'undefined'){
      throw new Error(`Event not found : ${event}`);
    }

    const listeners = this.events[event];
    const removeAll = function(){
      delete this.events[event];
      this.eventLength--;
    }.bind(this);

    if(typeof callback === 'function'){ //set an
      listeners.forEach((v, i) => {
        if(v === callback){
          listeners.splice(i, 1);
        }
      });
      if(listeners.length === 0){
        removeAll();
      }
    }else{
      removeAll();
    }

    return this;
  }

  /**
   * Trigger custom event for component
   * @param  {String} event   event name
   * @param  {[type]} ...args [description]
   * @return {Object}         current object
   */
  trigger(event, ...args){
    if(typeof event === 'undefined'){
      throw new Error('You must provide an event to trigger');
    }

    let listeners = this.events[event];

    if(typeof listeners !== 'undefined'){
      listeners = listeners.slice(0);
      listeners.forEach((v)=>{
        v.apply(this, args);
      });
    }

    return this;
  }

  get events(){
    return emitter.get(this).events;
  }
}
