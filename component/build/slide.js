(function(){
/*===================filePath:[src/main/motion/motion.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-13
 * @description tg核心功能
 * @example
		var tab1 = new mo.Tab({
			target: $('#slide01 li')
		}); 
 * @name mo
 * @namespace
 */
(function(){

	(function(){
		
		if(window.Motion) {
			return;
		}

		var Motion = /** @lends mo */{
			/**
			 * tg版本号
			 * @type {string}
			 */
			version: '1.1',

			/**
			 * 命令空间管理 eg. Motion.add('mo.Slide:mo.Tab', function(){})
			 * @param {string} name 
			 * @param {object} obj 
			 */

			add: function(name, obj){
				var target = window;
				var me = arguments.callee;
				var parent = null;
				var isMatch = /^([\w\.]+)(?:\:([\w\.]+))?\s*$/.test(name);
				var objNS = RegExp.$1.split('.');
				var parentNS = RegExp.$2.split('.');
				var name = objNS.pop();
				var isClass = /[A-Z]/.test(name.substr(0,1));
				var constructor = function(){
					var mainFn = arguments.callee.prototype.init;
					if (typeof(mainFn) == 'function' && arguments.callee.caller != me) {
						mainFn && mainFn.apply(this, arguments);
					}
				};

				for(var i = 0; i < objNS.length; i++) {
					var p = objNS[i];
					target = target[p] || (target[p] = {});
				}

				if (parentNS[0] != '') {
					parent = window;
					for (var i = 0; i < parentNS.length; i ++) {
						parent = parent[parentNS[i]];
						if(!parent) {
							parent = null;
							break;
						}
					}
				}


				if(isClass && typeof(obj) == 'function') {
					if(parent) {
						constructor.prototype = new parent();
						constructor.prototype.superClass = parent;
					} 
					target[name] = constructor;
					constructor.prototype.constructor = constructor;
					obj.call(target[name].prototype);
				} else {
					target[name] = obj;
				}

			}

		};

		window.Motion = window.mo = Motion;
	})();

})();
/*===================filePath:[src/main/base/base.js]======================*/
/**
 * @version 1.0
 * @date 2014-06-15
 * @description mo
 * @name mo
 * @namespace
*/

/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 基础类
 * @name mo.Base
 * @class
*/
(function(){
	
	
	Motion.add('mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Base#
		 * @ignore
		 */
		var _public = this;
		/**
		 * public static作用域
		 * @alias mo.Base.
		 * @ignore
		 */
		var _static = this.constructor;
		/**
		 * private static作用域
		 * @alias mo.Base~
		 * @ignore
		 */
		var _self = {};
		/**
		 * 构造函数
		 */
		_public.constructor = function() {
			// private作用域
			var _private = {};
		};


		/**
		 * 绑定事件
		 */
		
		_public.on = function(name, fn) {
			box = Zepto(this);
			return box.on.apply(box, arguments);
		};


		/**
		 * 绑定事件
		 */
		_public.off = function(name, fn) {
			box = Zepto(this);
			return box.off.apply(box, arguments);
		};

		/**
		 * 触发事件
		 */
		_public.trigger = function(name, data) {
			var box = Zepto(this);
			return box.triggerHandler.apply(box, arguments);
		};
		

	});

})();
/*===================filePath:[src/main/tab/tab.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 切换类中
 * @extends mo.Base
 * @name mo.Tab
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
 * @param {object|string} [config.controller='ul>li*'] 触发器
 * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
 * @param {boolean}  [config.autoPlay=false] 是否自动播放 
 * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式） 
 * @param {string}  [config.type='touchend'] 事件触发类型
 * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
 * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
 * @param {number}  [config.stay=2000] 自动播放时停留时间
 * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
 * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
 * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
 * @param {object{string:function}}  [config.event] 初始化绑定的事件
 * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
 * @param {boolean}  [config.lazy=false] 是否启用按需加载
 * @example
		var tab1 = new mo.Tab({
			target: $('#slide01 li')
		});
 * @see tab/demo1.html 普通切换
 * @see tab/demo2.html 按需加载
 * @see tab/demo3.html 自定义事件
 * @class
*/
(function(){
	
	
	Motion.add('mo.Tab:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Tab#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Tab.
		 * @ignore
		 */
		var _static = this.constructor;


		// 插件默认配置
		_static.config = {
			//target // 目标 tab items
			//controller // tab header(toc?)
			//width // 限定目标宽度
			//height // 限定目标高度
			effect: 'base',
			direction: 'x',
			autoPlay: false,
			playTo: 0, // 播放到第几个 tab
			type: 'touchend',
			currentClass: 'current',
			link: false,
			stay: 2000,
			delay: 200,
			touchDis: 20,
			lazy: window.undefined,
			merge: false,
			degradation: 'base',
			animateTime: 300,
			easing: 'swing',
			title: {
				delay: 0
			},
			controlDisabed: false
		};

		_static.effect = {};

		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config) {
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收

			var self = this;
			var config = self.config;


			// 必选参数处理
			var target = Zepto(config.target);
			if (target.length <= 1) {
				return;
			}

			// 参数处理
			Zepto.extend(self, /** @lends mo.Tab.prototype*/ {
				/**
				 * 目标选项卡片
				 * @type object
				 */
				target: target,

				/**
				 * 目标选项卡片控制器
				 * @type object
				 */
				controller: null,

				/**
				 * 上一个选项卡的索引值
				 * @type number|undefined
				 */
				prevPage: window.undefined,

				/**
				 * 当前播放第几个的索引值
				 * @type number|undefined
				 */
				curPage: window.undefined,

				/**
				 * 目标选项卡片容器
				 * @type object
				 */
				container: target.parent(), // 包裹容器

				//length: target.length, // 元素数目
				prevBtn: Zepto(config.prevBtn),
				nextBtn: Zepto(config.nextBtn),

				/**
				 * 播放状态
				 * @type boolean
				 */
				isPlaying: config.autoPlay
			});



			// 自定义事件绑定
			_static.effect[config.effect] && self.on(_static.effect[config.effect]);
			config.event && self.on(config.event);


			/**
			 * @event mo.Tab#beforeinit
			 * @property {object} event 开始初始化前
			 */
			if (self.trigger('beforeinit') === false) {
				return;
			}

			// DOM初始化
			_private.initDOM.call(self);

			// DOM绑定事件
			_private.attach.call(self);

			// 延时0s，待init对DOM修改渲染完成后执行
			/**
			 * @event mo.Tab#init
			 * @property {object} event 初始化完成
			 */
			if (self.trigger('init') === false) {
				return;
			}


			// 播放到默认Tab
			self.playTo(config.playTo);
			// 自动播放
			if (config.autoPlay) self.play();


		};

		// 绑定事件
		_private.initDOM = function() {
			var self = this;
			var config = self.config;

			// 保证 目标层、包裹层、容器层 三层方便控制
			// if (/(:?ul|ol|dl)/i.test(self.container[0].tagName)) {
			// 	self.wrap = self.container;
			// 	self.container = self.wrap.parent();
			// } else {
			// 	config.target.wrapAll('<div class="tab_wrap">'); // 可能带来风险，尽量用用规则保障，不执行到这一步
			// 	self.wrap = self.target.parent();
			// }
			self.wrap = self.container;
			self.container = self.wrap.parent();

			// 如果有控制controller
			if (config.controller !== false) {
				config.controller = Zepto(config.controller);
				if (config.controller.length < 1) {
					var ul = Zepto('<ul class="controller">');
					var str = '';
					for (var i = 0; i < self.target.length; i++) {
						str += '<li><a href="#">' + (i + 1) + '</a></li>';
					}
					ul.html(str);
					self.container.append(ul);
					config.controller = ul.children();
				}
				self.controller = config.controller;
			}

			// 移除不需要且只含有document.write的script标签，以防后续操作出错
			var scripts = self.target.find('script');
			scripts.each(function(i, elem) {
				elem = Zepto(elem);
				// 如果script中只执行了document.write，则移出该script标签
				if (/^\s*document\.write\([^\)]+\)[\s;]*$/.test(elem.html())) {
					elem.remove();
				}
			});

			// 获取标题
			var titleSrc = config.title.dataSrc || self.target;
			var titleProp = config.title.dataProp || 'title';
			var titleWrap = Zepto(config.title.dataWrap);
			titleSrc = Zepto(titleSrc);

			// 如果标题容器存在 并且 有标题数据
			if (titleWrap.length > 0 && titleSrc.attr(titleProp)) {
				self.titleWrap = titleWrap;
				self.titleData = [];
				titleSrc.each(function(i, obj) {
					self.titleData.push(Zepto(obj).attr(titleProp));
				});
			}

			// 检测前缀
			self.cssPrefix = '';
			self.propPrefix = '';
			var vendors = {'webkit': 'webkit', 'Moz': 'moz', 'ms': 'ms'};
			var testElem = document.createElement('div');
			for(var key in vendors) {
				if (testElem.style[key + 'Transform'] !== undefined) {
					self.cssPrefix = '-' + vendors[key] + '-';
					self.propPrefix = key;
					break;
				}
			}



		};

		// 绑定事件
		_private.attach = function() {
			var self = this;
			var config = self.config;

			if (self.controller) {
				Zepto.each(self.controller, function(i, elem) {
					var elem = Zepto(elem);
					var delayTimer;
					elem.on(config.type, function() {
						self.playTo(i);
					});
					if (!config.link) {
						Zepto(elem).on('touchend', function(e) {
							e.preventDefault();
						});
					}

				})
			}

			if (self.nextBtn) {
				Zepto(self.nextBtn).on('touchend', function(e) {
					self.next();
					e.preventDefault();
				});
			}

			if (self.prevBtn) {
				Zepto(self.prevBtn).on('touchend', function(e) {
					self.prev();
					e.preventDefault();
				});
			}

			self.wrap.on('touchstart', function() {
				// 如果没在自动播放
				if (self.isPlaying) {
					_private.clearTimer.call(self);
				}
			});
			Zepto('body').on('touchend', function() {
				// 如果没在自动播放
				if (self.isPlaying) {
					_private.setTimer.call(self);
				}

			});

			if(config.touchMove) {
				_private.touchMove.call(self);
			}

		};

		/**
		 * 播放到第几个选项卡
		 * @param {number} page 第几页（索引值）
		 */
		_public.playTo = function(page) {
			var self = this;
			var config = self.config;
			var hasCur = self.curPage !== window.undefined;
			var prevPage;


			self.prevPage = self.curPage;

			prevPage = self.curPage;
			page = self.curPage = outBound(page);


			if (self.controller && page !== prevPage) {
				var curCtrl = self.controller[page],
					prevCtrl = self.controller[prevPage];
				if (curCtrl) {
					//curCtrl.setAttribute('a', page);
					Zepto(curCtrl).addClass(self.config.currentClass);
				}
				if (prevCtrl) Zepto(prevCtrl).removeClass(self.config.currentClass); //如果正常获取
			}

			// 填充标题
			if (self.titleWrap) {
				window.setTimeout(function() {
					self.titleWrap.html(self.titleData[self.curPage] || '');
				}, config.title.delay);
			}

			// 按需加载
			var curTarget = Zepto(self.target[self.curPage]);
			if (config.lazy === window.undefined) {
				var curChildren = curTarget.children();
				if (curChildren.length === 1 && curChildren[0].tagName.toLowerCase() == 'textarea') {
					config.lazy = true;
				}
			}
			if (config.lazy === true) {
				if (curTarget.length > 0 && !curTarget.data('parsed')) _private.lazyload(curTarget);
			}

			//self.config.onchange.call(self, page);
			/**
			 * @event mo.Tab#beforechange
			 * @property {object} event 开始切换
			 */
			self.trigger('beforechange');

			//if(self.effect) self.effect.onchange.call(self);

			// 临界计算
			function outBound(i) {
				if (i >= self.target.length) i %= self.target.length;
				if (i < 0) {
					var m = i % self.target.length;
					i = m === 0 ? 0 : (m + self.target.length);
				}
				return i;
			}

		};

		/**
		 * 播放后一个
		 */
		_public.next = function() {
			this.playTo(this.curPage + 1);
		};

		/**
		 * 播放前一个
		 */
		_public.prev = function() {
			this.playTo(this.curPage - 1);
		};

		/**
		 * 开始自动播放
		 */
		_private.setTimer = function() {
			var self = this;
			var config = self.config;
			if (self.timer) {
				_private.clearTimer.call(self);
			}

			self.timer = window.setInterval(function() {
				var to = self.curPage + 1;
				self.playTo(to);

			}, config.stay);

		};

		/**
		 * 停止自动播放
		 */
		_private.clearTimer = function() {
			window.clearInterval(this.timer);
		};

		/**
		 * 开始自动播放
		 */
		_public.play = function() {
			var self = this;
			_private.setTimer.call(self);
			self.isPlaying = true;
			self.trigger('play');
		};

		/**
		 * 停止自动播放
		 */
		_public.stop = function() {
			var self = this;
			_private.clearTimer.call(self);
			self.isPlaying = false;
			self.trigger('stop');
		};

		_static.extend = function(name, events) {
			var obj = {};
			if (Zepto.isPlainObject(name)) {
				obj = name;
			} else {
				obj[name] = events;
			}
			Zepto.extend(_static.effect, obj);
		};

		_private.lazyload = function(curTarget) {
			var textareas = curTarget.children('textarea');

			// curTarget子元素有且只有一个textarea元素时
			if (textareas.length === 1) {
				curTarget.html(textareas.eq(0).val())
				curTarget.data('parsed', true);
			}
		};

		_private.touchMove = function(){
			var self = this;
			var config = self.config;

			var touchMove, touchEnd, touchDirection;
			var startX, startY, disX, disY, dis;
			var moveX,moveY, moveDisX, moveDisY, moveDis;

			if (config.touchMove) {
				self.wrap.on('touchstart', function(e) {
					startX = moveX = e.touches[0].pageX;
					startY = moveY = e.touches[0].pageY;

					/**
					 * @event mo.Tab#touchstart
					 * @property {object} event 开始切换
					 */
					if (self.trigger('touchstart', [startX, startY]) === false) {
						return;
					}

					self.wrap.on('touchmove', touchMove);
					self.wrap.on('touchend', touchEnd);
					touchDirection = '';
				});
			}
			touchMove = function(e) {
				var x = e.touches[0].pageX;
				var y =  e.touches[0].pageY;
				disX = x - startX;
				disY = y - startY;
				moveDisX = x - moveX;
				moveDisY = y - moveY;
				moveX = x;
				moveY = y;

				if (config.direction == 'x') {
					dis = disX;
					moveDis = moveDisX;
				} else {
					dis = disY;
					moveDis = moveDisY;
				}
				if (!touchDirection) {
					if (Math.abs(disX / disY) > 1) {
						touchDirection = 'x';
					} else {
						touchDirection = 'y';
					}
				}

				if (config.direction == touchDirection) {

					e.preventDefault();
					e.stopPropagation();
					/**
					 * @event mo.Tab#touchmove
					 * @property {object} event 开始切换
					 */
					self.trigger('touchmove', [dis, moveDis, e]);
				}
				// if ((dis > 0 && self.curPage >= 0) || (dis < 0 && self.curPage <= self.target.length - 1)) {

				// }



			}
			touchEnd = function() {
				if (touchDirection && config.direction != touchDirection) {
					return;
				}
				if (dis === undefined || isNaN(dis)) {
					dis = 0;
				}

				// self.wrap.style.webkitTransitionDuration = config.animTime + 'ms';
				self.wrap.off('touchmove', touchMove);
				self.wrap.off('touchend', touchEnd);

				var isOK = true;

				/**
				 * @event mo.Tab#touchend
				 * @property {object} event 开始切换
				 */
				if (self.trigger('touchend', [dis]) === false) {
					return;
				}

				if (!dis || (Math.abs(dis) < config.touchDis || !isOK)) {
					self.playTo(self.curPage);
					return;
				}



				if (dis > 0) {
					var to = self.curPage - 1 < 0 ? 0 : self.curPage - 1;
				} else {
					var to = self.curPage + 1 >= self.target.length ? self.target.length - 1 : self.curPage + 1;
				}

				self.playTo(to);

				dis = 0;

			};

		};

		_static.extend('base', {
			init: function() {
				var self = this;
				config = self.config;
				Zepto.each(self.target, function(i, elem) {
					if (self.target[config.playTo][0] != elem) Zepto(elem).hide();
				});

			},
			beforechange: function() {
				var self = this,
					prevElem = self.prevPage === window.undefined ? null : self.target[self.prevPage],
					curElem = self.target[self.curPage];
				if (prevElem) Zepto(prevElem).hide();
				Zepto(curElem).show();
				/**
				 * @event mo.Tab#change
				 * @property {object} event 切换完成
				 */
				self.trigger('change');

			}
		});


	});
})();
/*===================filePath:[src/main/slide/slide.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 切换类
 * @extends mo.Tab
 * @name mo.Slide
 * @requires lib/zepto.js
 * @requires src/base.js
 * @requires src/tab.js
 * @param {boolean}  [config.touchMove=true] 是否允许手指滑动
  * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
 * @param {object|string} [config.controller='ul>li*'] 触发器
 * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
 * @param {boolean}  [config.autoPlay=false] 是否自动播放 
 * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式） 
 * @param {string}  [config.type='mouseover'] 事件触发类型
 * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
 * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
 * @param {number}  [config.stay=2000] 自动播放时停留时间
 * @param {number}  [config.delay=150] mouseover触发延迟时间
 * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
 * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
 * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
 * @param {object{string:function}}  [config.event] 初始化绑定的事件
 * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
 * @param {boolean}  [config.lazy=false] 是否启用按需加载
 * @example
		var tab1 = new mo.Slide({
			target: $('#slide01 li')
		});
 * @see slide/demo1.html 普通滑动
 * @see slide/demo2.html 横向单屏滑动-扫二维码看效果
 * @see slide/demo3.html 带标题的滑动
 * @see slide/demo4.html 未命名滑动
 * @class
*/
(function(){
	
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
			effect: 'slide'
		};

		mo.Tab.extend('slide', {
			init: function() {
				var self = this;
				var config = self.config;

				// 清除浮动
				self.container.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				self.container.css('-webkit-backface-visibility', 'hidden');


				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {

					// 初始化CSS
					self.target.css('float', 'left');

					var wrapWidth = 0;
					self.target.each(function(i, elem) {
						wrapWidth += Zepto(elem)[0].offsetWidth;
					});
					if (wrapWidth <= 0) {
						wrapWidth = document.documentElement.offsetWidth * self.target.length;
					}

					self.wrap.css('width', config.wrapWidth || wrapWidth + 'px');

					// 设置操作属性
					self.animProp = 'translateX'; // 为避免DOM树插入节点带来的风险，停用scrollLeft
					self.offsetProp = 'offsetLeft';
				} else {
					self.animProp = 'translateY';
					self.offsetProp = 'offsetTop';
				}
			},

			touchstart: function(){
				if(this.moving == true) {
					return false;
				}
			},

			touchmove: function(e, dis, oriEvent){
				var self = this;
				var o = {};
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (dis - self.target[self.curPage][self.offsetProp]) + 'px)';

				self.wrap.css(o, 0);
				oriEvent.preventDefault();
				oriEvent.stopPropagation();


			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var from = self.prevPage === window.undefined ? 0 : self.prevPage;
				var to = self.curPage;
				var pos;
				var o = {};
				var animObj;

				o[self.animProp] = -self.target[to][self.offsetProp] + 'px';

				self.moving = true;
				self.wrap.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self.trigger('change');
				});
			}


		});




	});

})();
})();