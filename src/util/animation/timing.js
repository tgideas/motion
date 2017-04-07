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
	delay : 0,
	direction : 'normal',
	duration : 0,
	easing : 'linear', //linear, ease, ease-in, ease-out, and ease-in-out
	endDelay : 0,
	fill : 'none', //none forwards backwards both
	iterationStart : 0,
	iterations : 1 // Infinity
};
const Timing = {
	format(timings){
		if (typeof timings == 'number') {
			timings = {
				duration: timings
			};
		}
		timings = Object.assign({}, DEFAULTS, timings);
		return timings;
	},
	parseEase(ease){
		if (PRESETS[ease]) {
			return PRESETS[ease];
		}else{
			let cubicData = cubicBezierRe.exec(ease);
		    if (cubicData) {
		      return cubic.apply(this, cubicData.slice(1).map(Number));
		    }
		    let stepData = stepRe.exec(ease);
		    if (stepData) {
		      return step(Number(stepData[1]), {'start': 1, 'middle': 0.5, 'end': 0}[stepData[2]]);
		    }
		}
		return linear;
	},
	/**
	 * 计算值的变化情况
	 * @param  {[type]} steps     各阶段的值
	 * @param  {[type]} ease      动画类型
	 * @param  {[type]} spendTime 执行动画已花时间
	 * @param  {[type]} durTime   动画持续时间
	 * @return {[type]}           当前的值
	 */
	calc(steps, ease, spendTime, durTime){
		let stepToChange = [0];//每步变化值
		let stages = [0]; //记录每步的变化总值
		let totalChange = 0; //值的变化总量
		let easeFunc = Timing.parseEase(ease);
		let result = steps[0];
		for (var i = 1; i < steps.length; i++) {
			let changeValue = steps[i] - steps[i-1];
			totalChange += Math.abs(changeValue);
			stepToChange.push(changeValue);
			stages.push(totalChange);
		}
		let hasChanged = totalChange * easeFunc(spendTime / durTime);
		console.log(easeFunc(spendTime / durTime),'...',totalChange, hasChanged);
		for (var j = 0; j < stages.length; j++) {
			if (stages[j] >= hasChanged) {
				result += stepToChange[j] > 0 ? (hasChanged - stages[j - 1]) : (stages[j-1] - hasChanged);
				break;
			}else{
				result += stepToChange[j];
			}
		}
		return result;
	}
	// var ani = Motion.animate($0, [{
// 'left' : '50px',
// 'offset' : 0
// },{
// 'left' : '150px',
// 'offset' : .5
// },{left:'140px', offset:1}],{easing:'linear', duration:1000, fill:'both'})
};
export default Timing;