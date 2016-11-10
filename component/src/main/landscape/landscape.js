/**
 * @author lyushine
 * @version 1.0
 * @date 2015-06-18
 * @description 当用户切换横竖屏时，给予友好提示。
 * @extends mo.Base
 * @name mo.Landscape
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {string} [config.pic] 图片地址 如'http://ossweb-img.qq.com/images/js/landscape/landscape.png'
 * @param {number}  [config.picZoom=2] 图片缩放比例 如 2 
 * @param {number}  [config.zIndex=99] 层级覆盖z-index值 
 * @param {string}  [config.mode=portrait] 页面模式，如'portrait'或'landscape'
 * @param {string}  [config.bgcolor=#32373b] 背景色,如 '#000'
 * @param {string}  [config.txt='为了更好的体验，请将手机/平板竖过来'] 提示文字, 如 '为了更好的体验，请将手机/平板竖过来'
 * @param {string}  [config.txtColor='#ffd40a'] 提示文字颜色 如'#ffd40a'
 * @param {string}  [config.prefix=Shine] 前缀 如 'Shine'
 * @param {object{string:function}}  [config.init] 组件初始化后的回调
 * @param {object{string:function}}  [config.landback] 友好提示显示后的回调
 * @example
	var Landscape = new mo.Landscape({}); 
 * @see landscape/demo1.html   横屏切换提示
 * @see landscape/demo2.html   竖屏切换提示
 * @class
 */
