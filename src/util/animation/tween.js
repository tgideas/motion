import Cursor from './cursor';

const DEFAULTS = {
	begin:0,
	change:1,
	easing: 'linear',
	duration: 1000,
	direction: 'normal',
	delay:0,
	endDelay:0, 
	fill:'both',
	iterations:1,
	iterationStart:0,
	calc: function(){},
	end: function(){}
};

let privateObj = new WeakMap();
export default class Tween extends Cursor{
	constructor(options){
		let opts = Object.assign({}, DEFAULTS, options);
		super(opts);

		this.options = opts;

		this.timer = null;
		this.direction = this.options.direction;
		this.playState = 'idle';

		privateObj.set(this, {
			_startTimestamp: null,
			_currentTime: 0, //当前播放的时间
			_totalTime: this.options.delay + this.options.duration * this.options.iterations + this.options.endDelay //动画整体运算时间
		});

	}
	play(){
		let start = privateObj.get(this)._startTimestamp;
		console.log('start', start);
		let step = (timestamp) => {
			console.log(start);
			if (start === null) privateObj.get(this)._startTimestamp = start = timestamp - this.currentTime;
			this.timer = requestAnimationFrame(step);
			console.log(timestamp - start);
			this.currentTime = timestamp - start;
		};
		if (!this.timer) { //如果当前状态是空闲的
			privateObj.get(this)._startTimestamp = start = null;
			this.currentTime = this.currentTime;
			this.timer = requestAnimationFrame(step);
		}
		return this;
	}
	pause(){
		cancelAnimationFrame(this.timer);
		this.timer = null;
		this.playState = 'paused';
		return this;
	}
	finish(){
		this.currentTime = privateObj.get(this)._totalTime;
		return this;
	}
	cancel(){
		this.pause();
		privateObj.get(this)._startTimestamp = null;
		this.currentTime = 0;
		this.playState = 'idle';
		return this;
	}
	reverse(){
		this.currentTime = privateObj.get(this)._totalTime - privateObj.get(this)._currentTime;
		this.direction = this.direction === 'reverse' ? 'normal' : 'reverse';
		return this;
	}

	get currentTime(){
		return privateObj.get(this)._currentTime;
	}
	set currentTime(time){
		privateObj.get(this)._currentTime = time;
		// console.log(time < this.options.delay,time <= privateObj.get(this)._totalTime - this.options.endDelay,time < privateObj.get(this)._totalTime)
		if (time < this.options.delay) { //尚在等待中
			if (this.playState != 'pending') {
				this.process = this.direction === 'reverse' ? 0 : 1;
			}
			this.playState = 'pending';
		}else if(time < privateObj.get(this)._totalTime - this.options.endDelay){ //动画在运行中
			this.playState = 'running';
			if (this.direction === 'reverse') {
				time = privateObj.get(this)._totalTime - (this.options.endDelay - this.options.delay) - time;
			}
			this.process = (time - this.options.delay) % this.options.duration / this.options.duration;
			// console.log(this.process);
		}else if(time < privateObj.get(this)._totalTime){
			if (this.playState != 'pending') {
				this.process = this.direction === 'reverse' ? 0 : 1;
			}
			this.playState = 'pending';
		}else{
			if (this.playState != 'finished') {
				this.process = this.direction === 'reverse' ? 0 : 1;
			}
			this.options.end.call(this);
			this.pause();
			this.playState = 'finished';
		}
	}

	get process(){
		return this.currentTime % this.options.duration / this.options.duration;
	}
	set process(process){
		process = Math.max(Math.min(process, 1), 0);
		let value = this.getValue(process + this.options.iterationStart);
		this.options.calc.call(this, value, process, this.currentTime);
	}
}