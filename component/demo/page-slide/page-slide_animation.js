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
 * @param {number}  [config.switchTo=undefined] 切换到第几个（无动画效果） 
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
			switchTo: window.undefined, // 切换到第几个 tab
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
			event: {},
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

			// 统计实例
			if(this.constructor.instances) {
				this.constructor.instances.push(this);
			} else {
				this.constructor.instances = [this];
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

			// 快捷传入自定义事件
			for(var name in config) {
				var result = /^on(.+)/.exec(name);
				if(result && result[1]) {
					config.event[result[1]] = config[name];
				}
			}

			// 效果作为自定义事件绑定
			if(_static.effect[config.effect]['beforechange']) {
				_static.effect[config.effect]['mobeforechange'] = _static.effect[config.effect]['beforechange'];
				delete _static.effect[config.effect]['beforechange'];
			}
			self.on(_static.effect[config.effect]);

			// 自定义事件绑定
			self.on(config.event);


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
			if(config.switchTo !== window.undefined) {
				self.switchTo(config.switchTo);
			} else {
				self.playTo(config.playTo);
			}
			

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
						str += '<li>' + (i + 1) + '</li>';
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
						Zepto(elem).on('touchend mouseup', function(e) {
							e.preventDefault();
						});
					}

				})
			}

			if (self.nextBtn) {
				Zepto(self.nextBtn).on('touchend mouseup', function(e) {
					self.next();
					e.preventDefault();
				});
			}

			if (self.prevBtn) {
				Zepto(self.prevBtn).on('touchend mouseup', function(e) {
					self.prev();
					e.preventDefault();
				});
			}

			self.wrap.on('touchstart mousedown', function() {
				// 如果没在自动播放
				if (self.isPlaying) {
					_private.clearTimer.call(self);
				}
			});
			Zepto('body').on('touchend mouseup', function() {
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

			// 临界计算
			self._outBound =  function(i) {
				if (i >= self.target.length) i %= self.target.length;
				if (i < 0) {
					var m = i % self.target.length;
					i = m === 0 ? 0 : (m + self.target.length);
				}
				return i;
			}


			self.prevPage = self.curPage;

			prevPage = self.curPage;
			page = self.curPage = self._outBound(page);


			if (self.controller && page !== prevPage) {
				var curCtrl = self.controller[page],
					prevCtrl = self.controller[prevPage];
				if (curCtrl) {
					//curCtrl.setAttribute('a', page);
					Zepto(curCtrl).addClass(self.config.currentClass);
				}
				if (prevCtrl) Zepto(prevCtrl).removeClass(self.config.currentClass); //如果正常获取


			}

			if(page !== prevPage) {
				self.target.eq(page).addClass(self.config.currentClass);
				self.target.eq(prevPage).removeClass(self.config.currentClass);	
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
			if (self.trigger('beforechange', [self.curPage]) === false) {
				return;
			}

			self.trigger('mobeforechange');
			//if(self.effect) self.effect.onchange.call(self);

			

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

		/**
		 * 无动画效果切换
		 */
		_public.switchTo = function(page) {
			var userAnimateTime = this.config.animateTime;
			this.config.animateTime = 0;
			this.playTo(page);
			this.config.animateTime = userAnimateTime;
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
				self.wrap.on('touchstart mousedown', function(e) {
					var evt = e.touches ?  e.touches[0] : e;
					startX = moveX = evt.pageX;
					startY = moveY = evt.pageY;

					/**
					 * @event mo.Tab#touchstart
					 * @property {object} event 开始切换
					 */
					if (self.trigger('touchstart', [startX, startY]) === false) {
						return;
					}

					self.wrap.on('touchmove mousemove', touchMove);
					self.wrap.on('touchend mouseup', touchEnd);
					touchDirection = '';
				});
			}
			touchMove = function(e) {
				var evt = e.touches ?  e.touches[0] : e;
				var x = evt.pageX;
				var y =  evt.pageY;
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
					self.trigger('touchmove', [dis, moveDis, evt]);
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
				self.wrap.off('touchmove mousemove', touchMove);
				self.wrap.off('touchend mouseup', touchEnd);

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
				self.trigger('change', [self.curPage]);

			}
		});


	});
})();
/*===================filePath:[src/main/page-slide/page-slide.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 切换类
 * @extends mo.Tab
 * @name mo.PageSlide
 * @requires lib/zepto.js
 * @requires src/base.js
 * @requires src/tab.js
 * @param {boolean}  [config.touchMove=true] 是否允许手指滑动
  * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
 * @param {object|string} [config.controller='ul>li*'] 触发器
 * @param {string} [config.effect='slide'] 指定效果，可选值：'slide', 'roll', 'scale'
 * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
 * @param {boolean}  [config.autoPlay=false] 是否自动播放 
 * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式） 
 * @param {string}  [config.type='mouseover'] 事件触发类型
 * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
 * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
 * @param {number}  [config.stay=2000] 自动播放时停留时间
 * @param {boolean}  [config.loop=false] 是否启用循环滚动
 * @param {number}  [config.delay=150] mouseover触发延迟时间
 * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
 * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
 * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
 * @param {object{string:function}}  [config.event] 初始化绑定的事件
 * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
 * @param {boolean}  [config.lazy=false] 是否启用按需加载
 * @example
		var tab1 = new mo.PageSlide({
			target: $('#slide01 li')
		});
 * @see page-slide/demo2.html 垂直单屏滑动
 * @see page-slide/demo3.html 垂直缩放滑动
 * @class
*/
(function(){
	
	Motion.add('mo.PageSlide:mo.Tab', function() {
		/**
		 * public 作用域
		 * @alias mo.PageSlide#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.PageSlide.
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
					self.animProp = 'translateX'; 
					self.offsetProp = 'offsetLeft';
				} else {
					self.animProp = 'translateY'; 
					self.offsetProp = 'offsetTop';
				}
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}


				var o = {};
				var currentVal = /\(([\d-]*).*\)/.exec(self.wrap.css(self.propPrefix + 'Transform'));
				var currentPos = currentVal ? currentVal[1]*1 : 0;
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis)  + 'px)';


				self.wrap.css(o, 0);

				
			},

			touchend: function(e, dis){
				var self = this;

				// 如果有单屏页面内容过多
				var rect = self.target[self.curPage].getBoundingClientRect();
				var winHeight = window.innerHeight;
				if( (dis < 0 && rect.bottom > winHeight) || (dis > 0 && rect.top < 0)) {
					return false;
				}	
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
					self.trigger('change', [self.curPage]);
				});
			}


		});


		mo.Tab.extend('roll', {
			init: function() {
				var self = this;
				var config = self.config;
				var cssPrefix = self.cssPrefix;
				var offset = self.wrap.offset();
				var size  = config.direction == 'x' ? offset.width : offset.height;
				var rotateFn = config.direction == 'x'  ? 'rotateY' : 'rotateX';
				var theta = 360 / self.target.length;
				var radius  = Math.round(  size / 2 / Math.tan( Math.PI / self.target.length ) );

				self.theta = theta;
				self.radius = radius;
				self.rotateFn = rotateFn;

				self.container.css(cssPrefix + 'perspective', 200 +'px');
				self.container.css(cssPrefix + 'backface-visibility', 'hidden');

				var wrapCss = {'position': 'relative'};
				wrapCss[cssPrefix + 'transform-style'] =  'preserve-3d';
				wrapCss[cssPrefix + 'transform'] = 'translateZ(-'+ radius  +'px)';
				wrapCss[cssPrefix + 'transform-origin'] = '50% 50% -'+ radius +'px';
				self.wrap.css(wrapCss);


				for(var i = 0; i < self.target.length; i++) {
					var targetCss = {
						'position': 'absolute',
						'left': 0,
						'top': 0
					};
					targetCss[cssPrefix + 'transform'] = rotateFn +'(-'+ i*360/self.target.length +'deg) translateZ('+ radius  +'px)';
					self.target.eq(i).css(targetCss);
				}
			},

			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}

				var angle = self.curPage * self.theta - startDis/5;
				// console.log(angle, startDis);

				self.wrap.css(self.cssPrefix + 'transform', self.rotateFn + '('+ angle +'deg) translateZ(-'+ self.radius  +'px)');

				e.preventDefault();
			},

			touchend: function(e, dis){

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var angle = self.curPage * self.theta;
				var o = {};
				o[self.cssPrefix + 'transform'] = self.rotateFn  + '('+ angle +'deg) translateZ(-'+ self.radius  +'px)';
				
				self.moving = true;
				self.wrap.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self.trigger('change', [self.curPage]);
				});
			},

			change: function(){

				// console.log(0)
			}


		});





		mo.Tab.extend('scale', {
			init: function() {
				var self = this;
				var config = self.config;
				var cssPrefix = self.cssPrefix;
				var offset = self.wrap.offset();
				var size  = config.direction == 'x' ? offset.width : offset.height;
				var rotateFn = config.direction == 'x'  ? 'rotateY' : 'rotateX';
				var theta = 360 / self.target.length;
				var radius  = Math.round(  size / 2 / Math.tan( Math.PI / self.target.length ) );

				self.wrap.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				// self.container.css(cssPrefix + 'backface-visibility', 'hidden');


				self.target.each(function(i, obj){
					obj = Zepto(obj);
					var o = {};
					// o[self.cssPrefix + 'transform'] = 'scaleX(0.5) scaleY(0.5)';
					// obj.css(o);
				});



				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {

					// 设置操作属性
					self.animProp = 'translateX'; 
					self.offsetProp = 'offsetLeft';
				} else {
					self.animProp = 'translateY'; 
					self.offsetProp = 'offsetTop';
				}
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}

				var o = {};
				var currentObj = self.target.eq(self.curPage);
				var currentVal = /\(([\d-]*).*\)/.exec(self.wrap.css(self.propPrefix + 'Transform'));
				var currentPos = currentVal ? currentVal[1]*1 : 0;
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis)  + 'px)';

				if(startDis >0 ) {
					currentObj.css(self.cssPrefix + 'transform-origin', '50% 0%');
				} else {
					currentObj.css(self.cssPrefix + 'transform-origin', '50% 100%');
				}

				self.wrap.css(o, 0);

				var scale = 1-Math.abs(startDis/Zepto(window).height());



				e.preventDefault();

				var prevObjProp = {};
				prevObjProp[self.cssPrefix + 'transform'] = 'scaleX('+ scale +') scaleY('+ scale +')';
				currentObj.css(prevObjProp);




			},

			touchend: function(e, dis){

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var obj = self.target.eq(self.curPage);
				var prevObj = self.prevPage === window.undefined ? null : self.target.eq(self.prevPage);

				var wrapProp = {};
				wrapProp[self.cssPrefix + 'transform'] = 'translateY(-' + obj[0].offsetTop + 'px)';


				// obj.css(self.cssPrefix + 'transform', 'scaleX(0.2) scaleY(0.2)');


				if(prevObj) {
					var prevObjProp = {};
					prevObjProp[self.cssPrefix + 'transform'] = 'scaleX(0.2) scaleY(0.2)';
					prevObjProp[self.cssPrefix + 'backface-visibility'] = 'hidden';
					prevObj.animate(prevObjProp, config.animateTime, config.easing, function() {
						prevObj.css(self.cssPrefix + 'transform', 'scaleX(1) scaleY(1)');
					});
				}

				var objProp = {};
				objProp[self.cssPrefix + 'transform'] = 'scaleX(1) scaleY(1)';
				objProp[self.cssPrefix + 'backface-visibility'] = 'hidden';
				obj.animate(objProp, config.animateTime, config.easing, function() {
					// self.trigger('change');
				});


				self.moving = true;
				
				self.wrap.animate(wrapProp, config.animateTime, config.easing, function() {
					self.moving = false;

					self.trigger('change', [self.curPage]);
				});


			},

			change: function(){

				// console.log(0)
			}


		});




		mo.Tab.extend('xx', {
			init: function() {
				var self = this;
				var config = self.config;
				var wrapOffset = self.wrap.offset();

				// 初始化样式
				self.wrap.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				self.target.css({
					'position': 'absolute'
				});

				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {
					self.animProp = 'translateX'; 
					self.offset = wrapOffset.width;
				} else {
					self.animProp = 'translateY'; 
					self.offset = wrapOffset.height;
				}

				// 往上翻移动层级
				self._launch = function(obj){
					self.target.css('zIndex', '1');
					var o = {};
					o[self.cssPrefix + 'transform'] = self.animProp + '(' + obj.data('oriPos') + 'px)';
					o.zIndex = '3';
					obj.css(o);
					obj.data('hasReady', true);
					
				};
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				var targetObj;
				var plus;
				if(self.moving == true) {
					return;
				}

				if(self._targetObj === window.undefined) {
					var targetPage;
					var oriPos;
					if(startDis < 0) {
						targetPage = self._outBound(self.curPage + 1);
						oriPos =  self.offset;
					} else {
						targetPage = self._outBound(self.curPage - 1);
						oriPos = -self.offset;
					}
					self._targetObj = self.target.eq(targetPage);
					self._targetObj.data('oriPos', oriPos);
					self._launch(self._targetObj);[
					]
					self.target.eq(self.curPage).css('zIndex', '2');
				}

				var o = {};
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (startDis + self._targetObj.data('oriPos')) + 'px)';
				self._targetObj.css(o);
			},

			touchend: function(e, dis){
				var self = this;
				var config = self.config;
				// 回到本页
				if(Math.abs(dis) < self.config.touchDis) {console.log(self._targetObj);
					var o = {};
					o[self.animProp] =   '0px';
					self._targetObj.animate(o, config.animateTime, config.easing, function(){
						self.moving = false;
						self._targetObj.data('hasReady', false);

						delete self._targetObj;
					});
				} 

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var pos;
				var o = {};
				var animObj;


				if(self._targetObj === window.undefined) {
					var oriPos;
					if( (self.prevPage !== window.undefined) && (self.curPage < self.prevPage)) {
						oriPos = -self.offset;
					} else {
						oriPos =  self.offset;
					}
					self._targetObj = self.target.eq(self.curPage);
					self._targetObj.data('oriPos', oriPos);
					self._launch(self._targetObj);
					self.target.eq(self.prevPage).css('zIndex', '2');
				}



				o[self.animProp] =   '0px';
				// console.log(self.curPage);

				self._targetObj.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self._targetObj.data('hasReady', false);
					delete self._targetObj;
					self.trigger('change', [self.curPage]);
				});

	


			},

			change: function(){

			}


		});






	});

})();
/*===================filePath:[src/main/animation/animation.js]======================*/
/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-11-25
 * @description CSS3动画生成器 <br/> 一、提供javascript方法控制动画；二、提供事件接口监听动画；三、自动完成各平台兼容；四、提供大量内置动画，未使用时不插入。
 * @extends mo.Base
 * @name mo.Animation
 * @requires lib/zepto.js
 * @param {object} config.target 目标元素
 * @param {string} config.keyframes 动画关键帧设置，如果参数effect为空，该参数为必选
 * @param {string} [config.effect=''] 选择内置效果，也可以继续设置keyframes与内置效果叠加 <br/> 内置效果：flash, shake, swing, wobble, bounceIn, bounceInLeft, bounceInRight, bounceOut, bounceOutLeft, bounceOutRight, fadeIn, fadeOut, flip, flipInX, flipInY, flipOutX, flipOutY, rollIn, rollOut, zoomIn, zoomOut
 * @param {number} [config.duration=2000] 动画时间，单位ms
 * @param {string} [config.easing='swing'] 动画缓冲类型
 * @param {boolean} [config.autoPlay=true] 是否自动播放
 * @param {boolean} [config.fillMode='none'] none：默认值。不设置对象动画之外的状态<br/> forwards：设置对象状态为动画结束时的状态<br/> backwards：设置对象状态为动画开始时的状态<br/> both：设置对象状态为动画结束或开始的状态
 * @param {number} [config.delay=0] 设置对象动画延迟的时间，单位ms
 * @param {number|string} [config.iteration=1] 设置对象动画的循环次数。infinite为无限循环。
 * @param {string} [config.direction='normal'] 设置对象动画在循环中是否反向运动。<br/>normal：正常方向<br/> alternate正常与反向交替
 * @example
new mo.Animation({
	target: $(elem),
	effect: 'shake'
});	
 * @see animation/demo1.html 内置效果
 * @see animation/demo2.html 加载效果
 * @see animation/demo3.html 方法与事件
 * @class
*/
(function(){
	




	Motion.add('mo.Animation:mo.Base', function() {

		/**
		 * public 作用域
		 * @alias mo.Animation#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Animation.
		 * @ignore
		 */
		// var _static = arguments.callee;
		var _static = this.constructor;

		var head = document.getElementsByTagName('head')[0] || document.documentElement;
		var styleElem = document.createElement('style');
		head.appendChild(styleElem);



		// 插件默认配置
		_static.config = {
			duration : 2000,
			easing: 'swing',
			autoPlay: true,
			fillMode: 'none',
			delay: 0,
			iteration: 1,
			direction: 'normal',
			effect: '',
			apply: true,
			keyframes: {}
		};

		_private.effect = {
			'flash': {
				'0,50,100': {opacity: 1},
				'25,75': {opacity: 0}
			},
			'shake': {
				'0,100': {transform: 'translate3d(0, 0, 0)'},
				'10, 30, 50, 70, 90': {transform: 'translate3d(-10px, 0, 0)'},
				'20, 40, 60, 80': {transform: 'translate3d(10px, 0, 0)'}
			},
			'swing':{
				'20': {transform: 'rotate3d(0, 0, 1, 15deg)'},
				'40': {transform: 'rotate3d(0, 0, 1, -10deg)'},
				'60': {transform: 'rotate3d(0, 0, 1, 5deg)'},
				'80': {transform: 'rotate3d(0, 0, 1, -5deg)'},
				'100': {transform: 'rotate3d(0, 0, 1, 0deg)'}
			},
			'wobble':{
				'0': {transform: 'none'},
				'15': {transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)'},
				'30': {transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)'},
				'45': {transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)'},
				'60': {transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)'},
				'75': {transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)'},
				'100': {transform: 'none'}
			},
			'bounceIn':{
				'0':{opacity: 0, transform: 'scale3d(.3, .3, .3)'},
				'20':{transform: 'scale3d(1.1, 1.1, 1.1)'},
				'40':{transform: 'scale3d(.9, .9, .9)'},
				'60':{opacity: 1, transform: 'scale3d(1.03, 1.03, 1.03)'},
				'80':{transform: 'scale3d(.97, .97, .97)'},
				'100':{opacity: 1, transform: 'scale3d(1, 1, 1)'}
			},
			'bounceInLeft':{
				'0':{opacity: 0, transform: 'translate3d(-3000px, 0, 0)'},
				'60':{opacity: 1, transform: 'translate3d(25px, 0, 0)'},
				'75':{transform: 'translate3d(-10px, 0, 0)'},
				'90':{transform: 'translate3d(5px, 0, 0)'},
				'100':{transform: 'none'}
			},
			'bounceInRight':{
				'0':{opacity: 0, transform: 'translate3d(3000px, 0, 0)'},
				'60':{opacity: 1, transform: 'translate3d(-25px, 0, 0)'},
				'75':{transform: 'translate3d(10px, 0, 0)'},
				'90':{transform: 'translate3d(-5px, 0, 0)'},
				'100':{transform: 'none'}
			},
			'bounceOut':{
				'0':{transform: 'scale3d(.9, .9, .9)'},
				'50,55':{transform: 'scale3d(1.1, 1.1, 1.1)'},
				'100':{opacity: 0, transform: 'scale3d(.3, .3, .3)'}
			},			
			'bounceOutLeft':{
				'20':{opacity:1,transform: 'translate3d(20px, 0, 0)'},
				'100':{opacity: 0, transform: 'translate3d(-2000px, 0, 0)'}
			},			
			'bounceOutRight':{
				'20':{opacity:1,transform: 'translate3d(-20px, 0, 0)'},
				'100':{opacity: 0, transform: 'translate3d(2000px, 0, 0)'}
			},
			'fadeIn':{
			  '0': {opacity: 0},
			  '100': {opacity: 1}
			},
			'fadeOut':{
			  '0': {opacity: 1},
			  '100': {opacity: 0}
			},
			'flip':{
				'0':{transform: 'perspective(400px) rotate3d(0, 1, 0, -360deg)'},
				'40':{transform: 'perspective(400px) rotate3d(0, 1, 0, -190deg)'},
				'60':{transform: 'perspective(400px) rotate3d(0, 1, 0, -170deg)'},
				'80':{transform: 'perspective(400px) scale3d(.95, .95, .95)', 'animation-timing-function': 'ease-in'},
				'100':{transform: 'perspective(400px)', 'animation-timing-function': 'ease-in'}
			},
			'flipInX':{
				'0':{transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)'},
				'40':{transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)'},
				'60':{transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)'},
				'80':{transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)'},
				'100':{transform: 'perspective(400px)'}
			},
			'flipInY':{
				'0':{transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)'},
				'40':{transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)'},
				'60':{transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)'},
				'80':{transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)'},
				'100':{transform: 'perspective(400px)'}
			},
			'flipOutX':{
				'0':{transform: 'perspective(400px)'},
				'30':{transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: 1},
				'100':{transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: 0}	
			},
			'flipOutY':{
				'0':{transform: 'perspective(400px)'},
				'30':{transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', opacity: 1},
				'100':{transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: 0}	
			},
			'rollIn':{
				'0':{transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)', opacity: 0},
				'100':{transform: 'none', opacity: 1}	
			},
			'rollOut':{
				'0':{transform: 'none', opacity: 1},
				'100':{transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)', opacity: 0}
			},
			'zoomIn':{
				'0':{transform: 'scale3d(.3, .3, .3)', opacity: 0},
				'50':{opacity: 1}
			},
			'zoomOut':{
				'0':{opacity: 1},
				'50':{transform: 'scale3d(.3, .3, .3)', opacity: 0},
				'100':{opacity: 0}
			}
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config){

			this.config = Zepto.extend({}, _static.config, config); // 参数接收

			/**
			 * @alias mo.Animation#
			 * @ignore
			 */
			var self = this;
			var config = self.config;

			/**
			 * 目标动画元素
			 * @type {Object}
			 */
			self.target = Zepto(config.target);

			/**
			 * 关键帧
			 * @type {Object}
			 */

			self.keyframes = {};
			if(config.effect) {
				Zepto.extend(self.keyframes, _private.effect[config.effect]);
			}
			if(config.keyframes) {
				Zepto.extend(self.keyframes, config.keyframes);
			}


			if(self.target.length < 1 || !self.keyframes) {
				return;
			}


			// event binding
			// self.effect && self.on(self.effect);
			config.event && self.on(config.event);

			self.percent = 0;

			self.__setup();

			// attach events
			self.__attach();

			if(config.autoPlay) {
				self.play();
			}
			
		};

		_public.__setup = function(){
			var self = this;
			var config = self.config;
			var prefix = '', eventPrefix,
		    vendors = {webkit: 'webkit', moz: '', O: 'o'},
		    testEl = document.createElement('div'),
		    // supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		    transform,
		    formatTime = function(n){return /^\d+$/.test(n) ? n + 'ms' : n.toString()};
		    

		    for(var key in vendors) {
				if (testEl.style[vendors[key] + 'Animation'] !== undefined) {
					prefix = '-' + key.toLowerCase() + '-';
					eventPrefix = key;
				}
		    }

		    _static.__prefix = prefix;
		    _static.__eventPrefix = eventPrefix;


			// create animate style
			var animateName = 'mo-' + parseInt(Math.random()*1000000);
			var cssText = '@' + prefix + 'keyframes ' + animateName + '{';
			for(var key in self.keyframes) {
				var css = '{';
				var obj = self.keyframes[key];
				for(var prop in obj) {
					var val = obj[prop];
					prop = prop.replace(/([A-Z])/g, function(a,b){return '-' + b.toLowerCase()});
					prop = prop.replace(/easing/g, 'animation-timing');
					prop = prop.replace(/^(?=transform|perspective|transition|animation)/g, prefix);
					css += prop + ':' + val + ';';
				}
				css += '}'
				key = key.replace(/%/g, '');
				key = key.split(',');
				for(var i = 0; i < key.length; i++) {
					cssText += key[i] + '%';
					cssText += css;
				}

			}
			cssText += '}';
			styleElem.appendChild(document.createTextNode(cssText));

			// apply animate
		    var style = self.animationStyle = {};
			if(config.apply) style[prefix + 'animation-name'] = animateName;
			style[prefix + 'animation-duration'] = formatTime(config.duration);
			style[prefix + 'animation-timing-function'] = config.easing;
			style[prefix + 'animation-delay'] = formatTime(config.delay);
			style[prefix + 'animation-direction'] = config.direction;
			style[prefix + 'animation-fill-mode'] = config.fillMode;
			style[prefix + 'animation-play-state'] = config.autoPlay ? 'running' : 'paused';
			style[prefix + 'animation-iteration-count'] = config.iteration.toString();
			self.target.css(style);

			self.animateName = animateName;
			self.target.data('animation-name', animateName);

			self.target.addClass('mo-animation');

		}

		_public.__attach = function(){
			var self = this;
			var config = self.config;


			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationStart', function(e){
				self.__startTime = new Date();
				self.__runtime = 0;
				window.clearInterval(self.__timer);
				self.__timer = window.setInterval(function(){
			// console.log(self.target[0].className);
			// console.log( self);
					if(self.playing) {
						if(config.iteration === 1) {
							var now = new Date();
							self.__runtime += now - self.__startTime;
							self.__startTime = new Date();
							self.percent =  Math.round(self.__runtime * 100/config.duration);
							self.percent = self.percent > 100 ? 100 : self.percent;
						}
						/**
						 * @event mo.Animation#running: 动画播放时
						 * @property {object} event 事件对象
						 */
						self.trigger('running');

					}
				}, 20);

				/**
				 * @event mo.Animation#start: 动画开始时
				 * @property {object} event 事件对象
				 */
				self.trigger('start');
			});
			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationIteration', function(e){
				/**
				 * @event mo.Animation#start: 动画重复时
				 * @property {object} event 事件对象
				 */	
				self.trigger('iteration') 
			});
			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationEnd', function(e){
				self.percent = 100;
				self.trigger('running');

				/**
				 * @event mo.Animation#start: 动画结束时
				 * @property {object} event 事件对象
				 */	
				self.trigger('end');
				window.clearInterval(self.__timer);					
			});
		};


		/**
		 * 播放动画
		 */
		_public.play = function(self){

			this.playing = true;
			this.__startTime = new Date();
			this.target.css(_static.__prefix + 'animation-play-state', 'running');

		};

		_public.getState = function(){
			return this.target.css(_static.__prefix + 'animation-play-state');
		};

		/**
		 * 重新播放动画
		 */		
		_public.rePlay = function(){
			this.__setup();
		};

		/**
		 * 暂停动画播放
		 */
		_public.stop = function(){
			/**
			 * 动画是否正在播放
			 * @type {boolean}
			 */
			this.playing = false;
			this.target.css(_static.__prefix + 'animation-play-state', 'paused');
		};

		/**
		 * 应用动画
		 */
		_public.apply = function(){
			this.target.css(_static.__prefix + 'animation-name', this.animateName);
		};

		/**
		 * 撤消动画
		 */
		_public.revoke = function(){
			this.target.css(_static.__prefix + 'animation-name', '');
		};

		/**
		 * 通过class自动触发动画
		 */
		_static.parse = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.each(function(i, elem){
				elem = Zepto(elem);
				var pars = {
					target: elem
				};
				for(var prop in _static.config) {
					var val = elem.data(prop);
					
					if(val !== null) {
						pars[prop] = val;
					}
					
				}
				new mo.Animation(pars);
			});
		}


		/**
		 * 应用动画
		 */
		_static.apply = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.each(function(i, elem){
				elem = Zepto(elem);
				elem.css(_static.__prefix + 'animation-name', elem.data('animation-name'));
				console.log(_static.__prefix + 'animation-name', elem.data('animation-name'));
			});
		};

		/**
		 * 撤消动画
		 */
		_static.revoke = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.css(_static.__prefix + 'animation-name', '');
		};





	});

})();
})();