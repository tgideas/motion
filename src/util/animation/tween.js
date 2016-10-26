import EASE from './ease';

console.log('asdfasdf')
const DEFAULTS = {
  begin: 0,
  change: 1,
  ease: 'linear',
  duration: 500,
  calc: function () {},
  end: function () {}
}

export default function (options) {
  let {begin, change, ease, duration, calc, end} = Object.assign({}, DEFAULTS, options);
  // if set a invalide ease then set ease
  if (!EASE[ease]) ease = 'linear';

  let endVal = begin + change;
  let startTime = null;

  function step(timestamp){
    if (startTime === null) startTime = timestamp;
    let passedTime = timestamp - startTime;
    console.log(passedTime / duration, ease)
    let delta = EASE[ease](passedTime / duration);
    console.log(change)
    calc(Math.round(begin + delta * change));
    if (passedTime >= duration) {
      end(endVal);
    } else {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);

}
