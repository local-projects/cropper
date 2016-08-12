function Skeleton(options) {
	this.options = options || {};
	this.jointPositions = this.options.joints || [];
	this.joints = [];
	this.container = this.options.container || '#svg-container';
	this.config = this.options.config;

	this.scaleContainer();

	var def = new Defaults(this.config);
	
	this.skeleton = def.skeleton;
	this.pivots = def.pivots;
	// this.options = $.extend({}, defaults, $.isPlainObject(options) && options);

	this.init();
}

Skeleton.prototype = {
	constructor: Skeleton,

	init: function () {
		this._initializeDefaultJoints();
		this.draw();
		this.mouseListener();
	},

	_initializeJoints: function () {
		var jnts = this.jointPositions;
		for (var i = 0; i < jnts.length; i++) {
			var joint = new Joint(this.jointPositions[i]);
			this.joints.push(joint);
		}
	},

	_initializeDefaultJoints: function () {
		for (var pivot in this.pivots) {
			var pv = this.pivots[pivot];
			pv['container'] = this.container;
			this.jointPositions.push(pv);
			var joint = new Joint(pv);
			this.joints.push(joint);
		}
	},

	draw: function () {
		this.drawSkeleton();
		this.drawJoints();
	},

	drawSkeleton: function () {
		var self = this;
		var selector = this.container;
		var container = d3.select(selector).append('svg').attr('width', '100%').attr('height', '100%');
		this.svgContainer = $(selector);
		this.handContainer = container.append('g').attr('id', 'hand');
		this.legContainer = container.append('g').attr('id', 'legs');

		for (var part in this.skeleton) {
			if (part !== 'container' && part !== 'common') {
				switch(this.skeleton[part].partOf) {
					case 'body':
						var $bodyPart = container.append('rect');
						this._setAttributes($bodyPart, this.skeleton[part]);
						break;
					case 'hand':
						var $bodyPart = this.handContainer.append('rect');
						this._setAttributes($bodyPart, this.skeleton[part]);
						break;
					case 'leg':
						var $bodyPart = this.legContainer.append('rect');
						this._setAttributes($bodyPart, this.skeleton[part]);
						break;
					default:
						break;
				}
			}
		}

	},

	drawJoints: function () {
		for (var i = 0; i < this.joints.length; i++) {
			this.joints[i].draw();
		}
	},

	addJoints: function (newJointPositions) {
		this.jointPositions.concat(newJointPositions);
		/*this._initializeJoints(newJointPositions);*/
		/*this._initializeJoints();*/

		for (var i = 0; i < newJointPositions.length; i++) {
			var joint = new Joint(newJointPositions[i]);
			this.joints.push(joint);
		}

		this.drawJoints();
	},

	setJoints: function (newJointPositions) {
		this.jointPositions = newJointPositions || [];
		this.joints = [];
		this._initializeJoints();
		this.drawJoints();
	},

	_setJointsDirectly: function (newJoints) {
		this.joints = newJoints || [];
	},

	getJoints: function () {
		return this.joints;
	},

	_setAttributes: function (element, props, common) {
		if (!common) {
			common = this.skeleton.common
		}
		var combinedProps = $.extend(common, props);
		for (var prop in combinedProps) {
			element.attr(prop, combinedProps[prop]);
		}
	},

	getData: function () {
		
		var data = {};
		var dj = data['joints'] = {};
		var crops = localStorage.getItem('crops');
		var cr;
		
		for (var i = 0; i < this.joints.length; i++) {
			var joint = this.joints[i];
			var jointData = joint.getData();
			var id = jointData.id;
			dj[id] = jointData;
		}

		if (crops) {
			cr = JSON.parse(crops);
		}
		else {
			cr = {};
		}

		var gd = $.extend({}, cr, data);
		localStorage.setItem('crops', JSON.stringify(gd));
		return gd;
	},

	scaleContainer: function () {

		var _wd = this.config.container.width;
		var _ht = this.config.container.height;

		var _ww = window.innerWidth;
		var _wh = window.innerHeight;
		_wh = 0.85 * _wh;

		var scaleWd = 1;
		var scaleHt = 1;

		scaleHt = Math.ceil(_ht / _wh);
		scaleWd = scaleHt;

		var _scaledWidth = _wd / scaleWd;
		var _scaledHeight = _ht / scaleHt;

		var def = null;

		this.config.container.width = _scaledWidth;
		this.config.container.height = _scaledHeight;

		$(this.container).css({
			'width': _scaledWidth,
			'height': _scaledHeight
		});
	},

	mouseListener: function () {
		var self = this;
		$(this.container).on('mousemove', function (event) {
			event.preventDefault();
			var selectedJointPreview = JointPreview.Selected;
			if (selectedJointPreview) {
				var $joint = $(selectedJointPreview);
				
				var dragX = event.pageX;
				var dragY = event.pageY;
				var targetOffsetX = $(event.currentTarget).offset().left;
				var targetOffsetY = $(event.currentTarget).offset().top;
				var x = dragX - targetOffsetX;
				var y = dragY - targetOffsetY;

				var wid = $joint.width();
				var hgt = $joint.height();

				x = x - (wid / 2);
				y = y - (hgt / 2);

				$joint.css({left: x, top: y});

			}
		});

		$(this.container).on('mouseup', function (event) {
			if (JointPreview.Selected) {
				JointPreview.Selected = null;
			}
		});
	},
}