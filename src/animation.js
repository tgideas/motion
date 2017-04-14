	import Base from './core/base';
	import Keyframe from './util/animation/keyframe';
	import Timing from './util/animation/timing';
	import Tween from './util/animation/tween';

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
			this._currentTime = null;
			this._playTimer = null;
			this._startTime = null;

			this.status = 'idle';
			if (dom.animate) { // if support web animate
				this.animation = dom.animate(this.keyframes, this.timing);
				this.animation.cancel();
			}else{
				this.scopeTween = []; //每段的运行函数
				this.playTimes = 0;
				this.currentScopeTween = null;
				let from = null;
				let fromvalue = null;
				let tweenOption = Object.assign({}, this.timing);
				tweenOption.calc = (i) => {
					this.trigger('playing', i);
					let index = 0;
					dom.style.cssText = this.currentScopeTween.template.replace(/#num#/g, (item) => {
						let tovalue = this.currentScopeTween.tovalue[index];
						let fromvalue = this.currentScopeTween.fromvalue[index];
						let easefrom = this.currentScopeTween.tween.easing(this.currentScopeTween.from);
						let easeto = this.currentScopeTween.tween.easing(this.currentScopeTween.to);
						let changevalue = (tovalue - fromvalue) / (easeto - easefrom);
						let diffvalue = fromvalue - changevalue * this.currentScopeTween.tween.easing(this.currentScopeTween.from);
						let curvalue = changevalue * i + diffvalue;
						index++;
						return curvalue;
					});
				};
				for (var i = 0; i < this.keyframes.length; i++) {

					let tween = new Tween(tweenOption);
					let offset = this.keyframes[i].offset;

					let cssText = '';
					for(var k in this.keyframes[i]){
						if (['easing', 'offset', 'composite'].indexOf(k) >=0) {
							continue;
						}
						cssText += k.replace(/[A-Z]/g, function(item){
							return '-' + item.toLowerCase();
						});
						cssText += (':' + this.keyframes[i][k] + ';');
					}
					if (!fromvalue) { //如果没有fromvalue
						fromvalue = [];
						let template = cssText.replace(/[\-\d\.]+/g, function(item){
							fromvalue.push(item);
							return '#num#';
						});
						from = this.keyframes[i].offset;
						continue;
					}
					let tovalue = [];
					let template = cssText.replace(/[\-\d\.]+/g, function(item){
							tovalue.push(item - 0);
							return '#num#';
						});
					this.scopeTween.push({
						from : from, //开始时间
						fromvalue : fromvalue,
						to : offset, //结束时间
						tovalue : tovalue,
						template : template,
						tween : tween
					});
					fromvalue = tovalue;
					from = this.keyframes[i].offset;
				}

				let getScopeTween = (offset) =>{
					for (var i = 0; i < this.scopeTween.length; i++) {
						if(offset >= this.scopeTween[i].from && offset <= this.scopeTween[i].to){
							return this.scopeTween[i];
						}
					}
				};
				//时间轴上的动画
				this.tween = new Tween({
					duration: this.timing.duration,
					iterations : this.timing.iterations,
					delay:this.timing.delay,
					endDelay:this.timing.endDelay,
					calc : (i) => {
						this.currentScopeTween  = getScopeTween(i);
						this.currentScopeTween.tween.process = i;
					},
					end : ()=>{
						this.trigger('finish', i);
					}
				});
			}

		}

		play(){
			if (this.animation) {
				this.animation.play();
			}else{
				this.tween.play();
			}
			return this;
		}
		pause(){
			if (this.animation) {
				this.animation.pause();
			}else{
				this.tween.pause();
			}
			return this;
		}
		finish(){
			if (this.animation) {
				this.animation.finish();
			}else{
				this.tween.finish();
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
			}else{
				this.tween.reverse();
			}
			return this;
		}

		test(...args){
			console.log(Timing.calc(...args));
		}

		get currentTime(){
			if (this.animation) {
				this._currentTime = this.animation.currentTime;
			}else{
				this._currentTime = this.tween.currentTime;
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