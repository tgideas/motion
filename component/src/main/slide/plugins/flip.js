define(function(require, exports, module) {
	mo.Tab.extend('flip', {
		init: function() {
			var self = this;
			var config = self.config;
			var cssPrefix = self.cssPrefix;

			// 初始化样式
			var wrapCss = {'position': 'relative'};
			wrapCss[cssPrefix + 'perspective'] = '200px';
			wrapCss[cssPrefix + 'backface-visibility'] = 'hidden';
			self.wrap.css(wrapCss);

			var targetCss ={
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'display': 'none'
			};
			targetCss[cssPrefix + 'transform-origin'] = '50% 0%';
			self.target.css(targetCss);


			// 设置不同方向不同的操作属性
			if (config.direction == 'x') {
				self.translateProp = 'translateX'; 
				self.rotateProp = 'rotateY'; 
				self.size = self.wrap.width();
			} else {
				self.translateProp = 'translateY'; 
				self.rotateProp = 'rotateX'; 
				self.size = self.wrap.height();
			}

		},

		touchmove: function(e, startDis, moveDis){
			var self = this;
			var plus;
			if(self.moving == true) {
				return;
			}

			// 判断是否是锁定屏
			var locked = false;
			if( (self.disabledNextList.indexOf(self.curPage) !== -1 && moveDis < 0) || (self.disabledPrevList.indexOf(self.curPage) !== -1 && moveDis > 0)) {
				locked = true;
			}

			if(locked) {
				startDis = startDis/12;
			}
					

			var targetPage;
			var targetObj;
			var pos = {};

			if(startDis < 0) {
				targetPage = self.oriCurPage + 1;
				pos[self.cssPrefix + 'transform'] = self.translateProp + '(' + (startDis + self.size) + 'px)';
				pos[self.cssPrefix + 'transform-origin'] = '50% 0%';
			} else {
				targetPage = self.oriCurPage - 1;
				pos[self.cssPrefix + 'transform'] = self.translateProp + '(' + (startDis - self.size) + 'px)';
				pos[self.cssPrefix + 'transform-origin'] = '50% 100%';
			}
			targetObj = self.target.eq(self._outBound(targetPage));
			self.target.css({
				'zIndex': 1,
				'display': 'none'
			});
			self.target.eq(self.curPage).css({'display': 'block', 'zIndex': '2'});
			targetObj.css({'display': 'block', 'zIndex': '3'});
			targetObj.css(pos);
			self._targetPage = targetPage;

			var curPos = {};
			var angle = -Math.abs(30 * startDis/self.size);
			if(startDis < 0) {
				curPos[self.cssPrefix + 'transform-origin'] = '50% 0%';
			} else {
				curPos[self.cssPrefix + 'transform-origin'] = '50% 100%';
				angle = -angle;
			}
			curPos[self.cssPrefix + 'transform'] = self.rotateProp + '(' + angle + 'deg)';
			self.target.eq(self.curPage).css(curPos);

		},


		beforechange: function() {
			var self = this;
			var config = self.config;
			var curObj = self.target.eq(self.curPage);
			self.target.css({'display': 'none', 'zIndex': '1'});
			curObj.css({'display': 'block', 'zIndex': '3'});

			if(self.prevPage !== window.undefined) {
				var prevPos = {};
				var lastAngle = self.oriCurPage > self.oriPrevPage ? -90 :  90;

				self.target.eq(self.prevPage).css({'display': 'block', 'zIndex': '2'});

				prevPos[self.cssPrefix+'transform'] = self.rotateProp + '('+ lastAngle +'deg)';
				self.target.eq(self.prevPage).animate(prevPos, config.animateTime, config.easing, function(){
					var prevLastPos = {};
					prevLastPos[self.cssPrefix+'transform'] = self.rotateProp + '('+ lastAngle + 'deg)';
					self.target.eq(self.prevPage).css(prevLastPos);
				});
			}



			if(self._targetPage !== self.oriCurPage) {
				var targetPos = {}, targetVal;
				var targetObj = self.target.eq(self._outBound(self._targetPage));
				targetObj.css({'display': 'block', 'zIndex': '4'});
				if(self._targetPage < self.curPage){						
					targetVal = -self.size;
				} else {
					targetVal = self.size;
				}
				targetPos[self.cssPrefix + 'transform'] = self.translateProp + '(' + targetVal + 'px)';
				targetObj.animate(targetPos, config.animateTime, config.easing);
			}
			if(self._targetPage === window.undefined) {
				var curPos = {}, oriVal;
				if(self.oriCurPage < self.oriPrevPage) {
					oriVal = -self.size;
				} else {
					oriVal = self.size;
				}
				curPos[self.cssPrefix + 'transform'] = self.translateProp + '(' + oriVal + 'px)';
				curObj.css(curPos);
			}


			var curLastPos = {};
			curLastPos[self.cssPrefix + 'transform'] = self.translateProp + '(0px)';
			curObj.animate(curLastPos, config.animateTime, config.easing, function() {
				self.moving = false;
				self.trigger('change', [self.curPage]);
			});
			delete self._targetPage;
		},

		change: function(){

			// console.log(0)
		}

	});


});