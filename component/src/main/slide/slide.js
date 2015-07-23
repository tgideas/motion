/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 页面切换，图片滑动等全部统一使用mo.Slide
 * @extends mo.Tab
 * @name mo.Slide
 * @requires lib/zepto.js
 * @requires src/base.js
 * @requires src/tab.js
 * @param {boolean}  [config.touchMove=true] 是否允许手指滑动
  * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
 * @param {object|string} [config.controller='ul>li*'] 触发器
 * @param {string} [config.effect='slide'] 指定效果，可选值：'slide', 'push', 'flip'
 * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
 * @param {boolean}  [config.autoPlay=false] 是否自动播放 
 * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式） 
 * @param {string}  [config.type='mouseover'] 事件触发类型
 * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
 * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
 * @param {number}  [config.stay=2000] 自动播放时停留时间
 * @param {number}  [config.disable] 禁止某屏滚动
 * @param {boolean}  [config.loop=false] 是否启用循环滚动
 * @param {number}  [config.delay=150] mouseover触发延迟时间
 * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
 * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
 * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
 * @param {object{string:function}}  [config.event] 初始化绑定的事件
 * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
 * @param {boolean}  [config.lazy=false] 是否启用按需加载，需要按需加载的元素设置data-src属性
 * @example
		var tab1 = new mo.Slide({
			target: $('#slide01 li')
		});
 * @see slide/demo5.html 默认滚动效果slide
 * @see slide/demo6.html 推动滚动效果push
 * @see slide/demo7.html 3d翻转效果flip
 * @see slide/demo8.html 循环滚动
 * @see slide/demo9.html 锁屏
 * @see slide/demo10.html 嵌套的slide
 * @see slide/demo11.html 按需加载
 * @class
*/
define(function(require, exports, module) {
	require('../tab/tab.js');
	Motion.add('mo.Slide:mo.Tab', function() {
		/**
		 * public 作用域
		 * @alias mo.Slide#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Slide.
		 * @ignore
		 */
		var _static = this.constructor;



		_public.init = function(config) {
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			
			// 初始化父类
			this.superClass.call(this, this.config);
		};

		_static.config = {
			touchMove: true,
			direction: 'y',
			effect: 'slide',
			controller: false
		};

		mo.Tab.extend('slide', {
			init: function() {
				var self = this;
				var config = self.config;

				// 清除浮动
				self.wrap.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				self.wrap.css('-webkit-backface-visibility', 'hidden');
				self.target.css({
					'position': 'absolute',
					'top': '0',
					'left': '0',
					'visibility': 'hidden'
				});

				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {

					// // 初始化CSS
					// var wrapWidth = 0;
					// self.target.each(function(i, elem) {
					// 	wrapWidth += Zepto(elem)[0].offsetWidth;
					// });
					// if (wrapWidth <= 0) {
					// 	wrapWidth = document.documentElement.offsetWidth * self.target.length;
					// }

					// self.wrap.css('width', config.wrapWidth || wrapWidth + 'px');

					// 设置操作属性
					self.animProp = 'translateX';  
					self.sizeProp = 'width';
					self.posProp = ['left', 'right'];
				} else {
					self.animProp = 'translateY'; 
					self.sizeProp = 'height';
					self.posProp = ['top', 'bottom'];
				}
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				var curObj = self.target.eq(self.curPage);
				if(self.moving == true) {
					return;
				}

				// 判断是否是锁定屏
				var locked = false;
				if( (self.disabledNextList.indexOf(self.curPage) !== -1 && moveDis < 0) || (self.disabledPrevList.indexOf(self.curPage) !== -1 && moveDis > 0)) {
					locked = true;
				}

				// 获取当前偏移值
				var currentVal = /\(([\d-]*).*\)/.exec(curObj.css(self.propPrefix + 'Transform'));
				var currentPos = currentVal ? currentVal[1]*1 : 0;

				// 设置当前屏位置
				var curStyle = {};
				var offsetDis = currentPos + moveDis;
				if(locked) {
					offsetDis = startDis/6;
				}
				curStyle[self.cssPrefix + 'transform'] = self.animProp + '(' + (offsetDis) + 'px)';
				self.target.css('visibility', 'hidden');
				curObj.css(curStyle).css('visibility', 'visible');

				// 设置下一屏位置
				var nextObj, nextDis = {}, nextSize;
				if(startDis > 0) {
					nextObj = self.target.eq(self._outBound(self.curPage-1));
					nextSize = - nextObj[self.sizeProp]();
				} else {
					nextObj = self.target.eq(self._outBound(self.curPage+1));
					nextSize = curObj[self.sizeProp]();

				}

				if(!locked ) {
					self.target.css('visibility', 'hidden');
					curObj.css('visibility', 'visible');
					nextObj.css('visibility', 'visible');
					nextDis[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis +  nextSize) + 'px)';
					nextObj.css(nextDis);			
				}

			},

			touchend: function(e, dis){
				var self = this;
				var curObj = self.target.eq(self.curPage);

				// 如果有单屏页面内容过多
				var rect = self.target[self.curPage].getBoundingClientRect();
				var winHeight = window.innerHeight;
				if( (dis <= 0 && rect[self.posProp[1]] > winHeight) || (dis > 0 && rect[self.posProp[0]] < 0)) {
					var currentVal = /\(([\d-]*).*\)/.exec(curObj.css(self.propPrefix + 'Transform'));
					var currentPos = currentVal ? currentVal[1]*1 : 0;
					var posObj = {};
					var pos = currentPos + dis;
					var size  = curObj[self.sizeProp]();
					var wrapSize = self.wrap[self.sizeProp]();
					pos = pos > 0 ? 0 : pos;
					pos = pos < wrapSize - size ? wrapSize  - size: pos;
					posObj[self.cssPrefix + 'transform'] = self.animProp+'('+ pos +'px)';
					curObj.animate(posObj);
					return false;
				}
			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var prevIndex = self.prevPage === window.undefined ? self._outBound(self.curPage - 1) : self.prevPage;
				var curIndex = self.curPage;
				var prevObj = self.target.eq(prevIndex);
				var curObj = self.target.eq(curIndex);
				var prevStartPos = {}, prevEndPos = {}, curStartPos = {}, curEndPos = {};
				var size;

				// 位置
				if(self.oriPrevPage !== window.undefined && self.oriCurPage < self.oriPrevPage) {
					size = -curObj[self.sizeProp]();

				} else {
					size = prevObj[self.sizeProp]();

				}
				curStartPos[self.cssPrefix + 'transform'] = self.animProp+'('+ size +'px)';
				prevEndPos[self.cssPrefix + 'transform'] = self.animProp+'('+ (-size) +'px)';
				curEndPos[self.cssPrefix + 'transform'] = self.animProp+'(0px)';

				// 设置初始属性
				// curObj.css(curStartPos);
				self.target.css('visibility', 'hidden');
				prevObj.css('visibility', 'visible');
				curObj.css('visibility', 'visible');

				// 设置终点属性
				prevObj.animate(prevEndPos, config.animateTime, config.easing, function(){
					prevObj.css('visibility', 'hidden');
				});
				curObj.animate(curEndPos, config.animateTime, config.easing, function(){
					self.moving = false;
					self.trigger('change', [self.curPage]);				
				});
			}

		});


















	});

});




