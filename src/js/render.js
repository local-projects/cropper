    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();

      this.renderCanvas();

      if (this.isCropped) {
        this.renderCropBox();
      }
    },

    renderNewCropBox: function (cropOptions) {
      this.initCropBox(cropOptions);

      if (this.isCropped) {
        this.renderCropBox(getObjSize(this.cropBoxes) - 1);
      }
    },

    initContainer: function () {
      var options = this.options;
      var $this = this.$element;
      var $container = this.$container;
      var $cropper = this.$cropper;

      $cropper.addClass(CLASS_HIDDEN);
      $this.removeClass(CLASS_HIDDEN);

      $cropper.css((this.container = {
        width: max($container.width(), num(options.minContainerWidth) || 200),
        height: max($container.height(), num(options.minContainerHeight) || 100)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    // Canvas (image wrapper)
    initCanvas: function () {
      var viewMode = this.options.viewMode;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var image = this.image;
      var imageNaturalWidth = image.naturalWidth;
      var imageNaturalHeight = image.naturalHeight;
      var is90Degree = abs(image.rotate) === 90;
      var naturalWidth = is90Degree ? imageNaturalHeight : imageNaturalWidth;
      var naturalHeight = is90Degree ? imageNaturalWidth : imageNaturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var canvasWidth = containerWidth;
      var canvasHeight = containerHeight;
      var canvas;

      if (containerHeight * aspectRatio > containerWidth) {
        if (viewMode === 3) {
          canvasWidth = containerHeight * aspectRatio;
        } else {
          canvasHeight = containerWidth / aspectRatio;
        }
      } else {
        if (viewMode === 3) {
          canvasHeight = containerWidth / aspectRatio;
        } else {
          canvasWidth = containerHeight * aspectRatio;
        }
      }

      canvas = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: aspectRatio,
        width: canvasWidth,
        height: canvasHeight
      };

      canvas.oldLeft = canvas.left = (containerWidth - canvasWidth) / 2;
      canvas.oldTop = canvas.top = (containerHeight - canvasHeight) / 2;

      this.canvas = canvas;
      this.isLimited = (viewMode === 1 || viewMode === 2);
      this.limitCanvas(true, true);
      this.initialImage = $.extend({}, image);
      this.initialCanvas = $.extend({}, canvas);
    },

    limitSingleCanvas: function (isSizeLimited, isPositionLimited, j) {
      var options = this.options;
      var viewMode = options.viewMode;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      var aspectRatio = canvas.aspectRatio;
      var cropBox = this.cropBoxes[this.cropBoxIndex] || this.cropBox;
      /*var cropBox = this.cropBoxes[j] || this.cropBox;*/
      var isCropped = this.isCropped && cropBox;
      var minCanvasWidth;
      var minCanvasHeight;
      var newCanvasLeft;
      var newCanvasTop;

      if (isSizeLimited) {
        minCanvasWidth = num(options.minCanvasWidth) || 0;
        minCanvasHeight = num(options.minCanvasHeight) || 0;

        if (viewMode) {
          if (viewMode > 1) {
            minCanvasWidth = max(minCanvasWidth, containerWidth);
            minCanvasHeight = max(minCanvasHeight, containerHeight);

            if (viewMode === 3) {
              if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                minCanvasWidth = minCanvasHeight * aspectRatio;
              } else {
                minCanvasHeight = minCanvasWidth / aspectRatio;
              }
            }
          } else {
            if (minCanvasWidth) {
              minCanvasWidth = max(minCanvasWidth, isCropped ? cropBox.width : 0);
            } else if (minCanvasHeight) {
              minCanvasHeight = max(minCanvasHeight, isCropped ? cropBox.height : 0);
            } else if (isCropped) {
              minCanvasWidth = cropBox.width;
              minCanvasHeight = cropBox.height;

              if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                minCanvasWidth = minCanvasHeight * aspectRatio;
              } else {
                minCanvasHeight = minCanvasWidth / aspectRatio;
              }
            }
          }
        }

        if (minCanvasWidth && minCanvasHeight) {
          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          } else {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          }
        } else if (minCanvasWidth) {
          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else if (minCanvasHeight) {
          minCanvasWidth = minCanvasHeight * aspectRatio;
        }

        canvas.minWidth = minCanvasWidth;
        canvas.minHeight = minCanvasHeight;
        canvas.maxWidth = Infinity;
        canvas.maxHeight = Infinity;
      }

      if (isPositionLimited) {
        if (viewMode) {
          newCanvasLeft = containerWidth - canvas.width;
          newCanvasTop = containerHeight - canvas.height;

          canvas.minLeft = min(0, newCanvasLeft);
          canvas.minTop = min(0, newCanvasTop);
          canvas.maxLeft = max(0, newCanvasLeft);
          canvas.maxTop = max(0, newCanvasTop);

          if (isCropped && this.isLimited) {
            canvas.minLeft = min(
              cropBox.left,
              cropBox.left + cropBox.width - canvas.width
            );
            canvas.minTop = min(
              cropBox.top,
              cropBox.top + cropBox.height - canvas.height
            );
            canvas.maxLeft = cropBox.left;
            canvas.maxTop = cropBox.top;

            if (viewMode === 2) {
              if (canvas.width >= containerWidth) {
                canvas.minLeft = min(0, newCanvasLeft);
                canvas.maxLeft = max(0, newCanvasLeft);
              }

              if (canvas.height >= containerHeight) {
                canvas.minTop = min(0, newCanvasTop);
                canvas.maxTop = max(0, newCanvasTop);
              }
            }
          }
        } else {
          canvas.minLeft = -canvas.width;
          canvas.minTop = -canvas.height;
          canvas.maxLeft = containerWidth;
          canvas.maxTop = containerHeight;
        }
      }
    },

    limitCanvas: function (isSizeLimited, isPositionLimited, j) {
      
      /*if (j) {
        this.limitSingleCanvas(isSizeLimited, isPositionLimited, j);
        return;
      }*/

      this.limitSingleCanvas(isSizeLimited, isPositionLimited);
      return;

      var options = this.options;
      var viewMode = options.viewMode;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      var aspectRatio = canvas.aspectRatio;
      /*var cropBox = this.cropBox;*/
      var cropBoxes = this.cropBoxes;
      var isCropped = this.isCropped && this.cropBox;
      var minCanvasWidth;
      var minCanvasHeight;
      var newCanvasLeft;
      var newCanvasTop;
      var that = this;

      $.each(cropBoxes, function (index, cropBox){
        if (isSizeLimited) {
          minCanvasWidth = num(options.minCanvasWidth) || 0;
          minCanvasHeight = num(options.minCanvasHeight) || 0;

          if (viewMode) {
            if (viewMode > 1) {
              minCanvasWidth = max(minCanvasWidth, containerWidth);
              minCanvasHeight = max(minCanvasHeight, containerHeight);

              if (viewMode === 3) {
                if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                  minCanvasWidth = minCanvasHeight * aspectRatio;
                } else {
                  minCanvasHeight = minCanvasWidth / aspectRatio;
                }
              }
            } else {
              if (minCanvasWidth) {
                minCanvasWidth = max(minCanvasWidth, isCropped ? cropBox.width : 0);
              } else if (minCanvasHeight) {
                minCanvasHeight = max(minCanvasHeight, isCropped ? cropBox.height : 0);
              } else if (isCropped) {
                minCanvasWidth = cropBox.width;
                minCanvasHeight = cropBox.height;

                if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                  minCanvasWidth = minCanvasHeight * aspectRatio;
                } else {
                  minCanvasHeight = minCanvasWidth / aspectRatio;
                }
              }
            }
          }

          if (minCanvasWidth && minCanvasHeight) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            } else {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            }
          } else if (minCanvasWidth) {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          } else if (minCanvasHeight) {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          }

          canvas.minWidth = minCanvasWidth;
          canvas.minHeight = minCanvasHeight;
          canvas.maxWidth = Infinity;
          canvas.maxHeight = Infinity;
        }

        if (isPositionLimited) {
          if (viewMode) {
            newCanvasLeft = containerWidth - canvas.width;
            newCanvasTop = containerHeight - canvas.height;

            canvas.minLeft = min(0, newCanvasLeft);
            canvas.minTop = min(0, newCanvasTop);
            canvas.maxLeft = max(0, newCanvasLeft);
            canvas.maxTop = max(0, newCanvasTop);

            if (isCropped && that.isLimited) {
              canvas.minLeft = min(
                cropBox.left,
                cropBox.left + cropBox.width - canvas.width
              );
              canvas.minTop = min(
                cropBox.top,
                cropBox.top + cropBox.height - canvas.height
              );
              canvas.maxLeft = cropBox.left;
              canvas.maxTop = cropBox.top;

              if (viewMode === 2) {
                if (canvas.width >= containerWidth) {
                  canvas.minLeft = min(0, newCanvasLeft);
                  canvas.maxLeft = max(0, newCanvasLeft);
                }

                if (canvas.height >= containerHeight) {
                  canvas.minTop = min(0, newCanvasTop);
                  canvas.maxTop = max(0, newCanvasTop);
                }
              }
            }
          } else {
            canvas.minLeft = -canvas.width;
            canvas.minTop = -canvas.height;
            canvas.maxLeft = containerWidth;
            canvas.maxTop = containerHeight;
          }
        }
      });
    },

    renderCanvas: function (isChanged) {
      var canvas = this.canvas;
      var image = this.image;
      var rotate = image.rotate;
      var naturalWidth = image.naturalWidth;
      var naturalHeight = image.naturalHeight;
      var aspectRatio;
      var rotated;

      if (this.isRotated) {
        this.isRotated = false;

        // Computes rotated sizes with image sizes
        rotated = getRotatedSizes({
          width: image.width,
          height: image.height,
          degree: rotate
        });

        aspectRatio = rotated.width / rotated.height;

        if (aspectRatio !== canvas.aspectRatio) {
          canvas.left -= (rotated.width - canvas.width) / 2;
          canvas.top -= (rotated.height - canvas.height) / 2;
          canvas.width = rotated.width;
          canvas.height = rotated.height;
          canvas.aspectRatio = aspectRatio;
          canvas.naturalWidth = naturalWidth;
          canvas.naturalHeight = naturalHeight;

          // Computes rotated sizes with natural image sizes
          if (rotate % 180) {
            rotated = getRotatedSizes({
              width: naturalWidth,
              height: naturalHeight,
              degree: rotate
            });

            canvas.naturalWidth = rotated.width;
            canvas.naturalHeight = rotated.height;
          }

          this.limitCanvas(true, false);
        }
      }

      if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
        canvas.left = canvas.oldLeft;
      }

      if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
        canvas.top = canvas.oldTop;
      }

      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

      this.limitCanvas(false, true);

      canvas.oldLeft = canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
      canvas.oldTop = canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

      this.$canvas.css({
        width: canvas.width,
        height: canvas.height,
        left: canvas.left,
        top: canvas.top
      });

      this.renderImage();

      if (this.isCropped && this.isLimited) {
        this.limitCropBox(true, true);
      }

      if (isChanged) {
        this.output();
      }
    },

    renderImage: function (isChanged) {
      var canvas = this.canvas;
      var image = this.image;
      var reversed;

      if (image.rotate) {
        reversed = getRotatedSizes({
          width: canvas.width,
          height: canvas.height,
          degree: image.rotate,
          aspectRatio: image.aspectRatio
        }, true);
      }

      $.extend(image, reversed ? {
        width: reversed.width,
        height: reversed.height,
        left: (canvas.width - reversed.width) / 2,
        top: (canvas.height - reversed.height) / 2
      } : {
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0
      });

      this.$clone.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getTransform(image)
      });

      if (isChanged) {
        this.output();
      }
    },

    initCropBox: function (cropOptions) {
      var options = this.options;
      var canvas = this.canvas;
      var index = getObjSize(this.cropBoxes);
      var aspectRatio = options.aspectRatio;
      var autoCropArea = num(options.autoCropArea) || 0.8;
      var cropBox;
      if (cropOptions) {
        cropBox = {
          width: cropOptions.width,
          height: cropOptions.height
        };
      }
      else {
        cropBox = {
          width: canvas.width,
          height: canvas.height
        };
      }

      if (aspectRatio) {
        if (cropOptions) {
          if (cropOptions.height * aspectRatio > cropOptions.width) {
            cropOptions.height = cropOptions.width / aspectRatio;
          } else {
            cropOptions.width = cropOptions.height * aspectRatio;
          }
        }
        else {
          if (canvas.height * aspectRatio > canvas.width) {
            cropBox.height = cropBox.width / aspectRatio;
          } else {
            cropBox.width = cropBox.height * aspectRatio;
          }
        }
      }

      this.cropBox = cropBox;
      this.cropBoxes[index] = this.cropBox;
      this.cropBoxIndex = index;
      this.limitCropBox(true, true, index);

      // Initialize auto crop area
      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      // The width of auto crop area must large than "minWidth", and the height too. (#164)
      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
      
      if (cropOptions) {
        cropBox.oldLeft = cropBox.left = cropOptions.left + (cropOptions.width - cropBox.width) / 2;
        cropBox.oldTop = cropBox.top = cropOptions.top + (cropOptions.height - cropBox.height) / 2;
      }
      else {
        cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
        cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;
      }

      this.initialCropBox = $.extend({}, cropBox);
    },

    limitSingleCropBox: function (isSizeLimited, isPositionLimited, j) {
      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      var cropBox = this.cropBoxes[j] || this.cropBox;
      var isLimited = this.isLimited;
      var minCropBoxWidth;
      var minCropBoxHeight;
      var maxCropBoxWidth;
      var maxCropBoxHeight;

      if (isSizeLimited) {
        minCropBoxWidth = num(options.minCropBoxWidth) || 0;
        minCropBoxHeight = num(options.minCropBoxHeight) || 0;

        // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
        minCropBoxWidth = min(minCropBoxWidth, containerWidth);
        minCropBoxHeight = min(minCropBoxHeight, containerHeight);
        maxCropBoxWidth = min(containerWidth, isLimited ? canvas.width : containerWidth);
        maxCropBoxHeight = min(containerHeight, isLimited ? canvas.height : containerHeight);

        if (aspectRatio) {
          if (minCropBoxWidth && minCropBoxHeight) {
            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }
          } else if (minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else if (minCropBoxHeight) {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }

          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
          } else {
            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
          }
        }

        // The minWidth/Height must be less than maxWidth/Height
        cropBox.minWidth = min(minCropBoxWidth, maxCropBoxWidth);
        cropBox.minHeight = min(minCropBoxHeight, maxCropBoxHeight);
        cropBox.maxWidth = maxCropBoxWidth;
        cropBox.maxHeight = maxCropBoxHeight;
      }

      if (isPositionLimited) {
        if (isLimited) {
          cropBox.minLeft = max(0, canvas.left);
          cropBox.minTop = max(0, canvas.top);
          cropBox.maxLeft = min(containerWidth, canvas.left + canvas.width) - cropBox.width;
          cropBox.maxTop = min(containerHeight, canvas.top + canvas.height) - cropBox.height;
        } else {
          cropBox.minLeft = 0;
          cropBox.minTop = 0;
          cropBox.maxLeft = containerWidth - cropBox.width;
          cropBox.maxTop = containerHeight - cropBox.height;
        }
      }
    },

    limitCropBox: function (isSizeLimited, isPositionLimited, j) {

      if (!isNaN(j)) {
        this.limitSingleCropBox(isSizeLimited, isPositionLimited, j);
        return;
      }

      var options = this.options;
      var aspectRatio = options.aspectRatio;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var canvas = this.canvas;
      /*var cropBox = this.cropBox;*/
      var cropBoxes = this.cropBoxes;
      var isLimited = this.isLimited;
      var minCropBoxWidth;
      var minCropBoxHeight;
      var maxCropBoxWidth;
      var maxCropBoxHeight;
      var that = this;

      $.each(cropBoxes, function (index, cropBox){
        if (isSizeLimited) {
          minCropBoxWidth = num(options.minCropBoxWidth) || 0;
          minCropBoxHeight = num(options.minCropBoxHeight) || 0;

          // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
          minCropBoxWidth = min(minCropBoxWidth, containerWidth);
          minCropBoxHeight = min(minCropBoxHeight, containerHeight);
          maxCropBoxWidth = min(containerWidth, isLimited ? canvas.width : containerWidth);
          maxCropBoxHeight = min(containerHeight, isLimited ? canvas.height : containerHeight);

          if (aspectRatio) {
            if (minCropBoxWidth && minCropBoxHeight) {
              if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
                minCropBoxHeight = minCropBoxWidth / aspectRatio;
              } else {
                minCropBoxWidth = minCropBoxHeight * aspectRatio;
              }
            } else if (minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else if (minCropBoxHeight) {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }

            if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
              maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
            } else {
              maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
            }
          }

          // The minWidth/Height must be less than maxWidth/Height
          cropBox.minWidth = min(minCropBoxWidth, maxCropBoxWidth);
          cropBox.minHeight = min(minCropBoxHeight, maxCropBoxHeight);
          cropBox.maxWidth = maxCropBoxWidth;
          cropBox.maxHeight = maxCropBoxHeight;
        }

        if (isPositionLimited) {
          if (isLimited) {
            cropBox.minLeft = max(0, canvas.left);
            cropBox.minTop = max(0, canvas.top);
            cropBox.maxLeft = min(containerWidth, canvas.left + canvas.width) - cropBox.width;
            cropBox.maxTop = min(containerHeight, canvas.top + canvas.height) - cropBox.height;
          } else {
            cropBox.minLeft = 0;
            cropBox.minTop = 0;
            cropBox.maxLeft = containerWidth - cropBox.width;
            cropBox.maxTop = containerHeight - cropBox.height;
          }
        }
      });
    },

    renderSingleCropBox: function (index) {
      var options = this.options;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var cropBoxIndex = index || this.cropBoxIndex;
      var cropBox = this.cropBoxes[cropBoxIndex] || this.cropBox;

      if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
        cropBox.left = cropBox.oldLeft;
      }

      if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
        cropBox.top = cropBox.oldTop;
      }

      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      this.limitCropBox(false, true, index);

      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
      cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

      if (options.movable && options.cropBoxMovable) {

        // Turn to move the canvas when the crop box is equal to the container
        this.$face.data(DATA_ACTION, (cropBox.width === containerWidth && cropBox.height === containerHeight) ? ACTION_MOVE : ACTION_ALL);
      }

      var $cropBox = this.$cropBoxes[cropBoxIndex] || this.$cropBox;
      
      $cropBox.css({
        width: cropBox.width,
        height: cropBox.height,
        left: cropBox.left,
        top: cropBox.top
      });

      if (this.isCropped && this.isLimited) {
        this.limitCanvas(true, true, index);
      }

      if (!this.isDisabled) {
        this.output();
      }
    },

    renderCropBox: function (j) {

      if (!isNaN(j)) {
        this.renderSingleCropBox(j);
        return;
      }

      var options = this.options;
      var container = this.container;
      var containerWidth = container.width;
      var containerHeight = container.height;
      var cropBoxes = this.cropBoxes;
      /*var cropBoxIndex = index || this.cropBoxIndex;
      var cropBox = this.cropBoxes[cropBoxIndex] || this.cropBox;*/
      var that = this;

      $.each(cropBoxes, function (index, cropBox) {

        if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
          cropBox.left = cropBox.oldLeft;
        }

        if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
          cropBox.top = cropBox.oldTop;
        }

        cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
        cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

        that.limitCropBox(false, true);

        cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
        cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

        if (options.movable && options.cropBoxMovable) {

          // Turn to move the canvas when the crop box is equal to the container
          that.$face.data(DATA_ACTION, (cropBox.width === containerWidth && cropBox.height === containerHeight) ? ACTION_MOVE : ACTION_ALL);
        }

        var $cropBox = that.$cropBoxes[index] || that.$cropBox;
        
        $cropBox.css({
          width: cropBox.width,
          height: cropBox.height,
          left: cropBox.left,
          top: cropBox.top
        });

        if (that.isCropped && that.isLimited) {
          that.limitCanvas(true, true);
        }

        if (!that.isDisabled) {
          that.output();
        }
      });
    },

    output: function () {
      this.preview();

      if (this.isCompleted) {
        this.trigger(EVENT_CROP, this.getData());
      }
    },
