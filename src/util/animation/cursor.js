import ease from './ease';
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
  easing: 'linear'
};

/**
 * 
 */
export default class Cursor{
  constructor(options){
    this.options = Object.assign({}, DEFAULTS, options);
    this.easing = ease[this.options.easing] || PRESETS[this.options.easing];
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

  getValue(process){
    if (process > 1) {
      process = process - 1;
    }
    return this.options.begin + this.options.change * this.easing(process);
  }

  pointerValue(process, from, to){
    let fromvalue = from.value;
    let tovalue = to.value;
    let fromease = this.easing(from.offset);
    let toease = this.easing(to.offset);
    let changevalue = (tovalue - fromvalue) / (toease - fromease);
    let diffvalue = fromvalue - changevalue * this.easing(from.offset);
    return changevalue * this.easing(process) + diffvalue;
  }

} 