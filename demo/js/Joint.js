function Joint (options) {
	this.options = options || {};
	this.x = this.options.x;
	this.y = this.options.y;
	this.id = this.options.id;
	this.class = this.options.class || '';
	/*this.width = this.options.width;
	this.height = this.options.height;*/
	this.offsetX = 0;
	this.offsetY = 0;
	this.container = this.options.container;
	this.$pivot = null;
	this.attachedPreviews = [];
}

Joint.prototype = {
	constructor: Joint,

	init: function () {

	},

	draw: function () {
		var $pivot = $('<div>');
		$pivot.addClass(this.class).attr('id', this.id).css({left: this.x, top: this.y});
		$pivot.attr('draggable', 'true');
		$(this.container).append($pivot);
		// this.$pivot = $('#'+ this.id);
		this.$pivot = $pivot;
		this.attachListener();
	},

	attachListener: function () {
		var self = this;
		this.$pivot.on('click', function (event) {
			event.preventDefault();
			if (Preview.Selected) {
				var jp = new JointPreview({'pivot': self.$pivot});
				self.removePreview(jp, self.attachedPreviews.length);
				self.attachedPreviews.push(jp);
			}
			else {
				for (var i = 0; i < self.attachedPreviews.length; i++) {
					self.attachedPreviews[i].showPreview();
				}
			}

		});
	},

	removePreview: function (jp, index) {
		var self = this;
		$(jp.preview).find('.close-icon-preview').on('click', function (event) {
			event.preventDefault();
			jp.remove();
			self.attachedPreviews.splice(index, 1);
			if (self.attachedPreviews.length === 0) {
				self.$pivot.removeClass('active');
			}
		});
	},
}