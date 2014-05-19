(function($, window, document, undefined){

	$.fn.geef = function(options){
		var defaults = {
			speed: 40,
		},

		settings = $.extend({}, defaults, options);

		return this.each(function() {
			appendDOM(this);

			var img = $(this).find('img.geef-scrubber'),
				timeline = $(this).find('.timeline');

			this.attrs = {
				t: 0,
				interval: null,
				scrubber: img,
				timeline: timeline,
				frame: {				
					width: img.outerWidth(),
					height: img.outerHeight() / (img.outerHeight() / $(this).innerHeight())
				},
			};

			this.attrs.framesCount = (this.attrs.scrubber.outerHeight() / this.attrs.frame.height)-1;
			this.attrs.spacing = this.attrs.frame.width / this.attrs.framesCount;

			// startAnimation(this);
			// appendPoints(this);

			$(this).mouseenter(function() {
				stopAnimation(this);
			}).mousemove(function(e){
				scrubToFrame(e, this);
			}).mouseleave(function(){
				startAnimation(this);
			});
		});

		function appendDOM(geef) {
			$(geef).append('<div class="timeline"></div>');
		}

		function startAnimation(geef) {
			var attrs = geef.attrs;
			attrs.interval = setInterval(function(){
				var perc = (Math.abs(attrs.t) / attrs.scrubber.outerHeight()) * 100;
				attrs.scrubber.css('top', attrs.t + 'px');
				attrs.t -= attrs.frame.height;
				animateTimeline(geef, perc);
				if (attrs.t <= -attrs.scrubber.outerHeight()) {
					attrs.t = 0;
				}
			}, settings.speed);
		}

		function appendPoints(geef) { 
			for(var i = 0; i < geef.attrs.framesCount; i++) {
				$(geef).append('<div class="line" style="width:'+ geef.attrs.spacing +'px; left:'+ i*geef.attrs.spacing +'px"></div>');
			}
		} 

		function stopAnimation(geef) {
			clearInterval(geef.attrs.interval);
			geef.attrs.interval = null;
		}

		function scrubToFrame(e, geef) {
			var posX = e.pageX - $(geef).offset().left,
				percentagePosX = (posX * 100) / geef.attrs.frame.width,	
				activeFrame = Math.ceil((posX / geef.attrs.spacing));

			if(activeFrame <= geef.attrs.framesCount) {
				geef.attrs.t = -Math.abs(activeFrame * geef.attrs.frame.height);
				geef.attrs.scrubber.css('top', geef.attrs.t + 'px');
				animateTimeline(geef, percentagePosX);	
			}
		}

		function animateTimeline(geef, width) {
			geef.attrs.timeline.css('width', Math.floor(width) + '%');
		}
	}

})(jQuery, window, document);