define(function(require, exports, module) {
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.Landscape:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Landscape#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Landscape.
		 * @ignore
		 */
		var _static = this.constructor;


		// 插件默认配置
		_static.config = {
			'pic' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAGECAMAAADujQ6aAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUU3RTZCMTVGMjA5MTFFMzk2MTM5MzA1MEQ1NDk5QkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUU3RTZCMTZGMjA5MTFFMzk2MTM5MzA1MEQ1NDk5QkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RTdFNkIxM0YyMDkxMUUzOTYxMzkzMDUwRDU0OTlCRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RTdFNkIxNEYyMDkxMUUzOTYxMzkzMDUwRDU0OTlCRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjSrkmgAAAMAUExURfDw8JydnbS1tYp7Jri5uYJ0KMTFxf/kAHt+gfvbRf7WHPrpStzc3PHv5vHv5PjODPLuy/jhdP7nF5iFI/vRC7+jGfrpUlVSM2NnaklNUfTorFpVMsvLy9/f37/AwvreWqOOIP3ZMt26EvngbW5ydTU5Ov/eAP7VFv/ZALi6u//QAP/OAF5ZMOvFDzk9OdGxFfXnokpJNffigf7mC//iAP/UDnpuKv/UDK+xs+3GDredG+O+EbKZHPHu4XFnLGpiLsKlGWVeL/vbQX9yKf/UCuTAELSbHPDw7a2VHvLry45+JfToss+vFs3NzfrdU/nfYp2JIUZGNv///25lLUJDNzY6OlFPNOfn5//mALugGnZrK56fn/Dw7v7TCv39/frcT9PT0+bm5qOkpLq7u/Xmn+fCEOXl5fzSC6eoqPPLDe7u7ti2E/Ls0PTptcXGxv7+/vvcSzQ5Pf7WHvLs0aWmpq2urvLv172/wP/mAry9vfv7+/zaOPzaOf/EAE9NNOPk5Orq6v7XIfT09MnKyvHx8fvpQP/FAO/IDsrLzKanp/XmoPj4+OTk5KSlpffODOLi4tjY2PLv0f7nD66wsf/UAJWDI/Lv0p2entDR0ffshv3YKv/HAD9BOKqrq6usrNzd3v/UC9SzFPfrgPDIDqeRH/3nIpSXmf7nDbO0tJKVl9vc3NLS0s/Pz/XNDKqTHtTU1NXV1f3nIP/WANKyFbO0tsytFvLy89DQ0PHy8nJoLNfX1+Xm5mBaMHp9f/f398epF/z8/PPz8zg7Ojw+OePj4/Dv6saoGMbGxre5u93e3rGysuS/Ebm7vJ+goHNpK9a1FMvMzf3TCujCEPDw7+zs7PvpPod4J8usFv/TAPLt1vbNDENEN3RpK9TV1f3SC/r6+v/gAP3XIeC9EWxjLbq6ure4uPLKDfvcT7qfG/Ls0/PrxfHu3sDCw/zaPPHJDXx/gkxLNfTpufLszf7WG8iqF+jDD/Tpt/jie2dgLvPqu/Pqv//VEUBCOP3XI/PqwAAAAAAPH/AAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAK3klEQVR42uzdeVxU5RoH8Dkhi3qJTAoIJFJA3KWSm2uhr2bbTZ68zdgwIKCyKURGBIUgImIsWmqaaWCapZVZmvuW2mL7avtyU7r75e77vW8z4nIO68zhnDnved/n+QtmnuFzfl/Oec/7vjOfz1io23XDAsphWdxvJcHTjokNQMiwBMEBCBkRLjgA+WDqdLEBCPnhZIzYAIT0TxQcgJAZ8YIDkKC+wzkHiL/eJ2rqr2bIiihr9lf8Avx30pRhpOv6NIRPgOsvCybuVeamdfwB7H2PeFBLfGP4Ahi6g3hYuQc4Avh51DfE43KMSeIFIH4HUVXP38wHQOJGdfmJqTcKLgBMCFIX//tTfIwBEzJVnv5H+RgEE+vVxHeMS6KUC4A7s9Xk3zCUl5ng0VwV8Uf78rAv0AKwqZ18wbdu85l0l6xaTYOj1lHKC8BQR5uL+68JxzpdDh8OoZQbgJg2F8DL4Z3vB7z1Llc7Qr6t4tf7dr4hUr9qOOUJIGasMv+HIZ3vCI2Jp5QrgARl/rHxnW6J5SZSyhnACOUKv8OJvevZjVxtibcALFDcAhx30I4BMrdNp5Q7gL6KE2Bcx63t3xvMD6C4BwZ1MsAlUB7L8qXiCoiiopVlgmJ+myQewCo5wGtUPIApcgAfAQEUG6HhAgJ8KJ8EHBMQQL4VtIQKCCC/C04WEUA+BPQXHWA2AiAAAggNsFF0gGwEQACxAepFByAIICCA6lcWhG4p2rrnWzC2vt2ztWhLaIH3AaLfAJbqjWjvAhysBsgvX1NcmP6OZGy9k15YvKY8H6D6oPcAwooAKiKyJHYqK6ICIDLMSwABFqjJs0tslT2vBioDvAKwAuBEncRe1Z0AWOEFgJ2Q4iexWX4psFN3gBVQclpitU6XeH4OeAjQDCkZEruVkQLNugKEVYKfxHL5wa4wPQEi4YTEdjXA73QECICaOsYB0g95eBF4BPA+4xdAy0Xwvm4A0fCKnXkA+ysQrRfAIIiQ2K8IGKQTQAHkZ5kAICsfCvQB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',
			'mode' : 'portrait',
			'bgcolor' : '#32373b',
			'txtColor': '#ffd40a',
			'prefix':'Shine',
			'picZoom':2,
			'txt':false,
			'zIndex':99,
			'init':false,
			'landback':false
		};
		_public.init = function(config){
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			var _this = this;
			var config = this.config;

			if(!(_this.option.txt)){
				if( option.mode == 'portrait' || option.mode =="" ){
					_this.option.txt = decodeURIComponent('%E4%B8%BA%E4%BA%86%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%BD%93%E9%AA%8C%EF%BC%8C%E8%AF%B7%E5%B0%86%E6%89%8B%E6%9C%BA%2F%E5%B9%B3%E6%9D%BF%E7%AB%96%E8%BF%87%E6%9D%A5');
				}else _this.option.txt = decodeURIComponent('%E4%B8%BA%E4%BA%86%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%BD%93%E9%AA%8C%EF%BC%8C%E8%AF%B7%E5%B0%86%E6%89%8B%E6%9C%BA%2F%E5%B9%B3%E6%9D%BF%E6%A8%AA%E8%BF%87%E6%9D%A5');
			}
			function createCss(){
				var cssBlock = 
				'.'+_this.option.prefix+'_landscape{width:100%; height:100%; background:'+_this.option.bgcolor+';position: fixed; left:0; right:0; top: 0; bottom:0;z-index:'+_this.option.zIndex+'; display:none; text-align: center;}'
				+'.'+_this.option.prefix+'_landscape_box{position: relative; margin-left: auto; margin-right: auto; top: 50%; transform:translateY(-50%); -webkit-transform:translateY(-50%);}'
				+'.'+_this.option.prefix+'_landscape span{font-size:22px;display:block;color:'+_this.option.txtColor+'; text-align:center;width: 100%;padding-top: 10px; line-height:2;}'
				+'.'+_this.option.prefix+'_landscape img{width:auto !important;-webkit-animation: '+_this.option.prefix+'_landscapeAni 1.5s ease infinite alternate;animation: '+_this.option.prefix+'_landscapeAni 1.5s ease infinite alternate;}'
				+'@-webkit-keyframes '+config.prefix+'_landscapeAni{0% {-webkit-transform:rotate(0deg);}30% {-webkit-transform:rotate(0deg);}70%{-webkit-transform:rotate(90deg);}100% {-webkit-transform:rotate(90deg);}}'
				+'@keyframes '+config.prefix+'_landscapeAni{0% {transform:rotate(0deg);}30% {transform:rotate(0deg);}70%{transform:rotate(90deg);}100% {transform:rotate(90deg);}}';
				var style = document.createElement("style");
			    style.type = "text/css";
			    style.textContent = cssBlock;
			    document.getElementsByTagName("HEAD").item(0).appendChild(style);
			}
			function createDom(){
				var landscapeDom = document.createElement("div");
			    landscapeDom.className= config.prefix+'_landscape';
			    landscapeDom.id = config.prefix+'_landscape'; 
			    landscapeDom.innerHTML = '<div class="'+config.prefix+'_landscape_box"><img src="'+config.pic+'" id="'+config.prefix+'_landscape_pic'+'" /><span>'+config.txt+'</span></div>';
			    document.getElementsByTagName("body")[0].appendChild(landscapeDom);
				var img_url = _this.pic;
				var img = new Image();
				img.src = config.pic;
				img.onload = function(){
				    document.getElementById(config.prefix+'_landscape_pic').width = parseInt(img.width/config.picZoom);
			    	document.getElementById(config.prefix+'_landscape_pic').height = parseInt(img.height/config.picZoom);
				};
			}
			function landscape(){
				if(_this.option.init){ _this.option.init();}
			 	if(document.documentElement.clientWidth > document.documentElement.clientHeight){
		            document.getElementById(_this.option.prefix+'_landscape').style.display = (_this.option.mode=="portrait"?"block":"none");
		        }else{
		        	document.getElementById(_this.option.prefix+'_landscape').style.display = (_this.option.mode=="portrait"?"none":"block");
		        }  
			}
			createCss();
			createDom();  
			window.addEventListener('DOMContentLoaded',function(){
				 var sUserAgent = navigator.userAgent.toLowerCase();
				if (sUserAgent.indexOf("android") != -1||sUserAgent.indexOf("ipad") != -1||sUserAgent.indexOf("iphone") != -1) {
					setTimeout(function(){
						landscape();
					},50);
				}
			});
			window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(){
				if(window.orientation==180 || window.orientation==0 || window.orientation==90 || window.orientation==-90){
					landscape();
					if(_this.option.landback){
		                _this.option.landback();
		            }
				}
			}, false);
		};
	});
});
