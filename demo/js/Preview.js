function Preview (options) {
	this.options = options || {};
	this.previews = {};
	this.container = this.options.container || $('.docs-preview');
	this.previewContainer = this.options.previewContainer || $('.img-preview');
	
	this.direction = null;
	this.directions = {};
	// this.init();

	this.template = null;

	this.url = this.options.url ? this.options.url : '';
}

Preview.Selected = null;

Preview.prototype = {
	constructor: Preview,

	init: function () {
		this.attachListener();
		this.previews[0] = this.previewContainer[0];
	},

	addPreview: function (index, append) {
		var tm = this.getTemplate(this.url);
		this.template = $(tm);

		var el = this.template[0];
		this.attachListener(el);
		this.previews[index] = el;

		if (append) {
			this.appendPreview(el);
		}
		else {
			this.addDirection(index);
		}
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
		this.direction = new Directions();
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
		return this.directions[index].getCurrentDirections();
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

			self.setPreviewContainer();
			var pc = self.container.find(self.previewContainer);

			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				Preview.Selected = null;
				/*self.showSelectedJoints(true);
				self.showJointPreviews(true);*/
				return;
			}

			pc.removeClass('active');

			/*var $previews = self.container.find('.active');
			if ($previews.length > 0) {
				$previews.removeClass('active');
			}*/

			$(this).addClass('active');
			Preview.Selected = this;
			/*self.showSelectedJoints();
			self.showJointPreviews();*/
		});
	},

	removePreview: function (index) {
		delete this.previews[index];
		this.directions[index].remove();
		delete this.directions[index];
	}
}