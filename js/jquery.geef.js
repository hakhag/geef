(function($, window, document, undefined){

	$.fn.geef = function(options){
		var defaults = {
			speed: 45,
		},

		settings = $.extend({}, defaults, options);

		return this.each(function() {

			appendDOM(this);

			var _this = this,
				scrubber = $(this).find('img.geef-scrubber'),
				frameHeight = scrubber.innerHeight() / (scrubber.innerHeight() / $(this).innerHeight()),
				frameWidth = scrubber.innerWidth(),
				framesCount = (scrubber.innerHeight() / frameHeight)-1,
				spacing = frameWidth / framesCount;
				timeline = $(this).find('.timeline'),
				control = $(this).find('.control'),
				controlIcon = control.find('i.fa');

			// Build an object to use everywhere
			this.attrs = {
				t: 0,
				interval: null,
				scrubber: scrubber,
				timeline: timeline,
				framesCount: framesCount,
				spacing: spacing,
				frame: {				
					width: frameWidth,
					height: frameHeight,
				},
				controls: {
					control: control,
					controlIcon: controlIcon,
				}
			};

			// appendPoints(this);

			// Scrubber handlers
			this.attrs.scrubber.mousemove(function(e){
				scrubToFrame(e, _this);
			});

			// Control handlers
			this.attrs.controls.control.mouseenter(function(){
				startAnimation(_this);
				_this.attrs.controls.controlIcon.removeClass('fa-play').addClass('fa-pause')
			}).mouseleave(function(){
				stopAnimation(_this);
				_this.attrs.controls.controlIcon.removeClass('fa-pause').addClass('fa-play')
			});

		});

		function appendDOM(geef) {	
			$(geef).append('<div class="timeline"></div>').append('<div class="control"><i class="fa fa-play"></i></div>');
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
			width = Math.ceil(width);
			geef.attrs.timeline.css('width', width + '%');
		}
	}

})(jQuery, window, document);