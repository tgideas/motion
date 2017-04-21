	import Base from './core/base';
	import Keyframe from './util/animation/keyframe';
	import Timing from './util/animation/timing';
	import Tween from './util/animation/tween';

	class Animation extends Base{
		constructor(dom, keyframes={}, timing={}) {
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

			dom.animate = null;
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
				let animateObj = this;
				tweenOption.calc = function(v, p, t) {
					let index = 0;
					p += tweenOption.iterationStart;
					dom.style.cssText = animateObj.currentScopeTween.template.replace(/#num#/g, (item) => {
						let curvalue = this.pointerValue(p, {
							value : animateObj.currentScopeTween.fromvalue[index],
							offset : animateObj.currentScopeTween.from
						}, {
							value : animateObj.currentScopeTween.tovalue[index],
							offset : animateObj.currentScopeTween.to
						});
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
				this.animation = new Tween({
					duration: this.timing.duration,
					iterations : this.timing.iterations,
					iterationStart : this.timing.iterationStart,
					delay:this.timing.delay,
					endDelay:this.timing.endDelay,
					direction:this.timing.direction,
					calc : function(v, p, t) { //时间轴
						animateObj.currentScopeTween  = getScopeTween(p);
						animateObj.currentScopeTween.tween.currentTime = t;
						animateObj.trigger('running', v, p, t);
					},
					end : function(){
						animateObj.trigger('finish', i);
					}
				});
			}
			this.currentTime = 0;
		}

		play(){
			this.animation.play();
			return this;
		}
		pause(){
			this.animation.pause();
			return this;
		}
		finish(){
			this.animation.finish();
			return this;
		}
		cancel(){
			this.animation.cancel();
			this.trigger('cancel', this);
			return this;
		}
		reverse(){
			this.animation.reverse();
			if (this.scopeTween) {
				for (var i = 0; i < this.scopeTween.length; i++) {
					this.scopeTween[i].tween.reverse();
				}
			}
			return this;
		}

		get currentTime(){
			this._currentTime = this.animation.currentTime;
			return this._currentTime;
		}
		set currentTime(time){
			this._currentTime = time;
			this.animation.currentTime = this._currentTime;
		}

		get playState(){
			return this.animation.playState;
		}

		get direction(){
			return this.animation.direction;
		}
	}
	export default {
	  Animation, animate(...args){
	    return new Animation(...args);
	  }
	};