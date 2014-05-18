(function($, window, document, undefined){

	$.fn.geef = function(options){
		var defaults = {
			speed: 40,
		},

		settings = $.extend({}, defaults, options);

		return this.each(function() {
			var img = $(this).find('img.geef-scrubber'),
				timeline = $(this).find('.timeline');

			this.attrs = {
				t: 0,
				interval: null,
				scrubber: img,
				timeline: timeline,
				tile: {				
					width: img.outerWidth(),
					height: img.outerHeight() / (img.outerHeight() / $(this).innerHeight())
				},
			};

			this.attrs.noTiles = this.attrs.scrubber.outerHeight() / this.attrs.tile.height;
			this.attrs.spacing = this.attrs.tile.width / this.attrs.noTiles;

			startAnimation(this);
			appendPoints(this);

			$(this).mouseenter(function() {
				stopAnimation(this);
			}).mousemove(function(e){
				scrubToPoint(e, this);
			}).mouseleave(function(){
				startAnimation(this);
			});
		});

		function startAnimation(geef) {
			console.log('Starting animation ..');
			var attrs = geef.attrs;
			attrs.interval = setInterval(function(){
				var perc = (Math.abs(attrs.t) / attrs.scrubber.outerHeight()) * 100;
				attrs.scrubber.css('top', attrs.t + 'px');
				attrs.t -= attrs.tile.height;
				animateTimeline(geef, perc);
				if (attrs.t <= -attrs.scrubber.outerHeight()) {
					attrs.t = 0;
				}
			}, settings.speed);
		}

		function appendPoints(geef) { 
			for(var i = 0; i < geef.attrs.noTiles; i++) {
				$(geef).append('<div class="line" style="width:'+ geef.attrs.spacing +'px; left:'+ i*geef.attrs.spacing +'px"></div>');
			}
		} 

		function stopAnimation(geef) {
			console.log('Stopping ...');
			clearInterval(geef.attrs.interval);
		}

		function scrubToPoint(e, geef) {
			console.log('Scrubbing ..');
			var posX = e.pageX - $(geef).offset().left,
				percentagePosX = (posX * 100) / geef.attrs.tile.width;
			// console.log(posX + ', ' + percentagePosX + '%');

			var scrubTo = -Math.abs(geef.attrs.scrubber.outerHeight() * (percentagePosX / 100));

			// console.log(scrubTo);

			geef.attrs.t = scrubTo;
			geef.attrs.scrubber.css('top', geef.attrs.t + 'px');
			animateTimeline(geef, percentagePosX);
		}

		function animateTimeline(geef, width) {
			geef.attrs.timeline.css('width', Math.floor(width) + '%');
		}
	}

})(jQuery, window, document);