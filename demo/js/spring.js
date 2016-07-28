var figure = {

selectedElem: null,
selectedJoint: null,

addListener: function (initEl) {

  var self = this;

  /*var el = $('.docs-preview').find('.img-preview');*/
  var el = initEl || $('.img-preview')[0];

  
  var dragStarted = false;
  var draggingElem = null;
  var attachedElem = null;

  
  el.addEventListener('click', function (event) {
    event.preventDefault();
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      self.selectedElem = null;
      return;
    }
    
    var $previews = $('.docs-preview').find('.active');
    if ($previews.length > 0) {
      $previews.removeClass('active');
    }
    
    $(this).addClass('active');
    self.selectedElem = this;
  });

/*  el.addEventListener('mousedown', function () {
    // this.style.opacity = '0.5';
  });

  el.addEventListener('mouseout', function () {
  });

  el.addEventListener('mouseup', function () {
    // this.style.opacity = '1';
  });

  function scale(el, val) {
    el.style.mozTransform = el.style.msTransform = el.style.webkitTransform =
    el.style.transform = 'scale3d('+ val + ',' + val + ', 1)';
  }

  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragmove', dragStart, false);
  el.addEventListener('dragend', dragEnd, false);

  function dragStart(event) {
    this.style.opacity = '0.5';
    // event.dataTransfer.setData('text', '');
    dragStarted = true;
    draggingElem = $(this).clone();
    var draggingImg = draggingElem.find('img');
    var circleSnap = $('#head-snap');
  }

  function dragEnd(event) {
    this.style.opacity = '1';
    dragStarted = false;
    $(circ).attr('fill', 'black');
    draggingElem = null;
    attachedElem.remove();
  }


    var circs = $('svg').find('circle');
    var circ = circs[0];
    var circOffset = $(circ).offset();

    $("body").bind("dragover", function(event){
      var dragX = event.pageX, dragY = event.pageY;

      if (dragStarted) {
        // console.log("X: "+dragX+" Y: "+dragY);
        $(circ).attr('fill', 'blue');
          
        if (draggingElem) {
          if (attachedElem == null) {
            attachedElem = $(draggingElem).clone();
            $('body').append(attachedElem);
            attachedElem.css('position', 'absolute');
            attachedElem.css('top', dragY);
            attachedElem.css('left', dragX);
          }
          else {
            $(attachedElem).css({'left': dragX, 'top': dragY});
          }
        }
        
      }
    });*/

},


drawSkeleton: function  () {

  this.addListener();
  var self = this;

  function setAttributes (element, props, common) {
    if (!common) {
      common = skeleton.common
    }
    var combinedProps = $.extend(common, props);
    for (var prop in combinedProps) {
      element.attr(prop, combinedProps[prop]);
    }
  }

  function snap (element, props) {
    setAttributes(element, props, skeleton.snap.common);
  }


  var svgContainer = d3.select('#svg-container').append('svg').attr('width', '100%').attr('height', '100%');
  var containerWid = 375, containerHt = 500;
  var xVal = (containerWid - 10) / 2;
  var yVal = 10;
  var shoulderPos = 50;
  var torsoHt = 200;
  var pivotSize = 20;
  var scalingFactor = 1;

  var skeleton = {
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

  };



var handContainer = svgContainer.append('g').attr('id', 'hand');
var legContainer = svgContainer.append('g').attr('id', 'legs');

  for (var part in skeleton) {
    if (part !== 'container' && part !== 'common') {
      switch(skeleton[part].partOf) {
        case 'body':
          var $bodyPart = svgContainer.append('rect');
          setAttributes($bodyPart, skeleton[part]);
          break;
        case 'hand':
          var $bodyPart = handContainer.append('rect');
          setAttributes($bodyPart, skeleton[part]);
          break;
        case 'leg':
          var $bodyPart = legContainer.append('rect');
          setAttributes($bodyPart, skeleton[part]);
          break;
        default:
          break;
      }

      if (skeleton[part].pivot) {
        var pv = skeleton[part].pivot;
        var $pivot = $('<div>');
        $pivot.addClass(pv.class).attr('id', pv.id).css({left: pv.x, top: pv.y});
        $pivot.attr('draggable', 'true');
        $('#svg-container').append($pivot);
        $pivot.on('click', function () {
          if (self.selectedElem) {
            var $clone = $(self.selectedElem).clone();
            var indexData = $(self.selectedElem).data();
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
              $img.css(pivotImg);
              $clone.attr('draggable', 'false').addClass('offset-preview');
              $('.pivot').removeClass('active').addClass('inactive');
              $this.removeClass('inactive').addClass('active');
              $('#svg-container').append($clone);
              
              var cropIndex = $(self.selectedElem).data().preview.index;
              /*var currentCrops = JSON.parse(window.crops);*/
              var associatedCrop = window.crops[cropIndex];
              if (associatedCrop) {
                associatedCrop['pivot'] = {};
                associatedCrop['pivot']['id'] = $(this).attr('id');
                associatedCrop['pivot']['originalX'] = parseInt($(this).css('left'));
                associatedCrop['pivot']['originalY'] = parseInt($(this).css('top'));
              }

              window.crops[cropIndex] = associatedCrop;
              console.log(window.crops);
              self.selectedElem = null;
          }
        });


        $pivot.on('mousedown', function (event) {
          self.selectedJoint = this;
        });

      }
    }
  }

  /*$(document).on('mousemove', function (event) {
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
          $joint.css({left: dragX, top: dragY});
          associatedCrop['pivot']['offsetX'] = newX;
          associatedCrop['pivot']['offsetY'] = newY;
          window.crops[associatedData] = associatedCrop;
        }
        else {
          $joint.data() = {};
        }
    }
    
  });*/

  $('document').on('mouseup', function (event) {
    self.selectedJoint = null;
    console.log(window.crops);
  });
  

},

}