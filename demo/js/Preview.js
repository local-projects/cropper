function Preview (options) {
	this.options = options || {};
	this.previews = [];
	this.container = this.options.container || $('.docs-preview');
	this.previewContainer = this.options.previewContainer || $('.img-preview');
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

	attachListener: function (initEl) {
		var self = this;

		/*var el = initEl || $('.docs-preview').find('.img-preview')[0];*/
		var el = initEl || this.previewContainer[0];

		/*var dragStarted = false;
	    var draggingElem = null;
	    var attachedElem = null;*/

		el.addEventListener('click', function (event) {
			event.preventDefault();

			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				Preview.Selected = null;
				/*self.showSelectedJoints(true);
				self.showJointPreviews(true);*/
				return;
			}

			self.previewContainer.removeClass('active');

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