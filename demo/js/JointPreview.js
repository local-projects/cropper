PortraitMachine.JointPreview = function (options) {
	this.options = options || {};
	this.container = this.options.container;
	this.pivot = this.options.pivot || '.pivot';
	this.$pivot = $(this.pivot);

	this.preview = null;
	this.relatedId = null;
	this.selected = this.options.el;
	
	this.offsetX = 0.5;
	this.offsetY = 0.5;
	this.sizeX = 1;
	this.sizeY = 1;
	this.directions = [];
	this.init();
}

PortraitMachine.JointPreview.Selected = null;

PortraitMachine.JointPreview.prototype = {
	constructor: PortraitMachine.JointPreview,

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

		var selected = this.selected;

		if (selected) {
			var $selected = $(selected);
			var $selectedImg = $selected.find('img');
			var $clone = $selected.clone();
			
			var closeIcon  = $('<div>');
			closeIcon.addClass('close-icon-preview');
			$clone.append(closeIcon);
			
			var indexData = $selected.data();
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
			var imglt = parseFloat($selectedImg.css('margin-left')) * (imgWid / $selectedImg.width());
			var imgtp = parseFloat($selectedImg.css('margin-top')) * (imgHgt / $selectedImg.height());

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

			// TODO remove dependency on data
			PortraitMachine.pubsub.publish('removeActiveSelected', {
				id: $(selected).data().preview.index,
			});

			this.preview = $clone;
			this.offsetListener();

		}

		return this.preview;

	},

	offsetListener: function () {
		if (this.preview) {
			this.preview.on('mousedown', function (event) {
				event.preventDefault();
				PortraitMachine.JointPreview.Selected = this;
			});
		}
	},

	getId: function () {
		return this.relatedId;
	},

	showPreview: function () {
		if (this.preview) {
			if ($(this.preview).hasClass('active')) {
				$(this.preview).removeClass('active');
				return 'inactive';
			}
			$(this.preview).addClass('active');
			return 'active';
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

	showJointPreview: function () {
		if (this.preview) {
			$(this.preview).addClass('active');
		}
	},


	hideJointPreview: function () {
		if (this.preview) {
			$(this.preview).removeClass('active');
		}
	},

	remove: function () {
		if (this.preview) {
			this.preview.remove();
			this.preview = null;
		}
	},
}