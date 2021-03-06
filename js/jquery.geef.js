(function($, window, document, undefined){

	$.fn.geef = function(options){
		var defaults = {
			speed: 45,
			responsive: false,
			tileImagePostfix: '_tile',
			filetype: 'jpg'
		},


		// perfect ratio: 1.777777778
		// height of wrapper: 468
		// SUM: 468*1,777777778 = 832,000000104

		settings = $.extend({}, defaults, options);

		return this.each(function() {
			var _this = this;

			// Append timeline and control
			appendDOM(this);

			// Sets the height of .geef-wrapper
			// Caveat: it assumes frame is 16:9
			// $(this).css('height', setHeight(this.getBoundingClientRect().width) + 'px');
			$(this).css('height', setHeight($(this).outerWidth()) + 'px');

			// Builds object properties
			var geef = initGeef(this);
			// console.log(sf);

			// Bind window resize, perhaps not needed. This re-initalizes everything!
			if(settings.responsive) {
				$(window).on('resize', function(){
					$(_this).css('height', setHeight(_this.getBoundingClientRect().width) + 'px');
					_singleFrame = initGeef(_this);
				});
			}

			// Change the src on first mousover, initialize the tiles
			geef.image.mouseenter(function(){
				if(geef.tiles) { // src is set and tiles are initiated
					console.log('tiles is already set, doing nerfin');
					return;
				}

				changeSrc(this, false);
			});

			// Singleframe handlers
			geef.image.mousemove(function(e){
				if(!geef.tiles) {
					console.log('Tiles is not set, returning..');
					return;
				} else {
					scrubToFrame(e, geef);
				}
			});

			// Control handlers
			geef.controls.control.mouseenter(function(){
				if(!geef.tiles) {
					changeSrc(geef.image, true);
				}
				startAnimation(geef);
				
			}).mouseleave(function(){
				stopAnimation(geef);
			});

			var changeSrc = function(image){
				geef.controls.controlIcon.removeClass('fa-play').addClass('fa-spinner');
				var src = $(image).attr('src').slice(0, -4); // Remove the file extension
				$(image).load(function(){
					geef.tiles = initTiles(geef, this);
					geef.controls.controlIcon.removeClass('fa-spinner').addClass('fa-play');
				}).attr('src', src + settings.tileImagePostfix + '.' + settings.filetype);
				// appendPoints(geef);
			}
		});

		// Creates the logic for the single frame. When the tile-image is loaded, this is used to create more logic!
		function initGeef(geefWrapper) {
			var image = $(geefWrapper).find('img.geef'),
				imageWidth = image.innerWidth(),
				imageHeight = image.innerHeight(),
				timeline = $(geefWrapper).find('.timeline'),
				control = $(geefWrapper).find('.control'),
				controlIcon = control.find('i.fa');

			return {
				posTop: 0,
				interval: null,
				wrapper: geefWrapper,
				image: image,
				imageWidth: imageWidth,
				imageHeight: imageHeight,
				timeline: timeline,
				tiles: null,
				controls: {
					control: control,
					controlIcon: controlIcon
				}
			};
		}

		function initTiles(singleframe, tiles) {
			var tileHeight = $(tiles).innerHeight(),
				framesCount = Math.floor((tileHeight / singleframe.imageHeight)), //-1 to remove last frame, avoid flashing
				spacing = singleframe.imageWidth / framesCount;

			console.log('Framescount:', framesCount);

			return {
				tileHeight: tileHeight,
				framesCount: framesCount,
				spacing: spacing
			};
		}

		// Setting height of .geef-wrapper
		function setHeight(height) {
			var ratio = 16 / 9;
			return height / ratio;
		}

		// Append timeline and play/pause controller
		function appendDOM(geef) {	
			$(geef).append('<div class="timeline"></div><div class="control"><i class="fa fa-play"></i></div>');
		}

		function scrubToFrame(e, geef) {
			var posX = e.pageX - $(geef.wrapper).offset().left,
				perc = Math.ceil((posX * 100) / geef.imageWidth),	
				activeFrame = (Math.ceil((posX / geef.tiles.spacing))+1);

			if(activeFrame <= geef.tiles.framesCount) {
				geef.posTop = -Math.abs(activeFrame * geef.imageHeight);
				geef.image.css('top', geef.posTop + 'px');
				geef.activeFrame = activeFrame;
				animateTimeline(geef, perc);
				console.log('(scrub)!');
				console.info('Frame:', activeFrame + '\n Position:', geef.posTop + '\n Perc:', perc);
				console.log('------------------------------');
			}
		}

		//Start the animation
		function startAnimation(geef) {
			var perc = 0,
				img = geef.image,
				posTop = geef.posTop;

			// console.log('Frameheight:', attrs.frame.height);
			geef.controls.controlIcon.removeClass('fa-play').addClass('fa-pause');

			if(geef.activeFrame && geef.activeFrame > 1) { // User has already scrubbed somewhere or played and stopped
				console.log('User has scrubbed, should start from frame', geef.activeFrame);
			} else {
				geef.activeFrame = 1; // User has not scrubbed, just start the animation
			}

			geef.interval = setInterval(function(){
				perc = Math.ceil((Math.abs(posTop) / geef.tiles.tileHeight) * 100);
				posTop = -(geef.imageHeight * geef.activeFrame);
				img.css('top', posTop + 'px');
				console.log('(animation)!');
				console.log('Frame:', geef.activeFrame + '\n Position:', posTop + '\n Perc:', perc);
				console.log('------------------------------');
				animateTimeline(geef, perc);
				geef.activeFrame++;
				if (posTop <= -geef.tiles.tileHeight) {
					posTop = 0;
					geef.activeFrame = 1;
				}
			}, settings.speed);
		}

		//DEBUG function - used to append segment tiles on image
		function appendPoints(geef) {
			console.info(geef.tiles);
			for(var i = 0; i < geef.tiles.framesCount; i++) {
				$(geef).append('<div class="line" style="width:'+ geef.tiles.spacing +'px; left:'+ i*geef.tiles.spacing +'px"></div>');
			}
		} 

		function stopAnimation(geef) {
			geef.controls.controlIcon.removeClass('fa-pause').addClass('fa-play');
			console.log('Stopped animation at', geef.activeFrame);
			clearInterval(geef.interval);
			geef.interval = null;
		}

		function animateTimeline(geef, width) {
			geef.timeline.css('width', Math.ceil(width) + '%');
		}
	}

})(jQuery, window, document);