function JointPreview (options) {
	this.options = options || {};
	this.container = this.options.container || '#svg-container';
	this.pivot = this.options.pivot || '.pivot';
	this.$pivot = $(this.pivot);
}

JointPreview.prototype = {
	constructor: JointPreview,

	init: function () {

	},

	addJointPreview: function () {

	},

	updateJoint: function () {
		var pivotSize = 20;
		var scalingFactor = 1;

		var selected = Preview.Selected;

		if (selected) {
			var $clone = $(selected).clone();
			var indexData = $(selected).data();
			var cropIndex = $(selected).data().preview.index;
			var associatedCrop = window.crops[cropIndex];

			if (associatedCrop.pivot) {
				if (Object.keys(associatedCrop.pivot).length > 0) {
					var markup = associatedCrop['pivot']['html'];
					$(markup).remove();
					// self.showSelectedJoints();
				}
			}

			if ($(this.pivot).data().preview) {
				return;
			}

			$clone.data(indexData);
			this.$pivot.data(indexData);
			var $img = $clone.find('img');
			var $this = this.$pivot;
			var pivotContainer = {
				'width': $clone.width() / scalingFactor,
				'height': $clone.height() / scalingFactor,
				'position': 'absolute',
				'float': 'none',
				'left': parseInt($this.css('left')) - ($clone.width() / (scalingFactor * 2)) + (pivotSize / 2),
				'top': parseInt($this.css('top')) - ($clone.height() / (scalingFactor * 2)) + (pivotSize / 2),
				'margin-bottom': '0',
				'margin-right': '0',
				'opacity': 0.5
			}

			var pivotImg = {
				'width': $img.width() / scalingFactor,
				'height': $img.height() / scalingFactor,
				'margin-left': parseInt($img.css('margin-left')) / scalingFactor,
				'margin-top': parseInt($img.css('margin-top')) / scalingFactor
			}

			$clone.css(pivotContainer);
			$clone.addClass('active');
			$img.css(pivotImg);
			$clone.attr('draggable', 'false').addClass('offset-preview');
			/*$('.pivot').removeClass('active').removeClass('has-data').removeClass('no-data').addClass('inactive');*/
			$(this.pivot).removeClass('active').addClass('inactive');
			$this.removeClass('inactive').addClass('active');
			$(this.container).append($clone);
			/*self.showSelectedJoints();*/

			/*var currentCrops = JSON.parse(window.crops);*/

			if (associatedCrop) {
			associatedCrop['pivot'] = {};
			associatedCrop['pivot']['id'] = $(this).attr('id');
			associatedCrop['pivot']['originalX'] = parseInt($(this).css('left'));
			associatedCrop['pivot']['originalY'] = parseInt($(this).css('top'));
			associatedCrop['pivot']['html'] = $clone[0];
			}

			window.crops[cropIndex] = associatedCrop;
			console.log(window.crops);
			$(selected).removeClass('active');
			selected = null;
			this.pivot = $clone;
		}
		return this.pivot;

	},
}