function Preview (options) {
	this.options = options || {};
	this.previews = [];
	this.container = this.options.container || $('.docs-preview');
	this.previewContainer = this.options.previewContainer || $('.img-preview');
	this.directions = options.directions;
	// this.init();
}

Preview.Selected = null;

Preview.prototype = {
	constructor: Preview,

	init: function () {
		this.attachListener();
		this.previews.push(this.previewContainer[0]);
	},

	addPreview: function (newPreview) {
		this.attachListener(newPreview);
		this.previews.push(newPreview);
	},

	addDirectionTemplate: function () {

		var list = '';

		for (var i = 0; i < this.directions.length; i++) {
			var direction = this.directions[i];

			list += "<li><a href='#'>"+direction+"</a></li>";
		}

		var dropdownContainer = $("<div class='dropdown-container'></div>");
		var dir	= $("<div class='dropdown'>" +
						"<button class='btn btn-default dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
						"Direction" +
						"<span class='caret'></span>" +
						"</button>" +
						"<ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>" +
						list +
						"</ul>" +
					"</div>")

		dropdownContainer.append(dir);
		this.container.append(dropdownContainer);
		this.addDirectionListener();

	},
	
	addDirectionListener: function () {
		var self = this;
		var dm = $('.dropdown-menu a');
		dm.on('click', function (event) {
			event.preventDefault();
			var dir = $(event.currentTarget).text();
			var button = $(this).parent().parent().parent().find('button');
			var buttonChildren = button.children();
			button.text(dir);
			button.append(buttonChildren);
			self.directions.push(dir);
		});
	},

	setPreviewContainer: function () {
		this.previewContainer = this.options.previewContainer || $('.img-preview');
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
			/*self.previewContainer = $('.img-preview');*/

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
}