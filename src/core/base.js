import EventEmitter from './eventEmitter';
export default class Base extends EventEmitter{
  constructor() {
    super();
  }
  static addPlugins() {
    console.log('add plugin');
  }
}
