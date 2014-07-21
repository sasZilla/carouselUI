// you can enter your JS here!
(function(window, $, undefined) {

$.fn.carousel = function(options, callback) {
	$.fn.carousel.defaults = {
		timer: 3000,
		animateTime: 1000,
		margin: 840,
		data: undefined
	};

	var opts = $.extend( $.fn.carousel.defaults, options );

	var carousel = {
		__index: 0,
		__struct: [],

		init: function(self) {
			this.self = self;
			this.$self = $(self);
			this.nextSelector = '.cl_next';
			this.prevSelector = '.cl_prev';
			this.mainSelector = 'ul';

			this.indexed(opts.data);
			this.layout();
			this.bind();
			this.start();
		},

		bind: function() {
			this.$self.on('mouseover', carousel.stop);
			this.$self.on('mouseout', carousel.start);

			this.$self.find(carousel.nextSelector).on('click', carousel.next);
			this.$self.find(carousel.prevSelector).on('click', carousel.prev);
		},

		html2json: function() {
			return Array.prototype.map.call(this.$self.find('.one_photo'), function(el) {
				var $this = $(el)

				return {
					large: $this.find('a').prop('href'),
					alt: $this.find('img').prop('alt')
				};
			});
		},

		indexed: function(data) {
			if (typeof data === "undefined") {
				data = carousel.html2json();
			}

			data.reduce(function(struct, curr) {
				struct.push(curr);
				return struct;
			}, carousel.__struct);
		},

		getStruct: function() {
			return carousel.__struct;
		},

		getLength: function() {
			return carousel.getStruct().length;
		},

		getImg: function() {
			return carousel.getStruct()[ carousel.getIndex() ];
		},

		start: function() {
			carousel.interval = setInterval(function() {
				carousel.next();
			}, opts.timer);
		},

		setIndex: function(position) {
			carousel.__index = position;
		},

		getIndex: function() {
			return carousel.__index;
		},

		stop: function() {
			clearInterval(carousel.interval);
		},

		prev: function(ev) {
			ev&&ev.preventDefault();

			var prev = carousel.getIndex() - 1;

			carousel.setIndex( prev < 0 ? carousel.getLength() - 1 : prev );

			carousel.changeImg('prev');
		},
		next: function(ev) {
			ev&&ev.preventDefault();

			var next = carousel.getIndex() + 1;
			carousel.setIndex( next > carousel.getLength() - 1 ? 0 : next );

			carousel.changeImg();
		},


		// views
		layout: function() {
			var img = carousel.getImg()
			carousel.self.innerHTML = '<div class="carousel">' +
									'<ul id="carousel">' +
										'<li><img src="' + img.large + '"/>' +
											'<div class="cl_title">' + img.alt + '</div>' +
										'</li>' +
									'</ul>' +
									'<a href="#" class="cl_next"></a>' +
									'<a href="#" class="cl_prev"></a>' +
								'</div>';
		},

		partialImg: function(param) {
			return '<li><img src="' + param.src + '" alt="' + param.alt + '"/>' +
						'<div class="cl_title">' + param.alt + '</div>' +
				   '</li>';
		},

		changeImg: function(traffic) {
			var img = carousel.getImg(),
				$main = carousel.$self.find(carousel.mainSelector);

			$main.stop(true, true);

			if (img) {
				if (traffic === 'prev') {
					$main.css({marginLeft: -opts.margin});
					$main.prepend(carousel.partialImg({src: img.large, alt: img.alt}));
					$main.animate({marginLeft: 0}, opts.animateTime, function() {
						$(this).find('li:last').remove();
					});
				} else {
					$main.append(carousel.partialImg({src: img.large, alt: img.alt}));
					$main.animate({marginLeft: -opts.margin}, opts.animateTime, function() {
						$(this).find('li:first').remove();
						$(this).css({marginLeft: 0});
					});
				}

			}
		}
	};

	return this.each(function() {
		try {
			return carousel.init(this);
		} catch(e) {
			console.log(e);
		}
	});
};

$(document).ready(function() {
	$('.photos').carousel({
		timer: 2000
	});
});

})(window, jQuery);