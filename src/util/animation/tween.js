import EASE from './ease';
import cubic from './cubic';

let linear = (x) => { return x; };
let step = (count, pos) => {
  return (x) => {
    if (x >= 1) {
      return 1;
    }
    let stepSize = 1 / count;
    x += pos * stepSize;
    return x - x % stepSize;
  };
};

const PRESETS = {
  'linear': linear,
  'ease': cubic(0.25, 0.1, 0.25, 1),
  'ease-in': cubic(0.42, 0, 1, 1),
  'ease-out': cubic(0, 0, 0.58, 1),
  'ease-in-out': cubic(0.42, 0, 0.58, 1),
  'step-start': step(1, 1),
  'step-middle': step(1, 0.5),
  'step-end': step(1, 0)
};

const numberString = '\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*';
const cubicBezierRe = new RegExp('cubic-bezier\\(' + numberString + ',' + numberString + ',' + numberString + ',' + numberString + '\\)');
const stepRe = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/;

const DEFAULTS = {
  begin: 0,
  change: 1,
  easing: 'linear',
  duration: 500,
  direction: 'normal',
  from:0, //执行区间起点
  to:1, //执行区间终点
  calc: function () {},
  end: function () {},
  delay: 0,
  endDelay: 0,
  fill: "none",
  // iterationStart: 0,
  iterations: 1//Infinity
};

export default class Tween{
  constructor(options){
    this.options = Object.assign({}, DEFAULTS, options);
    //曲线函数
    this.easing = EASE[this.options.easing] || PRESETS[this.options.easing];
    //当前进度
    this._process = this.options.from;
    this.count = 0;
    this.status = 'idle';
    this.playTimer = null;
    this.direction = this.options.direction;
    if (!this.easing) {
      let cubicData = cubicBezierRe.exec(this.options.easing), stepData = stepRe.exec(this.options.easing);
      if (cubicData) {
        this.easing = cubic.apply(this, cubicData.slice(1).map(Number));
      }else if (stepData) {
        this.easing = step(Number(stepData[1]), {'start': 1, 'middle': 0.5, 'end': 0}[stepData[2]]);
      }else{
        this.easing = linear;
      }
    }
  }

  val(percent){
    let delta = this.easing(percent);
    return this.options.begin + this.options.change * delta;
  }

  pend(cb, delay){
      this.status = 'pending';
      let st = null;
      let pendStep = (timestamp) => {
        if (st === null) st = timestamp;
        if (timestamp - st < delay) {
          this.playTimer = requestAnimationFrame(pendStep);
        }else{
          cb();
        }
      };
      this.playTimer = requestAnimationFrame(pendStep);
  }

  play(direction, from, to){
    direction = direction === undefined ? this.options.direction : direction;
    from = from === undefined ? this.process : from;
    to = to === undefined ? this.options.to : to;
    console.log(from, to)
    if (direction == 'reverse') {
      from = 1 - to;
      to = 1- from;
    }
    console.log(from, to)
    let start = null;
    let end = null;

    /**
     * 播放
     * @return {[type]} [description]
     */
    let play = () => {
      this.status = 'running';
      this.playTimer = requestAnimationFrame(step);
    };

    /**
     * 播放步骤
     * @param  {[type]} timestamp [description]
     * @return {[type]}           [description]
     */
    let step = (timestamp) => {
      if (start === null) {
        start = timestamp - from * this.options.duration;
        end = timestamp + to * this.options.duration;
      }
      let passedTime;
      passedTime = timestamp - start;
        this.process = Math.min(passedTime / this.options.duration, to);

        if (this.process !== to) {
          this.playTimer = requestAnimationFrame(step);
        }else{
          this.count++;
          if (this.count >= this.options.iterations) {
            this.finish();
          }else{
            start = null;
            end = null;
            this.process = 0;
            play(direction);
          }
        }
    };

    if (this.status === 'idle') { //如果当前资源状态为空闲
      this.pend(play, this.options.delay);
    }else if(this.status === 'running' && this.direction != direction){
      this.direction = direction;
      cancelAnimationFrame(this.playTimer);
      play(this.direction);
    }else if(this.status !== 'running'){ //如果当前不是运行状态
      play(direction);
    }
    return this;
  }
  pause(){
    cancelAnimationFrame(this.playTimer);
    this.playTimer = null;
    this.status = 'paused';
    return this;
  }
  finish(){
    cancelAnimationFrame(this.playTimer);
    this.process = this.options.to;
    if (this.process == 1) {
      this.pend(() => {
        this.status = 'finished';
        let val = this.val(this._process);
        this.options.end(val);
      }, this.options.endDelay);
    }
  }
  cancel(){
    cancelAnimationFrame(this.playTimer);
    this.process = this.options.from;
    this.status = 'idle';
    this.count = 0;
  }
  reverse(){
    this.play('reverse');
  }

  set process(process){
    let _process = Math.max(Math.min(process, 1), 0);
    if (_process != this._process) {
      this._process = Math.max(Math.min(process, 1), 0);
      let val = this.val(this._process);
      this.options.calc(val);
    }
  }

  get process(){
    return this._process;
  }
}
