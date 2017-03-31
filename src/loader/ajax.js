const DEFAULTS = {
	dataType : 'text',
	method : 'get',
	success : function(){},
	error : function(){},
	header : {}
};
export default (url, options) => {
	options = Object.assign({}, DEFAULTS, options);
	return new Promise((resolve, reject) => {
		let sTime = new Date();
		let xhr = new XMLHttpRequest();
		xhr.open(options.method.toUpperCase(), url, true);
		xhr.responseType = options.dataType;
		xhr.onreadystatechange = () => {
			if(xhr.readyState === XMLHttpRequest.DONE){
				if (xhr.status === 200) {
					let ret = {
						url: url,
						time : new Date() - sTime,
						status : 'success',
						data : xhr.response
					};
					options.success.call(xhr, ret);
					resolve(ret);
				}else{
					let ret = {
						url: url,
						time : new Date() - sTime,
						status : 'error',
						data : null
					};
					options.error.call(xhr, ret);
					reject(ret);
				}
			}
		};

		xhr.onerror = () => {
			let ret = {
				url: url,
				time : new Date() - sTime,
				status : 'error',
				data : null
			};
			options.error.call(xhr, ret);
			reject(ret);
		};

		for (var k in options.header){
			xhr.setRequestHeader(k, options.header[k]);
		}

		xhr.send();
	});
};