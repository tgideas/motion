import createNode from "../util/dom/createNode";
export default (url) => {
	return new Promise((resolve, reject) => {
		let sTime = new Date();
		let xhr = new XMLHttpRequest();
	    let dom = createNode('video');
		xhr.open("GET", url, true);
		xhr.responseType = 'blob';
		xhr.onload = () => {
			var blob_uri = URL.createObjectURL(xhr.response);
			dom.src = blob_uri;
			dom.addEventListener('canplaythrough', function(){
				resolve({
					url: url,
			        time : new Date() - sTime,
			        status : 'success',
			        dom : dom
				});
			});
		};
		xhr.onerror = () => {
			reject({
		        url: url,
		        time : new Date() - sTime,
		        status : 'error',
		        dom : dom
		      });
		};
		xhr.send();
	});
};