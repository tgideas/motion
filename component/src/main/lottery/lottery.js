define(function(require, exports, module){
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.Lottery:mo.Base', function(){
		/**
		 * public 作用域
		 * @alias mo.Lottery#
		 * @ignore
		 */
		var _public = this;

		var _private = {
			/**
			 * 添加样式规则
			 * @param {string} selector 选择器
			 * @param {string} styleObj 样式
			 * @param {number} pos      插入的位置
			 */
			addRule : function(selector, styleObj, pos){
				var text = '';
				var style = document.getElementsByTagName('style')[0];
				if(!style){
					style = document.createElement('style');
					style.type = "text/css";
					document.getElementsByTagName('head')[0].appendChild(style);
				}
				var sheet = style.sheet || style.styleSheet;
				if(typeof styleObj == 'string'){
					text = styleObj;
				}else{
					for(var k in styleObj){
						text += (k + ':' + styleObj[k] + ';');
					}
				}
				pos = pos || 0;
				if('insertRule' in sheet){
					sheet.insertRule(selector + '{' + text + '}', pos)
				}else{
					sheet.addRule(selector, text, pos);
				}
			},
			/**
			 * 检测样式前缀
			 * @return {Object} css和js的前缀
			 */
			detectCSSPrefix : function(){
				var getStyle = window.getComputedStyle;
				var theCSSPrefix
				var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
				var obj = {'js' : '','css' : ''}
				if(!getStyle) {
					return obj;
				}
				var style = getStyle(document.createElement('div'), null);
				var map = {
					'-webkit-': 'webkit',
					'-moz-': 'Moz',
					'-ms-': 'ms',
					'-o-': 'O'
				}
				for(var k in style) {
					theCSSPrefix = (k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes)));
					if(theCSSPrefix) {
						break;
					}
				}
				if(!theCSSPrefix) {
					return obj;
				}

				theCSSPrefix = theCSSPrefix[0];

				if(theCSSPrefix.slice(0,1) === '-') {
					obj['css'] = theCSSPrefix
					obj['js'] = ({
						'-webkit-': 'webkit',
						'-moz-': 'Moz',
						'-ms-': 'ms',
						'-o-': 'O'
					})[theCSSPrefix];
				} else {
					obj['css'] = '-' + theCSSPrefix.toLowerCase() + '-';
					obj['js'] = theCSSPrefix;
				}
				return obj;
			},
			/**
			 * 在指定范围中获取一个随机数
			 * @param  {number} min 最小值
			 * @param  {number} max 最大值
			 * @return {number}     获取到的随机值
			 */
			random : function(min,max){
				return Math.floor(min+Math.random()*(max-min));
			},
			/**
			 * 提取keyframe规则
			 * @param  {string} rule [description]
			 * @return {string}      [description]
			 */
			findKeyframesRule : function (rule){
				var ss = document.styleSheets;
		        for (var i = 0; i < ss.length; ++i) {
		            for (var j = 0; j < ss[i].cssRules.length; ++j) {
		                if (ss[i].cssRules[j].type == (window.CSSRule.WEBKIT_KEYFRAMES_RULE 
		                	|| window.CSSRule.MOZ_KEYFRAMES_RULE 
		                	|| window.CSSRule.O_KEYFRAMES_RULE 
		                	|| window.CSSRule.KEYFRAMES_RULE) 
		                	&& ss[i].cssRules[j].name == rule)
		                    return ss[i].cssRules[j];
		            }
		        }
		        
		        // rule not found
		        return null;
			},
			change : function(anim,style,from, to) {
				var keyframes = _private.findKeyframesRule(anim);
				if(keyframes){
					keyframes.deleteRule("from");
					keyframes.deleteRule("to");
					var insert = function(rule){
						return (keyframes.appendRule && keyframes.appendRule(rule)) || (keyframes.insertRule && keyframes.insertRule(rule));
					}
					insert("from { "+style+": rotateZ("+from+"deg); }");
					insert("to { "+style+": rotateZ("+to+"deg); }");
				}else{
					_private.addRule('@' + _private.prefix + 'keyframes '+anim, 'from { ' + style + ': rotateZ(' + from + 'deg); } to { ' + style + ': rotateZ(' + to + 'deg); }');
				}
			}
		}
		/**
		 * public static作用域
		 * @alias mo.Lottery.
		 * @ignore
		 */
		var _static = this.constructor;

		/**
		 * css前缀
		 * @type {[type]}
		 */
		_private.prefix = _private.detectCSSPrefix().css;

		var Lottery = function(opts){
			var _self = this;
			_self.config = Zepto.extend(true, {}, _static.config, opts); // 参数接收
			var config = _self.config;
			var clsPre = config.contentId;

			var classes = {
				'container' : clsPre + '_container',
				'start' : clsPre + '_start',
				'disable' : clsPre + '_disable',
				'slight' : clsPre + '_slight',
				'hover' : clsPre + '_hover',
				'speed_up' : clsPre + '_speed_up',
				'uniform' : clsPre + '_uniform',
				'slow_down' : clsPre + '_slow_down',
				'bgLight' : clsPre + '_bgLight',
				'borderLight' : clsPre + '_borderLight'
			}

			var startBtn = null, moveBox = null, container = Zepto('#'+config['contentId'])[0];

			//初始化class*/
			var classInit = (function(){

				//抽奖容器的class初始化
				_private.addRule('.' + classes['container'],{
					position : 'relative',
					width : config.width + 'px',
					height : config.height + 'px'
				})
				if(config.r){ //大转盘类
					var startBtn = {
						display : 'block',
						position:'absolute',
						left : '50%',
						top : '50%',
						cursor : 'pointer'
					}
					startBtn[_private.prefix + 'transition'] = 'transform .2s ease-in';
					_private.addRule('.' + classes['start'], startBtn);
					//不可点击状态的抽奖按钮class初始化
					var disableBtn = Zepto.extend(startBtn,{
						cursor:'normal'
					})
					_private.addRule('.' + classes['disable'], disableBtn)

					_private.addRule('.' + classes['start'] + ':hover', {
						transform : 'scale(1.2)'
					})

					_private.addRule('.' + classes['hover'], {
						position:'absolute',
						left : '0',
						top : '0',
						width : config.width + 'px',
						height : config.height + 'px',
						background:"url("+config.b+") no-repeat"
					})

					var speed_up = {}
					speed_up[_private.prefix + 'animation'] = classes['speed_up'] + ' 1s ease-in forwards';
					var uniform = {}
					uniform[_private.prefix + 'animation'] = classes['uniform'] + ' 1s linear forwards';
					var slow_down = {}
					slow_down[_private.prefix + 'animation'] = classes['slow_down'] + ' 1s ease-out forwards';
					_private.addRule('.' + classes['speed_up'], speed_up);
					_private.addRule('.' + classes['uniform'], uniform);
					_private.addRule('.' + classes['slow_down'], slow_down);
					
				}else{
					//初始化keyframe
					_private.addRule('@' + _private.prefix + 'keyframes '+ classes['bgLight'], '0% {background-position: -500px 0}100% {background-position: 500px 0}');
					_private.addRule('@' + _private.prefix + 'keyframes '+ classes['borderLight'] , '0% {box-shadow:0px 0px 10px 10px rgba(255,255,255,.3) inset}100% {box-shadow:0px 0px 20px 20px rgba(255,255,255,.6) inset}')

					//抽奖按钮的class初始化
					var startBtn = {
						position : 'absolute',
						width : config.sbtnw + 'px',
						height : config.sbtnh + 'px',
						left : config.sbtnx + 'px',
						top : config.sbtny + 'px',
						display : 'block',
						outline : 'none'
					}
					//正常状态下的抽奖按钮
					var start = Zepto.extend(startBtn, {
						cursor : 'pointer',
						background : 'url('+ config.starturl +') no-repeat'
					})
					start[_private.prefix + 'backface-visibility'] = 'hidden';
					start[_private.prefix + 'animation'] = classes['borderLight'] + ' 1s infinite alternate';
					_private.addRule('.' + classes['start'], start)

					//不可点击状态的抽奖按钮class初始化
					var disableBtn = Zepto.extend(startBtn,{
						cursor:'normal',
						background:'rgba(0,0,0,.5)'
					})
					_private.addRule('.' + classes['disable'], disableBtn)
					_private.addRule('.' + classes['disable'] + ' .' + classes['slight'], {
						display : 'none'
					})

					//光影效果添加的class初始化
					var slight = {
						width : '100%',
						height : '100%',
						background : 'url(light.png) no-repeat'
					}
					slight[_private.prefix + 'backface-visibility'] = 'hidden';
					slight[_private.prefix + 'animation'] = classes['bgLight'] + ' 3s infinite';
					_private.addRule('.' + classes['slight'],slight)

					var moveLight = {
						position:'absolute',
						left : '0',
						top : '0',
						width : config.boxw + 'px',
						height : config.boxh + 'px',
						display : 'none'
					}
					config.lighturl ? (moveLight['background'] = "url("+config.lighturl+") no-repeat"):(moveLight['box-shadow'] = '0px 0px 10px 10px rgba(255,255,255,.8) inset');
					//移动的光影效果
					_private.addRule('.' + classes['hover'], moveLight);
				}
			})();

			//界面初始化
			var faceInit = (function(){
				var str
				if(config.r){
					str = '<div class="' + classes['container'] + 
					'"><div id="' + classes['hover'] + '" class="' + classes['hover'] + '"></div><img src="'+config.s+'" id="' + classes['start'] + '" class="' + classes['start'] + '"></div>';
				}else{
					str = '<div class="' + classes['container'] + 
					'"><a hidefocus="true" id="' + classes['start'] + '" href="javascript:;" class="' + classes['start'] + 
					'"><div class="' + classes['slight'] + 
					'"></div></a><div id="' + classes['hover'] + '" class="' + classes['hover'] + '"></div></div>';
				}
				container.innerHTML = str;
				startBtn = Zepto('#'+classes['start'])[0];
				moveBox = Zepto('#'+classes['hover'])[0];
				if(config.r){//调整坐标位置
					startBtn.onload = function(){
						startBtn.style.cssText = 'margin-left:' + -(startBtn.width / 2 + config.sx) + 'px; margin-top:' + -(startBtn.height / 2 + config.sy) + 'px';
						startBtn.onload = null;
					}
				}
			})();

			var btn = {
				disable : function(){
					if(startBtn.className ==  classes['disable']){
						return false;
					}
					startBtn.className = classes['disable'];
					return true;
				},
				enable : function(){
					startBtn.className = classes['start'];
				}
			}
			
			var bind = (function(){
				Zepto(startBtn).bind('click touchend', function(){
					btn.disable() && config.onClickRollEvent();
				});

				var animationendNames = [
					'animationend',
					'webkitAnimationEnd',
					'MozAnimationEnd',
					'oAnimationEnd'
				];
				//事件检测绑定
				var animationend = function(elem, callback) {
					var handler = function(e) {
						if (animationendNames) {
							var animationendName = e.type;
							transitionend = function(elem, callback) {
								Zepto(elem).bind(animationendName, callback);
							};
							animationendNames = null;
						}
						return callback.call(elem, e);
					};

					for (var i=0, len=animationendNames.length; i<len; i++) {
						Zepto(elem).bind(animationendNames[i], handler);
					}
				};
				if(config.r){
					animationend(moveBox, function(){
						if(Zepto(moveBox).hasClass(classes['speed_up'])){
							Zepto(moveBox).removeClass(classes['speed_up'])
							setTimeout(function(){
								Zepto(moveBox).addClass(classes['uniform']);
							},0)
						}else if(Zepto(moveBox).hasClass(classes['uniform'])){
							Zepto(moveBox).removeClass(classes['uniform']);
							setTimeout(function(){
								Zepto(moveBox).addClass(classes['slow_down']);
							},0)
						}else{
							btn.enable();
							config.onCompleteRollEvent();
						}
					})
				}
			})();

			//处理步骤
			var step = [];
			var parseStep = (function(){
				if(config.r){
					var each = 360/config.r;
					for(var i = 0; i < config.r; i++){
						step.push(i * each);
					}
				}else{
					var arr = config.position.split(',');
					Zepto.each(arr, function(i, v){
						var pos = v.split('_');
						step.push({
							left : pos[0],
							top : pos[1]
						})
					})
				}
			})();

			var curIndex = 0;
			//运动到下一个奖品
			var moveNext = function(){
				if(++curIndex >= config.total){
					curIndex = 0;
				}
				var curInfo = step[curIndex]
				moveBox.style.cssText = "display:block;left:"+curInfo.left+'px;top:'+curInfo.top+'px;';
			}

			var fastTime = 30, slowTime = 300, rdis = 8;
			this.stopRoll = function(id){
				if(config.r){
					_private.change(classes['speed_up'], _private.prefix + 'transform' , 360 - step[curIndex], step[curIndex] + 720);
					_private.change(classes['uniform'], _private.prefix + 'transform' , 360 - step[curIndex] - rdis, 360 * 3 + step[id]);
					_private.change(classes['slow_down'], _private.prefix + 'transform' , step[id] + rdis, 720 - step[id]);
					Zepto(moveBox).addClass(classes['speed_up']);
					curIndex = id;
				}else{
					var ani = function(t, b, c, d){return c * t / d + b;}
					var dis = id - curIndex;
					var stepCounts = dis + config.total * _private.random(3,7) -1;   //3到6圈之间随机转
					var speedUp, uniform , slowDown;
					uniform = config.total * 2;
					speedUp = Math.floor((stepCounts - uniform)/3);
					uniform += speedUp;
					slowDown = stepCounts;
					var index = 0, slowT = 0;
					var moveFunc = function(){
						moveNext();
						if( ++index > stepCounts){
							btn.enable();
							config.onCompleteRollEvent();
							return;
						}
						var moveTime, t = index, b = slowTime, c = fastTime - slowTime , d = speedUp;

						if(index <= speedUp){//加速
							moveTime = ani(t,b,c,d);
						}
						if(index > speedUp){ //匀速
							moveTime = fastTime;
						}
						if(index > uniform){//减速
							t = slowT++ 
							b = fastTime;
							c = slowTime - fastTime;
							d = slowDown - uniform;
							moveTime = ani(t,b,c,d);
						}
						setTimeout(moveFunc, moveTime)
					}
					setTimeout(moveFunc, slowTime);
				}
			}

		}

		// 插件默认配置
		_static.config = {
			'lighturl':'',//外部光圈png  不填写就用默认的效果
			'starturl':'',//外部按钮png  不填写就用默认的按钮效果
			'width':800,//flash 宽度
			'height':660,//flash 高度
			'total':18,//抽奖产品的总数
			'sbtnx':239,// 开始抽奖按钮的位置x坐标
			'sbtny':130	,// 开始抽奖按钮的位置y坐标
			'sbtnw':320,// 开始抽奖按钮的宽度
			'sbtnh':100,// 开始抽奖按钮的高度
			'boxw':100,// 奖品光效的宽度
			'boxh':100,//奖品光效的高度  
			'position':"19_20,128_20,238_20,348_19,459_19,568_19,679_19,19_129,128.8_129,568_129,678_129,19_240,128_240,238_240,349_240,459_239,569_239,679_239",
			//奖品光效的位置，对应奖品图片的布局，填入每个奖品的位置以及角度用逗号分割  x_y_rotation（角度为0的可以不填写） 例如19_20或者19_20_0 表示第一个奖品的位置 x坐标为19px y坐标为20px 角度为0。）
			'contentId' : 'swfcontent',//嵌入swf 的div层的 id 
			'onClickRollEvent' : function(){},//对应上面接口
			'onCompleteRollEvent':function(){}, //对应上面接口
			//================以下的参数配置为转盘类的==============================
			'r' : null,//奖品总数
			'b':'http://ossweb-img.qq.com/images/flash/lottery/circle/g.png',//圆盘的图片 文件格式可以是swf、png、jpg（建议swf 可以压缩）
			's':'http://ossweb-img.qq.com/images/flash/lottery/circle/z.png',//开始抽奖按钮图片
			'bx':0,//圆盘的图片位置x坐标 （转盘的中心点坐标为（0,0））
			'by':0,//圆盘的图片位置y坐标
			'sx':0,//开始抽奖按钮x坐标
			'sy':0//开始抽奖按钮y坐标
		};

		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = Lottery;

	});
});