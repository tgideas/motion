/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-07-11
 * @description 图片编辑器
 * @extends mo.Base
 * @name mo.ImageEditor
 * @requires zepto.js
 * @requires base.js
 * @param {zepto object} config.trigger 文件获取控件，如<input type="file" />
 * @param {zepto object} config.container 图片编辑容器
 * @param {number} [config.width=320] 编辑器宽度
 * @param {number} [config.height=320] 编辑器高度
 * @param {object} config.iconScale 缩放图标 eg. {url: 'img/icon.png',rect: [300, 300, 25, 25]}
 * @param {object} config.iconClose 关闭图标 eg. {url: 'img/icon.png',rect: [300, 300, 25, 25]}
 * @see image-editor/demo1.html 图片合成（新窗口或扫描二维码测试）
 * @class
 */
define(function(require, exports, module) {
	require('../motion/motion.js');
	require('../base/base.js');
	require('../../resource/quark.base-1.0.0.js');
	require('../../resource/binaryajax.js');
	require('../../resource/exif.js');
	require('../../resource/jpeg_encoder_basic.js');

	Motion.add('mo.ImageEditor:mo.Base', function() {

		/**
		 * public 作用域
		 * @alias mo.ImageEditor#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.ImageEditor.
		 * @ignore
		 */
		var _static = this.constructor;



		// 插件默认配置
		_static.config = {
			width: 320,
			height: 320,
			fps: 60
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config) {
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收


			var self = this;
			var config = self.config;

			// 自定义事件绑定
			self.effect && self.on(self.effect);
			config.event && self.on(config.event);

			/**
			 * @event mo.ImageEditor#beforeinit
			 * @property {object} event 开始初始化前
			 */
			if (self.trigger('beforeinit') === false) {
				return;
			}

			// 创建canvas
			var canvas = Quark.createDOM('canvas', {
				width: config.width,
				height: config.height,
				style: {
					backgroundColor: "#fff"
				}
			});
			canvas = $(canvas).appendTo(config.container)[0];



			var context = new Quark.CanvasContext({
				canvas: canvas
			});

			/**
			 * 舞台
			 * @name mo.ImageEditor#stage
			 * @type quark object
			 */
			self.stage = new Quark.Stage({
				width: config.width,
				height: config.height,
				context: context
			});
			self.canvas = canvas;

			/**
			 * canvas context
			 * @name mo.ImageEditor#context
			 * @type  object
			 */
			self.context = context;

			// register stage events
			var em = this.em = new Quark.EventManager();
			em.registerStage(self.stage, ['touchstart', 'touchmove', 'touchend'], true, true);
			self.stage.stageX = config.stageX !== window.undefined ? config.stageX : self.stage.stageX;
			self.stage.stageY = config.stageY !== window.undefined ? config.stageY : self.stage.stageY;

			var timer = new Quark.Timer(1000 / config.fps);
			timer.addListener(self.stage);
			timer.addListener(Quark.Tween);
			timer.start();

			var bg = new Q.Graphics({
				width: config.width,
				height: config.height
			});
			bg.beginFill("#fff").drawRect(0, 0, config.width, config.height).endFill().cache();
			self.stage.addChild(bg)

			_private.attach.call(self);
		};



		_private.attach = function() {
			var self = this;
			var config = self.config;

			config.trigger.on('change', function(e) {

				/**
				 * @event mo.ImageEditor#beforechange
				 * @property {object} event 选择完文件准备读取前
				 */
				self.trigger('beforechange');

				// 只上传一个文件
				var file = this.files[0];


				// 限制上传图片文件
				if (file.type && !/image\/\w+/.test(file.type)) {
					alert('请选择图片文件！');
					return false;
				}

				var fr = new FileReader();
				fr.readAsDataURL(file);



				fr.onload = function(fe) {
					var result = this.result;
					var img = new Image();
					var exif;
					img.onload = function() {
						self.addImage({
							img: img,
							exif: exif
						});

						/**
						 * @event mo.ImageEditor#change
						 * @property {object} 文件选择完毕时
						 */
						self.trigger('change');
					};
					// 转换二进制数据
					var base64 = result.replace(/^.*?,/, '');
					var binary = atob(base64);
					var binaryData = new BinaryFile(binary);

					// get EXIF data
					exif = EXIF.readFromBinaryFile(binaryData);

					img.src = result;

				};



			});


			self.stage.addEventListener('touchstart', function(e) {
				if (self.imgs) {
					for (var i = 0; i < self.imgs.length; i++) {
						self.imgs[i].disable();
					}
				}
				if (e.eventTarget && e.eventTarget.parent.enEditable) {
					e.eventTarget.parent.enEditable();
					self.activeTarget = e.eventTarget.parent;
				}
			});
			self.stage.addEventListener('touchmove', function(e) {
				var touches = e.rawEvent.touches || e.rawEvent.changedTouches;
				if (e.eventTarget && (e.eventTarget.parent == self.activeTarget) && touches[1]) {
					var dis = Math.sqrt(Math.pow(touches[1].pageX - touches[0].pageX, 2) + Math.pow(touches[1].pageY - touches[0].pageY, 2));
					if (self.activeTarget.mcScale.touchDis) {
						var scale = dis / self.activeTarget.mcScale.touchDis - 1;
						if (self.activeTarget.getCurrentWidth() < 100 && scale < 0) {
							scale = 0;
						}

						self.activeTarget.scaleX += scale;
						self.activeTarget.scaleY += scale;
					}
					self.activeTarget.mcScale.touchDis = dis;
				}
			});
			self.stage.addEventListener('touchend', function() {
				if (self.activeTarget && self.activeTarget.mcScale) {
					delete self.activeTarget.mcScale.touchDis;
				}
			});


		};

		/**
		 * 添加图片
		 * @param {object} page eg.{img: document.querySelector('#img3'), 'disMove': true, disScale: true}
		 */
		_public.addImage = function(info) {
			var self = this;
			var config = self.config;
			var img = info.img;
			var exif = info.exif;
			var imgContainer;
			var mcScale;
			var mcClose;
			var imgWidth = img.width;
			var imgHeight = img.height;
			var imgRotation = 0;
			var imgRegX = 0;
			var imgRegY = 0;
			var imgX = 0;
			var imgY = 0;
			var posX = info.pos ? info.pos[0] : 0;
			var posY = info.pos ? info.pos[1] : 0;
			var imgScale = 1;
			var orientation = exif ? exif.Orientation : 1;
			var getRatio = function(img) {
				if (/png$/i.test(img.src)) {
					return 1;
				}
				var iw = img.naturalWidth,
					ih = img.naturalHeight;
				var canvas = document.createElement('canvas');
				canvas.width = 1;
				canvas.height = ih;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				var data = ctx.getImageData(0, 0, 1, ih).data;
				var sy = 0;
				var ey = ih;
				var py = ih;
				while (py > sy) {
					var alpha = data[(py - 1) * 4 + 3];
					if (alpha === 0) {
						ey = py;
					} else {
						sy = py;
					}
					py = (ey + sy) >> 1;
				}
				var ratio = (py / ih);
				return (ratio === 0) ? 1 : ratio;
			}
			var ratio = getRatio(img);


			// window.setTimeout(function(){
			// 	alert(imgContainer.width);
			// 	alert(img);
			// }, 5000)




			if (typeof img == 'string') {
				var url = img;
				img = new Image();
				img.src = url;
			}


			// 判断拍照设备持有方向调整照片角度
			switch (orientation) {
				case 3:
					imgRotation = 180;
					imgRegX = imgWidth;
					imgRegY = imgHeight * ratio;
					// imgRegY -= imgWidth * (1-ratio);
					break;
				case 6:

					imgRotation = 90;
					imgWidth = img.height;
					imgHeight = img.width;
					imgRegY = imgWidth * ratio;
					// imgRegY -= imgWidth * (1-ratio);
					break;
				case 8:
					imgRotation = 270;
					imgWidth = img.height;
					imgHeight = img.width;
					imgRegX = imgHeight * ratio;

					if (/iphone|ipod|ipad/i.test(navigator.userAgent)) {
						alert('苹果系统下暂不支持你以这么萌！萌！达！姿势拍照！');
						return;
					}

					break;


			}
			imgWidth *= ratio;
			imgHeight *= ratio;


			if (imgWidth > self.stage.width) {
				imgScale = self.stage.width / imgWidth;
			}

			imgWidth = imgWidth * imgScale;
			imgHeight = imgHeight * imgScale;

			imgContainer = new Quark.DisplayObjectContainer({
				width: imgWidth,
				height: imgHeight
			});
			imgContainer.x = posX;
			imgContainer.y = posY;


			img = new Quark.Bitmap({
				image: img,
				regX: imgRegX,
				regY: imgRegY
			});
			img.rotation = imgRotation;
			img.x = imgX;
			img.y = 0;
			img.scaleX = imgScale * ratio;
			img.scaleY = imgScale;





			if (config.iconScale && !info.disScale) {
				var iconScaleImg = new Image();
				iconScaleImg.onload = function() {
					var rect = config.iconScale.rect;
					mcScale = new Quark.MovieClip({
						image: iconScaleImg
					});
					mcScale.addFrame([{
						rect: rect
					}]);
					mcScale.x = imgWidth - rect[2];
					mcScale.y = 0;
					mcScale.alpha = 0.5;
					mcScale.visible = false;
					mcScale.addEventListener('touchstart', function(e) {
						mcScale.scaleable = true;
						mcScale.startX = e.eventX;
						mcScale.startY = e.eventY;
						mcScale.alpha = 0.8;
						var curW = imgContainer.getCurrentWidth();
						var scaleMove = function(e) {
							if (mcScale.scaleable) {
								// 缩放
								var disX = e.eventX - mcScale.startX;
								var scaleX = (curW + disX) / imgContainer.width;

								if (imgContainer.getCurrentWidth() < 100 && imgContainer.scaleX > scaleX) {
									return;
								}

								imgContainer.scaleX = scaleX;
								imgContainer.scaleY = scaleX;

								// 旋转
								var disOriX = e.eventX - imgContainer.x;
								var disOriY = e.eventY - imgContainer.y;
								var rotate = Math.atan2(disOriY, disOriX) * 360 / (2 * Math.PI);
								imgContainer.rotation = parseInt(rotate / 1) * 1;
							}
						};
						var scaleEnd = function(e) {
							mcScale.scaleable = false;
							mcScale.alpha = 0.5;
							self.stage.removeEventListener('touchmove', scaleMove);
							self.stage.removeEventListener('touchend', scaleEnd);
						}
						self.stage.addEventListener('touchmove', scaleMove);
						self.stage.addEventListener('touchend', scaleEnd);
					});
					imgContainer.mcScale = mcScale;
					imgContainer.addChild(mcScale);
				};
				iconScaleImg.src = config.iconScale.url;
			}

			var border = new Q.Graphics({
				width: imgWidth + 10,
				height: imgHeight + 10,
				x: -5,
				y: -5
			});
			border.lineStyle(5, "#aaa").beginFill("#fff").drawRect(5, 5, imgWidth, imgHeight).endFill().cache();
			border.alpha = 0.5;
			border.visible = false;
			imgContainer.addChild(border);

			if (config.iconClose) {
				var iconCloseImg = new Image();
				iconCloseImg.onload = function() {
					var rect = config.iconClose.rect;
					mcClose = new Quark.MovieClip({
						image: iconCloseImg
					});
					mcClose.addFrame([{
						rect: rect
					}]);
					mcClose.x = 0;
					mcClose.y = 0;
					mcClose.alpha = 0.5;
					mcClose.visible = false;
					mcClose.addEventListener('touchstart', function(e) {
						mcClose.alpha = 0.8;
					});
					mcClose.addEventListener('touchend', function(e) {
						self.stage.removeChild(imgContainer);
					});
					self.stage.addEventListener('touchend', function(e) {
						mcClose.alpha = 0.5;
					});
					imgContainer.addChild(mcClose);
				};
				iconCloseImg.src = config.iconClose.url;
			}


			if (!info.disMove && !info.disable) {
				img.addEventListener('touchstart', function(e) {
					var fnMove;
					var fnEnd;
					// 拖动
					img.curW = imgContainer.getCurrentWidth();
					img.curH = imgContainer.getCurrentHeight();
					img.moveabled = true;
					img.startX = e.eventX;
					img.startY = e.eventY;

					fnMove = function(e) {
						// 是否双指按下
						var isScale = e.rawEvent && e.rawEvent.touches[1];

						if (img.moveabled && !isScale) {
							var disX = e.eventX - img.startX;
							var disY = e.eventY - img.startY;
							var setX = imgContainer.x + disX;
							var setY = imgContainer.y + disY;

							var diffX = 0,
								diffY = 0;

							if (setX < -img.curW / 2 + 5 && disX < 0) {
								setX = -img.curW / 2;
							}
							if (setY < -img.curH / 2 + 5 && disY < 0) {
								setY = -img.curH / 2;
							}
							if (setX > -img.curW / 2 + self.stage.width - 5 && disX > 0) {
								setX = self.stage.width - img.curW / 2;
							}
							if (setY > self.stage.height - 5 && disY > 0) {
								setY = self.stage.height;
							}

							imgContainer.x = setX;
							imgContainer.y = setY;
							img.startX = e.eventX;
							img.startY = e.eventY;
						}
					};

					fnEnd = function() {
						img.moveabled = false;
						self.stage.addEventListener('touchmove');
						self.stage.addEventListener('touchend');
					}
					self.stage.addEventListener('touchmove', fnMove);
					self.stage.addEventListener('touchend', fnEnd);


				});
			}


			imgContainer.enEditable = function() {
				if (info.disable) {
					return;
				}
				border.visible = true;
				if (mcScale) {
					mcScale.visible = true;
				}
				if (mcClose) {
					mcClose.visible = true;
				}
			}
			imgContainer.disable = function() {
				border.visible = false;
				if (mcScale) {
					mcScale.visible = false;
				}
				if (mcClose) {
					mcClose.visible = false;
				}
			}


			img.update = function() {
				if (imgContainer && imgContainer.scaleX) {
					if (mcScale && mcScale.scaleX) {
						mcScale.scaleX = 1 / imgContainer.scaleX;
						mcScale.scaleY = 1 / imgContainer.scaleY;
						mcScale.x = border.getCurrentWidth() - 10 - mcScale.getCurrentWidth();
					}
					if (mcClose && mcClose.scaleX) {
						mcClose.scaleX = 1 / imgContainer.scaleX;
						mcClose.scaleY = 1 / imgContainer.scaleY;
						mcClose.x = 0;
					}
				}

			}


			// imgContainer.rotation = 10;

			imgContainer.addChild(img);


			self.stage.update = function() {
				// console.log(0)
				// img.rotation  ++;
			}





			imgContainer.update = function() {
				// this.rotation  ++;
			}


			self.stage.addChild(imgContainer);



			/**
			 * 所有图片对象
			 * @name mo.ImageEditor#imgs
			 * @type  array
			 */
			if (self.imgs) {
				self.imgs.push(imgContainer);
			} else {
				self.imgs = [imgContainer];
			}




			// self.imgContainer.addEventListener('touchend', function(){
			// 	alert('sss')
			// });

			return imgContainer;


		};

		/**
		 * 清除画布
		 */
		_public.clear = function() {
			if (this.imgs) {
				for (var i = 0; i < this.imgs.length; i++) {
					this.stage.removeChild(this.imgs[i]);
				}
			}
		};

		/**
		 * 画布失去焦点
		 */
		_public.unSelect = function() {
			var imgs = this.imgs;
			if (imgs) {
				for (var i = 0; i < imgs.length; i++) {
					imgs[i].disable();
				}
			}
		};

		/**
		 * 导出base64数据
		 */
		_public.toDataURL  = function(callback) {
			var self = this;
			// 去除编辑状态的元素
			self.unSelect();

			// 已测手机QQ浏览器canvas.toDataURL有问题，使用jeegEncoder
			window.setTimeout(function() {
				var  encoder  =  new  JPEGEncoder();
				var data =  encoder.encode(self.canvas.getContext('2d').getImageData(0, 0, self.stage.width, self.stage.height),  90);
				callback.call(self, data);
			}, 1000 / self.config.fps)
		}

	});


});