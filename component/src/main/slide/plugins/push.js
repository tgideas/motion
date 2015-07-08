define(function(require, exports, module) {
	mo.Tab.extend('push', {
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
				obj.css('zIndex', '3');					
			};
		},


		touchmove: function(e, startDis, moveDis){
			var self = this;
			var targetObj;
			var plus;
			if(self.moving == true) {
				return;
			}

			

			var targetPage;
			var targetObj;
			var pos = {};

			if(startDis < 0) {
				targetPage = self.oriCurPage + 1;
				pos[self.cssPrefix + 'transform'] = self.animProp + '(' + (startDis + self.offset) + 'px)';
			} else {
				targetPage = self.oriCurPage - 1;
				pos[self.cssPrefix + 'transform'] = self.animProp + '(' + (startDis - self.offset) + 'px)';
			}
			targetObj = self.target.eq(self._outBound(targetPage));
			self._launch(targetObj);
			self.target.eq(self.curPage).css('zIndex', '2');
			targetObj.css(pos);
			self._targetPage = targetPage;

		},

		beforechange: function() {
			var self = this;
			var config = self.config;
			var pos;
			var curObj = self.target.eq(self.curPage);
			var o = {};
			var animObj;



			self.target.eq(self.curPage).css('zIndex', '3');
			self.target.eq(self.prevPage).css('zIndex', '2');

			

			if(self._targetPage !== self.oriCurPage) {
				var targetPos = {}, targetVal;
				var targetObj = self.target.eq(self._outBound(self._targetPage));
				targetObj.css('zIndex', '4');
				if(self._targetPage < self.curPage){						
					targetVal = -self.offset;
				} else if(self._targetPage > self.curPage){
					targetVal = self.offset;
				}
				targetPos[self.cssPrefix + 'transform'] = self.animProp + '(' + targetVal + 'px)';
				targetObj.animate(targetPos, config.animateTime, config.easing);
			}

			if(self._targetPage === window.undefined) {
				var curPos = {}, oriVal;
				if(self.oriCurPage < self.oriPrevPage) {
					oriVal = -self.offset;
				} else {
					oriVal = self.offset;
				}
				curPos[self.cssPrefix + 'transform'] = self.animProp + '(' + oriVal + 'px)';
				curObj.css(curPos);
			}


			o[self.animProp] =   '0px';
			curObj.animate(o, config.animateTime, config.easing, function() {
				self.moving = false;
				self.trigger('change', [self.curPage]);
			});
			delete self._targetPage;



		}

	});


});