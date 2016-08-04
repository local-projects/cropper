function JointPreview (options) {
	this.options = options || {};
	this.container = this.options.container || '#svg-container';
	this.pivot = this.options.pivot || '.pivot';
	this.$pivot = $(this.pivot);
	this.previews = [];
	this.preview = null;
	this.relatedId = null;
	
	this.offsetX = 0.5;
	this.offsetY = 0.5;
	this.sizeX = 1;
	this.sizeY = 1;
	this.directions = [];
	this.init();
}

JointPreview.Selected = null;

JointPreview.prototype = {
	constructor: JointPreview,

	init: function () {
		this.updateJoint();
	},

	addJointPreview: function () {

	},

	getData: function () {
		
		var d =	{
				'id': this.relatedId,
				'anchor': [this.offsetX, this.offsetY],
				'size': [this.sizeX, this.sizeY],
				'directions': this.directions
				}
		
		return d;
	},

	updateJoint: function () {
		var pivotSize = 20;

		var selected = Preview.Selected;

		if (selected) {
			var $clone = $(selected).clone();
			
			var closeIcon  = $('<div>');
			closeIcon.addClass('close-icon-preview');
			$clone.append(closeIcon);
			
			var indexData = $(selected).data();
			$clone.data(indexData);
			
			this.relatedId = indexData.preview.index;
			
			var crops = JSON.parse(localStorage.getItem('crops'));
			var crop = crops.crops[this.relatedId];
			this.sizeX = crop.sizeX;
			this.sizeY = crop.sizeY;
			var aspectRatio = crop.cropAspectRatio;
			var imageAspectRatio = crop.imageAspectRatio;
			
			var $img = $clone.find('img');
			var $this = this.$pivot;

			var wd = $(this.container).width() * this.sizeX;
			var ht = wd / aspectRatio;
			var lt = parseInt($this.css('left')) - (wd / 2) + (pivotSize / 2);
			var tp = parseInt($this.css('top')) - (ht / 2) + (pivotSize / 2);

			var pivotContainer = {
				'width': wd,
				'height': ht,
				'position': 'absolute',
				'float': 'none',
				'left': lt,
				'top': tp,
				'margin-bottom': '0',
				'margin-right': '0',
				'opacity': 1,
			}

			var imgWid = wd / this.sizeX;
			var imgHgt = imgWid / imageAspectRatio;
			var imglt = parseFloat($(selected).find('img').css('margin-left')) * (imgWid / $(selected).find('img').width());
			var imgtp = parseFloat($(selected).find('img').css('margin-top')) * (imgHgt / $(selected).find('img').height());

			var pivotImg = {
				'width': imgWid,
				'height': imgHgt,
				'margin-left': imglt,
				'margin-top': imgtp
			}

			$clone.css(pivotContainer);
			$clone.addClass('active');
			$img.css(pivotImg);
			$clone.attr('draggable', 'false').addClass('offset-preview');
			/*$('.pivot').removeClass('active').removeClass('has-data').removeClass('no-data').addClass('inactive');*/
			this.$pivot.removeClass('active').addClass('inactive');
			$this.removeClass('inactive').addClass('active');
			$(this.container).append($clone);


			$(selected).removeClass('active');
			selected = Preview.Selected = null;
			this.preview = $clone;
			this.offsetListener();
			this.previews.push($clone);
		}
		/*return this.previews;*/
		return this.preview;

	},

	offsetListener: function () {
		if (this.preview) {
			this.preview.on('mousedown', function (event) {
				event.preventDefault();
				JointPreview.Selected = this;
			});
		}
	},

	showPreview: function () {
		if (this.preview) {
			if ($(this.preview).hasClass('active')) {
				$(this.preview).removeClass('active');
				return;
			}
			$(this.preview).addClass('active');
		}

		/*if (this.previews.length > 0) {
			$.each(this.previews, function (index, value) {
				if ($(value).hasClass('active')) {
					$(value).removeClass('active')
					return
				}
				$(value).addClass('active')
			});
		}*/
	},

	remove: function () {
		this.preview.remove();
		this.preview = null;
	},
}