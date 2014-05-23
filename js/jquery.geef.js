(function($, window, document, undefined){

	$.fn.geef = function(options){
		var defaults = {
			speed: 45,
			responsive: true
		},

		settings = $.extend({}, defaults, options);

		return this.each(function() {
			var _this = this;

			// Append timeline and control
			appendDOM(this);

			// Sets the height of .geef-wrapper
			// Caveat: it assumes frame is 16:9
			// $(this).css('height', setHeight(this.getBoundingClientRect().width) + 'px');
			$(this).css('height', Math.floor(setHeight($(this).innerWidth())) + 'px');

			// Builds object properties
			this.attrs = init(this);
			// console.log(this.attrs);

			// Bind window resize, perhaps not needed
			if(settings.responsive) {
				$(window).on('resize', function(){
					$(_this).css('height', setHeight(_this.getBoundingClientRect().width) + 'px');
					_this.attrs = init(_this);
				});
			}

			// appendPoints(this);

			// Scrubber handlers
			this.attrs.scrubber.mousemove(function(e){
				scrubToFrame(e, _this);
			});

			// Control handlers
			this.attrs.controls.control.mouseenter(function(){
				startAnimation(_this);
			}).mouseleave(function(){
				stopAnimation(_this);
			});
		});

		// Basically make everything
		function init(self) {
			var scrubber = $(self).find('img.geef-scrubber'),
				scrubberHeight = scrubber.innerHeight(),
				frameHeight = scrubber.innerHeight() / (scrubber.innerHeight() / $(self).innerHeight()),
				frameWidth = scrubber.innerWidth(),
				framesCount = (scrubber.innerHeight() / frameHeight)-1, //-1 to remove last frame, avoid flashing
				spacing = frameWidth / framesCount;
				timeline = $(self).find('.timeline'),
				control = $(self).find('.control'),
				controlIcon = control.find('i.fa');

			var attrs = {
				t: 0,
				interval: null,
				scrubber: scrubber,
				scrubberHeight: scrubberHeight,
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

			return attrs;
		}


		// Setting height of .geef-wrapper
		function setHeight(height) {
			var ratio = 16 / 9;
			return height / ratio;
		}

		// Append timeline and play/pause controller
		function appendDOM(geef) {	
			$(geef).append('<div class="timeline"></div>').append('<div class="control"><i class="fa fa-play"></i></div>');
		}

		//Start the animation
		function startAnimation(geef) {
			var attrs = geef.attrs,
				perc = 0,
				activeFrame = 1;
			// console.log('Frameheight:', attrs.frame.height);
			attrs.controls.controlIcon.removeClass('fa-play').addClass('fa-pause');
			
			attrs.interval = setInterval(function(){
				perc = (Math.abs(attrs.t) / attrs.scrubberHeight) * 100;
				attrs.t -= attrs.frame.height;
				attrs.scrubber.css('top', attrs.t + 'px');
				console.log('Frame:', activeFrame + ' Position:', attrs.t);
				animateTimeline(geef, perc);
				activeFrame++;
				if (attrs.t <= -attrs.scrubberHeight) {
					attrs.t = 0;
				}
			}, settings.speed);
		}

		//DEBUG function - used to append segment tiles on image
		function appendPoints(geef) { 
			for(var i = 0; i < geef.attrs.framesCount; i++) {
				$(geef).append('<div class="line" style="width:'+ geef.attrs.spacing +'px; left:'+ i*geef.attrs.spacing +'px"></div>');
			}
		} 

		function stopAnimation(geef) {
			var attrs = geef.attrs;
			attrs.controls.controlIcon.removeClass('fa-pause').addClass('fa-play');
			clearInterval(attrs.interval);
			attrs.interval = null;
		}

		function scrubToFrame(e, geef) {
			var posX = e.pageX - $(geef).offset().left,
				percentagePosX = (posX * 100) / geef.attrs.frame.width,	
				activeFrame = Math.ceil((posX / geef.attrs.spacing));
			console.log(activeFrame);

			if(activeFrame <= geef.attrs.framesCount) {
				geef.attrs.t = -Math.abs(activeFrame * geef.attrs.frame.height);
				geef.attrs.scrubber.css('top', geef.attrs.t + 'px');
				animateTimeline(geef, percentagePosX);	
			}
		} 

		function animateTimeline(geef, width) {
			geef.attrs.timeline.css('width', Math.ceil(width) + '%');
		}
	}

})(jQuery, window, document);