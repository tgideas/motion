import Base from './core/base';
import {loader} from "./loader";
const NOOP = function () {};
const DEFAULTS = {
  loop: true,
  volume:1
};
const STATUS = {
	LOADING: 'loading',
	SUCCESS: 'success',
	PLAYING: 'playing',
	PAUSED: 'paused',
	STOPED: 'stoped',
	ENDED: 'ended',
	ERROR: 'error',
};
class Audio extends Base{
	constructor(url, options) {
		super();
		this.options = Object.assign({}, DEFAULTS, options);
		this.status = STATUS.LOADING;
		this.trigger('loading');
		this.pauseAt = 0;
		this.beginTime = 0;
		loader(url, (data) => {
		}).on('success', (data) => {
			this.status = data.status;
			this.buffer = data.buffer;
			this.context = data.context;
			this.trigger(this.status, data);
		}).on('error', (data) => {
			this.status = STATUS.ERROR;
			this.trigger(this.status);
		});
	}

	checkStatus(){
		switch (this.status) {
			case STATUS.SUCCESS:
				console.info('音频文件加载完成');
				break;
			case STATUS.PLAYING:
				console.info('正在播放');
				break;
			case STATUS.PAUSED:
				console.info('已暂停');
				break;
			case STATUS.STOPED:
				console.info('已停止');
				break;
			case STATUS.ERROR:
				console.error('音频文件地址不存在或格式有误');
				break;
			default:
				console.info('文件正在加载...');

		}
		return this.status;
	}

	play(time){
		if (this.status != STATUS.PLAYING && this.checkStatus() != STATUS.ERROR) {
			this.status = STATUS.PLAYING;
			this.pauseAt = time || this.pauseAt;
			this.beginTime = Date.now() - this.pauseAt;
			this.source = this.context.createBufferSource();
			this.gainNode = this.context.createGain();
			this.analyser = this.context.createAnalyser();
			this.analyser.minDecibels = -90;
			this.analyser.maxDecibels = -10;
			this.analyser.smoothingTimeConstant = 0.85;
			this.source.connect(this.analyser);
			this.analyser.connect(this.gainNode);
			this.gainNode.connect(this.context.destination);
			this.source.loop = this.options.loop;
			this.source.buffer = this.buffer;
			this.setVolume(this.options.volume);
			this.source.start(0, this.pauseAt/1000);
			this.pauseAt = 0;

			this.analyser.fftSize = 128;
			let bufferLength = this.analyser.frequencyBinCount;
    		let dataArray = new Uint8Array(bufferLength);
			let playing = () => {
				this.analyser.getByteFrequencyData(dataArray);
				this.trigger('playing', this.context.currentTime, this.source.buffer.duration, bufferLength, dataArray);
				if (this.context.currentTime<this.source.buffer.duration) {
					this.playTimer = requestAnimationFrame(playing);
				}else{
					if (!this.options.loop) {
						this.status = STATUS.ENDED;
						this.trigger('end', this.context.currentTime, this.source.buffer.duration, bufferLength, dataArray);
					}
				}
			};
			this.playTimer = requestAnimationFrame(playing);
		}
		return this;
	}

	pause(time){
		cancelAnimationFrame(this.playTimer);
		this.playTimer = null;
		this.pauseAt = time || (Date.now() - this.beginTime);
		this.status = STATUS.PAUSED;
		this.source.stop(0);
		this.trigger('pause');
		return this;
	}

	stop(){
		this.pause();
		this.status = STATUS.STOPED;
		this.pauseAt = 0;
		this.trigger('stop');
		return this;
	}

	setVolume(value){
		this.gainNode.gain.value = value;
		this.trigger('setvolume', value);
		return this;
	}

	mute(){
		this.gainNode.gain.value = 0;
		this.trigger('mute');
		return this;
	}
}
export default {
  Audio, audio(...args){
    return new Audio(...args);
  }
};