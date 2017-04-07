import Base from './core/base';
import Keyframe from './util/animation/keyframe';
import Timing from './util/animation/timing';

class Animation extends Base{
	constructor(dom, keyframes, timing) {
		super();
		if (typeof timing === 'number') {
			timing = {
				duration : timing,
			};
		}
		this.timing = Timing.format(timing);
		this.keyframes = Keyframe.format(keyframes);
		console.log(Keyframe.format(keyframes), this.keyframes);
		this._currentTime = null;
		this._playTimer = null;
		this._startTime = null;
		if (dom.animate) { // if support web animate
			this.animation = dom.animate(this.keyframes, this.timing);
			this.animation.cancel();
		}

	}

	play(){
		if (this.animation) {
			this.animation.play();
		}else{

			this._playTimer = requestAnimationFrame();
		}
		return this;
	}
	pause(){
		if (this.animation) {
			this.animation.pause();
		}
		return this;
	}
	finish(){
		if (this.animation) {
			this.animation.finish();
		}
		return this;
	}
	cancel(){
		if (this.animation) {
			this.animation.cancel();
		}
		return this;
	}
	reverse(){
		if (this.animation) {
			this.animation.reverse();
		}
		return this;
	}

	test(...args){
		console.log(Timing.calc(...args));
	}

	get currentTime(){
		if (this.animation) {
			this._currentTime = this.animation.currentTime;
		}
		return this._currentTime;
	}
	set currentTime(time){
		this._currentTime = time;
		if (this.animation) {
			this.animation.currentTime = this._currentTime;
		}else{

		}
	}
}
export default {
  Animation, animate(...args){
    return new Animation(...args);
  }
};