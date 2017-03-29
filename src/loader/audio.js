export default (url) => {
	return new Promise((resolve, reject) => {
		let sTime = new Date();
		let xhr = new XMLHttpRequest();
		let AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    let source = context.createBufferSource();
		xhr.open("GET", url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = () => {
			context.decodeAudioData(
          xhr.response,
          function(buffer) {
            if (!buffer) {
              reject({
              	url: url,
              	time : new Date() - sTime,
          			status : 'error',
          			context : context
              });
            }else{
              source.buffer = buffer;
              source.connect(context.destination);
              resolve({
              	url: url,
              	time : new Date() - sTime,
          			status : 'success',
          			source : source,
          			context : context
              });
            }
        }
      );
		};
		xhr.onerror = () => {
			reject({
        url: url,
        time : new Date() - sTime,
        status : 'error',
        context : context
      });
		};
		xhr.send();
	});
};