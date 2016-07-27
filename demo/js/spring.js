var figure = {

selectedElem: null,

springs: function () {

  var self = this;

  var el = $('.img-preview')[0];

  var springSystem = new rebound.SpringSystem();
  var spring = springSystem.createSpring(4, 3);
  var dragStarted = false;
  var draggingElem = null;
  var attachedElem = null;

  spring.addListener({
    onSpringUpdate: function (spring) {
      var val = spring.getCurrentValue();
      val = rebound.MathUtil.mapValueInRange(val, 0, 1, 1, 0.8);
      /*if (self.selectedElem) {
        
      }*/
      /*scale(self.selectedElem, val);*/
      scale(el, val);
    }
  });

  function scale(el, val) {
    el.style.mozTransform = el.style.msTransform = el.style.webkitTransform =
    el.style.transform = 'scale3d('+ val + ',' + val + ', 1)';
  }

  el.addEventListener('click', function () {
    if (spring.getCurrentValue() == 0) {
      /*spring.setEndValue(0);*/
      spring.setEndValue(1);
      self.selectedElem = this; 
    }
    else {
     spring.setEndValue(0); 
     self.selectedElem = null;
    }
    
    // this.style.opacity = '0.5';
  });

/*  el.addEventListener('mousedown', function () {
    spring.setEndValue(1);
    // this.style.opacity = '0.5';
  });

  el.addEventListener('mouseout', function () {
    spring.setEndValue(0);
  });

  el.addEventListener('mouseup', function () {
    spring.setEndValue(0);
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


    /*var headImgContainer = svgContainer.append('g').attr('id', 'head-img');
    var svgImg = headImgContainer.append('svg:image').attr('xlink:href', '../../assets/img/TestImage.jpeg').attr('x', 160).attr('y', -20).attr('width', 60).attr('height', 75);
    svgImg.attr('clipPath', 'url(#imgPath)')*/

},


drawSkeleton: function  () {

  this.springs();
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
              $this.addClass('active');
              $('#svg-container').append($clone);
          }
        });
      }
    }
  }
  



    /*skeleton.snap = {
      common: {
        fill: 'black',
        r: 8
      }
    };
    
    skeleton.snap.head = {
      cx: xVal + 5, 
      cy: yVal, 
      id: 'head-snap'
    };

    var $headSnap = svgContainer.append('circle');
    snap($headSnap, skeleton.snap.head);


    skeleton.snap.shoulder = {
      left: {
        cx: xVal - 45, 
        cy: 60, 
        id: 'left-shoulder-snap'
      }, 
      right: {
        cx: xVal + 45 + 12, 
        cy: 60, 
        id: 'right-shoulder-snap'
      }
    };

    var $leftShoulderSnap = handContainer.append('circle');
    snap($leftShoulderSnap, skeleton.snap.shoulder.left);
    var $rightShoulderSnap = handContainer.append('circle');
    snap($rightShoulderSnap, skeleton.snap.shoulder.right);





    skeleton.snap.elbow = {
      left: {
        cx: xVal - 45 - 30, 
        cy: 90, 
        id: 'left-elbow-snap'
      }, 
      right: {
        cx: xVal + 45 + 40, 
        cy: 90, 
        id: 'right-elbow-snap'
      }
    };

    var $leftElbowSnap = handContainer.append('circle');
    snap($leftElbowSnap, skeleton.snap.elbow.left);
    var $rightElbowSnap = handContainer.append('circle');
    snap($rightElbowSnap, skeleton.snap.elbow.right);*/
},

}