function Skeleton(options) {
	this.options = options || {};
	this.jointPositions = this.options.joints || [];
	this.joints = [];
	this.container = this.options.container || '#svg-container';

	var defaults = this.getDefaults();
	this.skeleton = defaults;
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
		for (var part in this.skeleton) {
			if (this.skeleton[part].pivot) {
				var pv = this.skeleton[part].pivot;
				pv['container'] = this.container;
				this.jointPositions.push(pv);
				var joint = new Joint(pv);
				this.joints.push(joint);
			}
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

				/*var associatedData = $joint.data().preview.index;
				var associatedCrop = window.crops[associatedData];
				if (associatedCrop) {
					var originalX = associatedCrop['pivot']['originalX'];
					var originalY = associatedCrop['pivot']['originalY'];
					var dragX = event.pageX, dragY = event.pageY;
					var newX = originalX - dragX;
					var newY = originalY - dragY;
					$joint.css({left: event.pageX, top: event.pageY});
					associatedCrop['pivot']['offsetX'] = newX;
					associatedCrop['pivot']['offsetY'] = newY;
					window.crops[associatedData] = associatedCrop;
				}

				else {
					$joint.data() = {};
				}*/
			}
		});

		$(this.container).on('mouseup', function (event) {
			if (JointPreview.Selected) {
				JointPreview.Selected = null;
			}
			// console.log(window.crops);
		});
	},

	getDefaults: function () {
    var containerWid = 375, containerHt = 500;
    var xVal = (containerWid - 10) / 2;
    var yVal = 10;
    var shoulderPos = 50;
    var torsoHt = 200;
    
    var drawOptions = {
      container: {
        width: containerWid, 
        height: containerHt
      },

      common: {
        width: 10,
        fill: 'lightgrey'
      },

      torso : {
        x: xVal, 
        y: yVal, 
        height: torsoHt, 
        id: 'torso-body',
        partOf: 'body',
        pivot: {
          x: xVal - 5,
          y: yVal - 5,
          id: 'torso',
          class: 'pivot'
        }
      },

      leftShoulder: {
        x: xVal, 
        y: shoulderPos, 
        height: 60, 
        style: 'transform: rotate(70deg)', 
        class: 'left-hand', 
        id: 'left-shoulder',
        partOf: 'hand'
      },

      rightShoulder: {
        x: xVal, 
        y: shoulderPos, 
        height: 60, 
        style: 'transform: rotate(-70deg)', 
        class: 'right-hand', 
        id: 'right-shoulder',
        partOf: 'hand'
      },

      leftElbow: {
        x: xVal - 57.5, 
        /*x: 125, */
        y: shoulderPos + 20, 
        height: 50, 
        style: 'transform:rotate(45deg)', 
        class: 'left-hand', 
        id: 'left-elbow',
        partOf: 'hand',
        pivot: {
          x: xVal - 67.5,
          y: shoulderPos + 15,
          id: 'pivot-elbow-left',
          class: 'pivot'
        }
      },

      rightElbow: {
        x: xVal + 57.5, 
        /*x: 240,*/
        y: shoulderPos + 20, 
        height: 50, 
        style: 'transform:rotate(-45deg)', 
        class: 'right-hand', 
        id: 'right-elbow',
        partOf: 'hand',
        pivot: {
          x: xVal + 57.5,
          y: shoulderPos + 15,
          id: 'pivot-elbow-right',
          class: 'pivot'
        }
      },

      leftHand: {
        x: xVal - 45 - 47, 
        y: shoulderPos + 55, 
        height: 50, 
        style: 'transform:rotate(35deg)', 
        class: 'left-hand', 
        id: 'left-hand',
        partOf: 'hand',
        pivot: {
          x: xVal - 45 - 47 - 10,
          y: shoulderPos + 55,
          id: 'pivot-hand-left',
          class: 'pivot'
        }
      },

      rightHand: {
        x: xVal + 45 + 47, 
        y: shoulderPos + 55, 
        height: 50, 
        style: 'transform:rotate(-35deg)', 
        class: 'right-hand', 
        id: 'right-hand',
        partOf: 'hand',
        pivot: {
          x: xVal + 45 + 47,
          y: shoulderPos + 55,
          id: 'pivot-hand-right',
          class: 'pivot'
        }
      },

      leftPalm: {
        x: xVal - 45 - 47 - 25, 
        y: shoulderPos + 90, 
        height: 25, 
        style: 'transform:rotate(45deg)', 
        class: 'left-hand', 
        id: 'left-palm',
        partOf: 'hand'
      },

      rightPalm: {
        x: xVal + 45 + 47 + 25, 
        y: shoulderPos + 90, 
        height: 25, 
        style: 'transform:rotate(-45deg)', 
        class: 'right-hand', 
        id: 'right-palm',
        partOf: 'hand'
      },

      leftHip: {
        x: xVal, 
        y: torsoHt, 
        height: 25, 
        style: 'transform:rotate(60deg)', 
        class: 'left-leg', 
        id: 'left-hip',
        partOf: 'leg'
      },

      rightHip: {
        x: xVal, 
        y: torsoHt, 
        height: 25, 
        style: 'transform:rotate(-60deg)', 
        class: 'right-leg', 
        id: 'right-hip',
        partOf: 'leg'
      },

      leftKnee: {
        x: xVal - 20, 
        y: torsoHt + 10, 
        height: 125, 
        style: 'transform:rotate(15deg)', 
        class: 'left-leg', 
        id: 'left-knee',
        partOf: 'leg'
      },

      rightKnee: {
        x: xVal + 20, 
        y: torsoHt + 10, 
        height: 125, 
        style: 'transform:rotate(-15deg)', 
        class: 'right-leg', 
        id: 'right-knee',
        partOf: 'leg'
      },

      leftKnee2: {
        x: xVal - 52, 
        y: torsoHt + 25 + 105, 
        height: 75, 
        style: 'transform:rotate(0deg)', 
        class: 'left-leg', 
        id: 'left-knee2',
        partOf: 'leg'
      },

      rightKnee2: {
        x: xVal + 52, 
        y: torsoHt + 25 + 105, 
        height: 75, 
        style: 'transform:rotate(0deg)', 
        class: 'right-leg', 
        id: 'right-knee2',
        partOf: 'leg'
      },

      leftFoot: {
        x: xVal - 52, 
        y: torsoHt + 25 + 105 + 70, 
        height: 25, 
        style: 'transform:rotate(45deg)', 
        class: 'left-leg', 
        id: 'left-foot',
        partOf: 'leg'
      },

      rightFoot: {
        x: xVal + 52, 
        y: torsoHt + 25 + 105 + 70, 
        height: 25, 
        style: 'transform:rotate(-45deg)', 
        class: 'right-leg', 
        id: 'right-foot',
        partOf: 'leg'
      }
    }

    return drawOptions;
  },
}