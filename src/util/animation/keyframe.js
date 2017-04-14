/**
 * keyframe整理
 * 
 * @type {Object}
 */
const Keyframe = {
	/**
	 * 补全offset。对于部分没有填写offset
	 * @param  {[type]} keyframes [description]
	 * @return {[type]}           [description]
	 */
	clearSpaceOffset(keyframes){
		let len = keyframes.length;
		if (keyframes[len - 1].offset === undefined) {
			keyframes[len - 1].offset = 1;
		}
		if (len > 1 && keyframes[0].offset === undefined){
			keyframes[0].offset = 0;
		}
		let previousIndex = 0;
		let previousOffset = keyframes[0].offset;
		for (let i = 1; i < len; i++) {
			let offset = keyframes[i].offset;
			if (offset !== undefined) {
				for (let j = 1; j < i - previousIndex; j++){
					keyframes[previousIndex + j].offset = previousOffset + (offset - previousOffset) * j / (i - previousIndex);
				}
				previousIndex = i;
				previousOffset = offset;
			}
		}
	},
	/**
	 * 多种参数格式兼容，讲对象转换成数组的keyframe形势
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	format(options){
		let keyframes = [];
		if (Array.isArray(options)) {
			keyframes = options;
		}else if (Object.keys(options).length) { //is object
			for(let k in options){
				if (k in ['easing', 'offset', 'composite']) {
					continue;
				}
				let val = options[k];
				if (Array.isArray(val)) {
					let lastIndex = val.length - 1;
					if (lastIndex === 0) {
						keyframes.push({
							[k] : val[0],
							offset : 1
						});
					}else{
						val.forEach((item, index) => {
							keyframes.push({
								[k] : item,
								offset : index / lastIndex
							});
						});
					}
				}
			}
			keyframes.sort(function(item1, item2){
				return item1.offset - item2.offset;
			});
		}
		if (keyframes.length) {
			//补全所有keyframe的offset
			Keyframe.clearSpaceOffset(keyframes);

			let normalize = [keyframes[0]];
			let curOffset = normalize[0].offset;
			keyframes.forEach((item) => {
				if (item.offset === curOffset) { //需要合并相同offset的值
					for(let k in item){
						normalize[normalize.length - 1][k] = item[k];
					}
				}else{
					curOffset = item.offset;
					normalize.push(item);
				}
			});
			keyframes = normalize;
		}
		return keyframes;
	}
};
export default Keyframe;