
const DEFAULTS = {
	delay : 0,
	direction : 'normal', //normal reverse alternate alternate-reverse
	duration : 1000,
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
	}
};
export default Timing;