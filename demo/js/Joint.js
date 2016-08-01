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
		this.$pivot = $('#'+ this.id);
		this.attachListener();
	},

	attachListener: function () {
		var self = this;
		this.$pivot.on('click', function (event) {
			event.preventDefault();
			/*self.updateJoint.call(this, self);*/
			var jp = new JointPreview({'pivot': self.$pivot});
			var pivotImage = jp.updateJoint();
			if (pivotImage != null) {
				this.attachedPreviews.push(pivotImage);
			}
		});


		/*this.$pivot.on('mousedown', function (event) {
			event.preventDefault();
			self.selectedJoint = this;
		});*/
	}
}