PortraitMachine.Joint = function (options) {
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
	this.init();
}

PortraitMachine.Joint.prototype = {
	constructor: PortraitMachine.Joint,

	init: function () {
		this._initSubscribers();
	},

	draw: function () {
		var $pivot = $('<div>');
		$pivot.addClass(this.class).attr('id', this.id).css({left: this.x, top: this.y});
		/*$pivot.attr('draggable', 'true');*/
		$(this.container).append($pivot);
		// this.$pivot = $('#'+ this.id);
		this.$pivot = $pivot;
		this.attachListener();
	},

	_initSubscribers: function () {
		var self = this;
		
		PortraitMachine.pubsub.subscribe('selectedPreviewElement', function (obj) {

			if (self.id === obj.name) {
				if (obj.el) {

					var jpData = {
						pivot: self.$pivot,
						container: self.container,
						el: obj.el
					}

					// TODO check and return if attaching to same joint
					self.publish('removeAttachedPreview', {
						id: obj.id
					});

					var jp = new PortraitMachine.JointPreview(jpData);

					self.removePreview(jp, self.attachedPreviews.length);
					self.attachedPreviews.push(jp);
				}
			}

		});


		PortraitMachine.pubsub.subscribe('showOrHidePreviews', function (obj) {

			if (self.id === obj.name) {

				if (self.attachedPreviews.length < 1) {
					return;
				}

				var indices = [];
				for (var i = 0; i < self.attachedPreviews.length; i++) {
					var at = self.attachedPreviews[i].showPreview();
					
					if (at == 'active') {
						indices.push(self.attachedPreviews[i].getId());
					}
					
				}

				if (indices.length > 0) {
					self.publish('showSelectPreviews', {
						indices: indices,
					});
				}
				else {
					self.publish('showAllPreviews', {});
				}

			}

		});
	},

	publish: function (name, context) {
		PortraitMachine.pubsub.publish(name, context);
	},

	attachListener: function () {
		var self = this;
		this.$pivot.on('click', function (event) {
			event.preventDefault();

			self.publish('getSelectedPreview', {
				name: this.id,
			});

		});
	},

	removeAttachedPreview: function (index) {
		if (this.attachedPreviews.length < 1) {
			return;
		}

		for (var i = 0; i < this.attachedPreviews.length; i++) {
			var apr = this.attachedPreviews[i];
			var id = apr.getId();
			if (id === index) {
				apr.remove();
			}
		}
	},

	checkAttachedPreviews: function (index, flag) {

		if (this.attachedPreviews.length < 1) {
			return;
		}

		for (var i = 0; i < this.attachedPreviews.length; i++) {
			var apr = this.attachedPreviews[i];
			var id = apr.getId();

			if (index === id) {
				if (flag === 'previewSelected') {
					apr.showJointPreview();
				}
				else{
					apr.hideJointPreview();
				}
			}
			else {
				apr.hideJointPreview();
			}
		}
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
		data['tag'] = this.tag;

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