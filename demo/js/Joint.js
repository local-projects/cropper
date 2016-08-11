function Joint (options) {
	this.options = options || {};
	this.x = this.options.x;
	this.y = this.options.y;
	this.id = this.options.id;
	this.class = this.options.class || '';
	/*this.width = this.options.width;
	this.height = this.options.height;*/
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
		/*$pivot.attr('draggable', 'true');*/
		$(this.container).append($pivot);
		// this.$pivot = $('#'+ this.id);
		this.$pivot = $pivot;
		this.attachListener();
		this.showAll();
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

				if (self.attachedPreviews.length < 1) {
					return;
				}
				
				var indices = [];
				for (var i = 0; i < self.attachedPreviews.length; i++) {
					var at = self.attachedPreviews[i].showPreview();
					
					if (at == 'active') {
						indices.push(self.attachedPreviews[i].getIndex());
					}
					
				}

				if (indices.length > 0) {
					self.filterPreviews(indices);
				}
				else {
					self.showAllPreviews();
				}
				
			}

		});
	},

	filterPreviews: function (indices) {
		var prs = $('.docs-preview').find('.img-preview');
		var count = 0;
		
		for (var i = 0; i < prs.length; i++) {
			var pr = prs[i];
			var currentIndex = $(pr).data().preview.index;

			if ($.inArray(currentIndex, indices) >= 0) {
				$(pr).show();
			}
			else {
				$(pr).hide();
				++count;
			}
		}

		if (count > 0) {
			$('.show-all').removeAttr('disabled');
		}
	},

	showAll: function () {
		$('.show-all').on('click', function () {
			this.showAllPreviews();
		}.bind(this));
	},

	showAllPreviews: function () {
		var prs = $('.docs-preview').find('.img-preview');
		
		for (var i = 0; i < prs.length; i++) {
			var pr = prs[i];
			$(pr).show();
		}

		$('.show-all').attr('disabled', 'true');
	},

	getData: function () {
		var data = {};
		var di;

		if (this.attachedPreviews.length === 0) {
			data['previews'] = [];
			data['x'] = this.x;
			data['y'] = this.y;
			data['id'] = this.id;
			data['class'] = this.class;

			return data;
		}

		data['previews'] = [];
		data['x'] = this.x;
		data['y'] = this.y;
		data['id'] = this.id;
		data['class'] = this.class;

		for (var i = 0; i < this.attachedPreviews.length; i++) {
			var pr = this.attachedPreviews[i];
			var id = pr.getData();
			data['previews'].push(id);
		}

		return data;
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