function Joints(options) {
  var defaults = this.getDefaults();
  this.selectedElem = null;
  this.selectedJoint = null;
  this.joints = [];
  this.options = $.extend({}, defaults, $.isPlainObject(options) && options);

  var draw;
  if ('draw' in options && options.draw === false) {
    draw = options.draw;
  }
  else {
    draw = true;
  }

  this.init(draw);
}

Joints.prototype = {
  constructor: Joints,

  init: function (draw) {
    this.skeleton = this.options;
    if (draw) {
      this.draw();
    }
    /*this.mouseListener();*/
  },

  draw: function (el) {
    this.drawSkeleton(el);
  },

  drawSkeleton: function (el) {
    var self = this;
    var selector = el || '#svg-container';
    var container = d3.select(selector).append('svg').attr('width', '100%').attr('height', '100%');
    this.svgContainer = $(selector);
    this.handContainer = container.append('g').attr('id', 'hand');
    this.legContainer = container.append('g').attr('id', 'legs');

    for (var part in this.skeleton) {
      if (part !== 'container' && part !== 'common') {
        switch(this.skeleton[part].partOf) {
          case 'body':
            var $bodyPart = container.append('rect');
            this.setAttributes($bodyPart, this.skeleton[part]);
            break;
          case 'hand':
            var $bodyPart = this.handContainer.append('rect');
            this.setAttributes($bodyPart, this.skeleton[part]);
            break;
          case 'leg':
            var $bodyPart = this.legContainer.append('rect');
            this.setAttributes($bodyPart, this.skeleton[part]);
            break;
          default:
            break;
        }

        if (this.skeleton[part].pivot) {
          var pv = this.skeleton[part].pivot;
          var $pivot = $('<div>');
          $pivot.addClass(pv.class).attr('id', pv.id).css({left: pv.x, top: pv.y});
          $pivot.attr('draggable', 'true');
          $('#svg-container').append($pivot);
          
          $pivot.on('click', function (event) {
            event.preventDefault();
            self.updateJoint.call(this, self);
          });


          $pivot.on('mousedown', function (event) {
            event.preventDefault();
            self.selectedJoint = this;
          });

        }
      }
    }
  },

  updateJoint: function (self) {
    var pivotSize = 20;
    var scalingFactor = 1;

    if (self.selectedElem) {
    var $clone = $(self.selectedElem).clone();
    var indexData = $(self.selectedElem).data();
    var cropIndex = $(self.selectedElem).data().preview.index;
    var associatedCrop = window.crops[cropIndex];

    if (associatedCrop.pivot) {
      if (Object.keys(associatedCrop.pivot).length > 0) {
        var markup = associatedCrop['pivot']['html'];
        $(markup).remove();
        self.showSelectedJoints();
      }
    }

    if ($(this).data().preview) {
      return;
    }

    $clone.data(indexData);
    $(this).data(indexData);
    var $img = $clone.find('img');
    var $this = $(this);
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
      $('.pivot').removeClass('active').addClass('inactive');
      $this.removeClass('inactive').addClass('active');
      $('#svg-container').append($clone);
      self.showSelectedJoints();
      
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
      $(self.selectedElem).removeClass('active');
      self.selectedElem = null;
  }


},

  attachListener: function (initEl) {
    var self = this;

    /*var el = initEl || $('.docs-preview').find('.img-preview')[0];*/
    var el = initEl || $('.img-preview')[0];
    
    /*var dragStarted = false;
    var draggingElem = null;
    var attachedElem = null;*/

    el.addEventListener('click', function (event) {
      event.preventDefault();

      self.svgContainer.find('.img-preview').removeClass('active');
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        self.selectedElem = null;
        self.showSelectedJoints(true);
        self.showJointPreviews(true);
        return;
      }
      
      var $previews = $('.docs-preview').find('.active');
      if ($previews.length > 0) {
        $previews.removeClass('active');
      }
      
      $(this).addClass('active');
      self.selectedElem = this;
      self.showSelectedJoints();
      self.showJointPreviews();
    });
  },

  mouseListener: function () {
    var self = this;
    $(document).on('mousemove', function (event) {
      event.preventDefault();
      if (self.selectedJoint) {
        var $joint = $(self.selectedJoint);
        var associatedData = $joint.data().preview.index;
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
          }
      }
    
    });

    $('document').on('mouseup', function (event) {
      if (self.selectedJoint) {
        self.selectedJoint = null;
      }
      
      console.log(window.crops);
    });
  },

  showSelectedJoints: function (hide) {
    var $joints = $('.pivot');
    if (hide) {
      $joints.removeClass('has-data').removeClass('no-data');
      return;
    }

    $.each($joints, function (index, joint) {
      if ($(joint).data().preview && $(joint).data().preview.index) {
        $(joint).addClass('has-data');
      }
      else {
        $(joint).addClass('no-data');
      }
    });
  },

  showJointPreviews: function (hide) {
    var $imgPreviews = $('#svg-container');
    if (hide) {
      $imgPreviews.removeClass('active').removeClass('offset-preview');
      return;
    }

    $imgPreviews.addClass('active').addClass('offset-preview');
    
  },

  setAttributes: function (element, props, common) {
    if (!common) {
      common = this.skeleton.common
    }
    var combinedProps = $.extend(common, props);
    for (var prop in combinedProps) {
      element.attr(prop, combinedProps[prop]);
    }
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