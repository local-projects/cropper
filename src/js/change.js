    change: function (shiftKey, event, target) {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var action = this.action;
      var container = this.container;
      var canvas = this.canvas;
      var index =  $(target).data('index');
      
      if (index !== undefined) {
        this.cropBoxIndex = index;
      }

      var cropBox;

      cropBox = this.cropBoxes[this.cropBoxIndex];
        
      if (!cropBox) {
        if (action === ACTION_CROP) {
          cropBox = {
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            minTop: 0,
            minLeft: 0,
            minWidth: 10,
            minHeight: 10,
          }
        }
      }

      
      var width = cropBox.width;
      var height = cropBox.height;
      var left = cropBox.left;
      var top = cropBox.top;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = container.width;
      var maxHeight = container.height;
      var renderable = true;
      var newCrop = false;
      var offset;
      var range;

      // Locking aspect ratio in "free mode" by holding shift key (#259)
      if (!aspectRatio && shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (this.isLimited) {
        minLeft = cropBox.minLeft;
        minTop = cropBox.minTop;
        maxWidth = minLeft + min(container.width, canvas.left + canvas.width);
        maxHeight = minTop + min(container.height, canvas.top + canvas.height);
      }

      range = {
        x: this.endX - this.startX,
        y: this.endY - this.startY
      };

      if (aspectRatio) {
        range.X = range.y * aspectRatio;
        range.Y = range.x / aspectRatio;
      }

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;

        // Resize crop box
        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top -= range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_WEST;
            width = 0;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left += range.X / 2;
          }

          if (height < 0) {
            action = ACTION_SOUTH;
            height = 0;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio &&
            (top <= minTop || bottom >= maxHeight))) {

            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;

          if (aspectRatio) {
            height = width / aspectRatio;
            top += range.Y / 2;
          }

          if (width < 0) {
            action = ACTION_EAST;
            width = 0;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio &&
            (left <= minLeft || right >= maxWidth))) {

            renderable = false;
            break;
          }

          height += range.y;

          if (aspectRatio) {
            width = height * aspectRatio;
            left -= range.X / 2;
          }

          if (height < 0) {
            action = ACTION_NORTH;
            height = 0;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += range.X;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            width += range.x;
            height = width / aspectRatio;
          } else {
            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = 0;
            width = 0;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = 0;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = 0;
          }

          break;

        // Move canvas
        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;

        // Zoom canvas
        case ACTION_ZOOM:
          this.zoom((function (x1, y1, x2, y2) {
            var z1 = sqrt(x1 * x1 + y1 * y1);
            var z2 = sqrt(x2 * x2 + y2 * y2);

            return (z2 - z1) / z1;
          })(
            abs(this.startX - this.startX2),
            abs(this.startY - this.startY2),
            abs(this.endX - this.endX2),
            abs(this.endY - this.endY2)
          ), event);
          this.startX2 = this.endX2;
          this.startY2 = this.endY2;
          renderable = false;
          break;

        // Create crop box
        case ACTION_CROP:
          if (!range.x || !range.y) {
            renderable = false;
            newCrop = false;
            break;
          }

          newCrop = true;
          offset = this.$cropper.offset();
          left = this.startX - offset.left;
          top = this.startY - offset.top;
          width = cropBox.minWidth;
          height = cropBox.minHeight;

          if (range.x > 0) {
            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
          } else if (range.x < 0) {
            left -= width;
            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
          }

          if (range.y < 0) {
            top -= height;
          }

          // Show the crop box if is hidden
          if (!this.isCropped) {
            this.$cropBox.removeClass(CLASS_HIDDEN);
            this.isCropped = true;

            if (this.isLimited) {
              this.limitCropBox(true, true, this.cropBoxIndex);
            }
          }

          break;

        // No default
      }

      if (newCrop) {
        var tempCropBox = $.extend({}, cropBox);
        tempCropBox.left = left;
        tempCropBox.top = top;
        tempCropBox.width = width;
        tempCropBox.height = height;
        this.buildNewCrop(tempCropBox);
        this.action = action;
        newCrop = false;
      }

      else if (renderable) {
        cropBox.width = width;
        cropBox.height = height;
        cropBox.left = left;
        cropBox.top = top;
        this.action = action;

        this.renderCropBox(this.cropBoxIndex);
      }

      // Override
      this.startX = this.endX;
      this.startY = this.endY;
    },
