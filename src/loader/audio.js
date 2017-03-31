import ajax from './ajax';
export default (url) => {
	return new Promise((resolve, reject) => {
		let sTime = new Date();
		let xhr = new XMLHttpRequest();
		let AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    ajax(url, {
      dataType : 'arraybuffer'
    }).then((data) => {
      context.decodeAudioData(
          data.data,
          function(buffer) {
            if (!buffer) {
              reject({
                url: url,
                time : new Date() - sTime,
                status : 'error',
                context : context
              });
            }else{
              // source.buffer = buffer;
              // source.connect(context.destination);
              resolve({
                url: url,
                time : new Date() - sTime,
                status : 'success',
                buffer : buffer,
                context : context
              });
            }
        }
      );
    }, (data) => {
      reject({
        url: url,
        time : new Date() - sTime,
        status : 'error',
        context : context
      });
    });
	});
};