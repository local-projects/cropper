PortraitMachine.Preview = function (options) {
	this.options = options || {};
	this.previews = {};
	this.container = this.options.container || $('.docs-preview');
	this.previewContainer = this.options.previewContainer || $('.img-preview');
	
	this.direction = null;
	this.directions = {};

	this.template = null;
	this.selected = null;

	this.url = this.options.url ? this.options.url : '';

	this.init();
}

PortraitMachine.Preview.prototype = {
	constructor: PortraitMachine.Preview,

	init: function () {
		/*this.attachListener();
		this.previews[0] = this.previewContainer[0];*/

		this._initSubscribers();
		this.showAll();
	},

	_initSubscribers: function () {
		var self = this;
		
		PortraitMachine.pubsub.subscribe('getSelectedPreview', function (obj) {

			if (self.selected) {
				self.publish('selectedPreviewElement', {
					el: self.selected,
					id: $(self.selected).data().preview.index,
					name: obj.name
				});
			}
			else {
				self.publish('showOrHidePreviews', {
					name: obj.name
				});
			}
			
		});

		PortraitMachine.pubsub.subscribe('removeActiveSelected', function (obj) {
			self.selected = null

			if (obj.id) {
				self.previews[obj.id].removeClass('active');
			}
		});

		PortraitMachine.pubsub.subscribe('showSelectPreviews', function (obj) {
			if (obj.indices) {
				if (obj.indices.length < 1) {
					return
				}

				self.hideAllPreviews.call(self);

				$('.show-all').removeAttr('disabled');

				for (var i = 0; i < obj.indices.length; i++) {
					var item = obj.indices[i];
					if(item in self.previews) {
						self.previews[item].show();
					}
				}
			}
		});


		PortraitMachine.pubsub.subscribe('showAllPreviews', function (obj) {
			self.showAllPreviews.call(self);
		});
	},

	publish: function (name, context) {
		PortraitMachine.pubsub.publish(name, context);
	},

	addPreview: function (index, dir) {
		var tm = this.getTemplate(this.url);
		this.template = $(tm);

		var el = this.template[0];
		// this.attachListener(el);
		this.previews[index] = el;

		this.addDirection(index);

		if (dir && dir.length > 0) {
			this.setDirection(index, dir[dir.length - 1]);
		}

		this.container.append("<div class='clearfix'></div>");

		/*if (append) {
			this.appendPreview(el);
		}
		else {
			this.addDirection(index);
		}*/
	},

	addSavedPreview: function (key, crop) {
		var tm = this.getTemplate(this.url);
		this.template = $(tm);

		var vals = crop.preview.preview;
		var con = this.getNewTemplateContainer('img-preview');


		var el = this.template[0];
		$(el).css({width: vals.imgWidth, height: vals.imgHeight, marginLeft: vals.imgMarginLeft, marginTop: vals.imgMarginTop});
		con.append(el);
		con.css({width: vals.containerWidth, height: vals.containerHeight});

		var dt = $.extend(vals, {'index': key})
		con.data('preview', dt);
		this.previews[key] = con;
		this.attachListener(con[0]);
		this.appendPreview(con);
	},

	appendPreview: function (el) {
		this.container.append(el);
	},

	addPreviewWithData: function (data) {
		/*var canvas = $('<canvas>')[0];
		canvas.width = data.width;
		canvas.height = data.height;
		context = canvas.getContext('2d');*/
	},

	addDirection: function (index) {
		this.direction = new PortraitMachine.Directions();
		this.directions[index] = this.direction;
		this.addDirectionTemplate();
	},

	addDirectionTemplate: function () {
		var template = this.direction.getTemplate();
		this.container.append(template);
	},

	setPreviewContainer: function () {
		this.previewContainer = this.options.previewContainer || $('.img-preview');
	},

	getDirection: function (index) {
		if (index in this.directions) {
			return this.directions[index].getCurrentDirections();
		}
		
		return '';
	},

	setDirection: function (index, dir) {
		this.directions[index].setCurrentDirection(dir);
	},

	getNewTemplateContainer: function (prev) {
		var tem = $('<div class="' + prev + ' preview-lg"></div>');
		return tem;
	},

	getTemplate: function (url, crossOrigin) {
		var cr = crossOrigin ? crossOrigin : '';
		var template = '<img' + cr + ' src="' + url + '" style="' +
						'display:block;width:100%;height:auto;' +
						'min-width:0!important;min-height:0!important;' +
						'max-width:none!important;max-height:none!important;' +
						'image-orientation:0deg!important;">'
		return template;
	},

	attachListener: function (initEl) {
		var self = this;

		/*var el = initEl || $('.docs-preview').find('.img-preview')[0];*/
		var el = initEl || this.previewContainer[0];

		/*var dragStarted = false;
	    var draggingElem = null;
	    var attachedElem = null;*/

		el.addEventListener('click', function (event) {
			event.preventDefault();
			self.publish('writeData');

			self.setPreviewContainer();
			var pc = self.container.find(self.previewContainer);
			var id = $(this).data().preview.index;

			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				
				self.publish('previewUnselected', {
					id: id,
				});

				self.selected = null;
				return;
			}

			pc.removeClass('active');

			/*var $previews = self.container.find('.active');
			if ($previews.length > 0) {
				$previews.removeClass('active');
			}*/

			$(this).addClass('active');

			self.publish('previewSelected', {
				id: id,
			});

			self.selected = this;
		});
	},

	showAll: function () {
		$('.show-all').on('click', function () {
			this.showAllPreviews();
		}.bind(this));
	},

	showAllPreviews: function () {
		for (var pr in this.previews) {
			this.previews[pr].show();
		}

		$('.show-all').attr('disabled', 'true');
	},


	hideAllPreviews: function () {
		for (var pr in this.previews) {
			this.previews[pr].hide();
		}
	},

	removePreview: function (index) {
		delete this.previews[index];
		this.directions[index].remove();
		delete this.directions[index];
	}
}