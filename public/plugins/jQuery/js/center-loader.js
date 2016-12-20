/*!
 * Center-Loader PACKAGED v1.0.0
 * http://plugins.rohitkhatri.com/center-loader/
 * MIT License
 * by Rohit Khatri
 */

$.fn.loader = function(action,spinner,w,h) {
	var action = action || 'show',
			w = (w===null || w==="" || typeof(w)==="undefined")? "" : w,
			h = (h===null || h==="" || typeof(h)==="undefined")? "" : h;		
	if(action === 'show') {
		if(this.find('.loader').length == 0) {
			parent_position = this.css('position');
			this.css('position','relative');
			paddingTop = parseInt(this.css('padding-top'));
			paddingRight = parseInt(this.css('padding-right'));
			paddingBottom = parseInt(this.css('padding-bottom'));
			paddingLeft = parseInt(this.css('padding-left'));
			width = this.innerWidth();
			height = this.innerHeight();

			$loader = $('<div class="loader"></div>').css({
				'position': 'absolute',
				'top': 0,
				'left': '0',
				'right': '0',
				'width':'100%',
				'height': '100%',
				'z-index':	50,
				'background-color': '#eee',
				'border-radius': '3px',
			    'opacity': '.5',
		    	'cursor': 'wait'
			});

			$loader.attr('parent_position',parent_position);

			$spinner = $(spinner).css({
			'position': 'absolute',
		    'top': '50%',
		    'left': '50%',
		    'width':w,
		    'height':h,
		    'color': '#000',
				'margin-top': '-'+paddingTop+'px',
				'margin-right': '-'+paddingRight+'px',
				'margin-bottom': '-'+paddingBottom+'px',
				'margin-left': '-'+paddingLeft+'px'
			});

			$loader.html($spinner);
			this.prepend($loader);
			marginTop = $spinner.height()/2;
			marginLeft = +$spinner.width()/2;
			$spinner.css({
				'margin-top': '-'+marginTop+'px',
				'margin-left': '-'+marginLeft+'px'
			});
		}
	} else if(action === 'hide') {
		this.css('position',this.find('.loader').attr('parent_position'));
		this.find('.loader').remove();
	}
};