    build: function () {
      var options = this.options;
      var $this = this.$element;
      var $clone = this.$clone;
      var $cropper;
      var $cropBox;
      var $face;
      var index;

      if (!this.isLoaded) {
        return;
      }

      // Unbuild first when replace
      if (this.isBuilt) {
        this.unbuild();
      }

      // Create cropper elements
      this.$container = $this.parent();
      this.$cropBoxes = {};
      /*this.$cropper = $cropper = $(Cropper.ORIGINAL_TEMPLATE);*/
      this.$cropper = $cropper = $(Cropper.TEMPLATE);
      this.$canvas = $cropper.find('.cropper-canvas').append($clone);
      this.$dragBox = $cropper.find('.cropper-drag-box');
      this.$cropBox = $cropBox = $(Cropper.CROP_TEMPLATE1);
      index = generateUUID();
      this.cropBoxIndex = index;
      this.$cropBoxes[index] = this.$cropBox;
      this.$viewBox = $cropper.find('.cropper-view-box');
      this.$face = $face = $cropBox.find('.cropper-face');
      $face.parent().data('index', index);

      // Hide the original image
      $cropper.append($cropBox);
      $this.addClass(CLASS_HIDDEN).after($cropper);

      // Show the clone image if is hidden
      if (!this.isImg) {
        $clone.removeClass(CLASS_HIDE);
      }

      this.initPreview();
      this.bind();

      options.aspectRatio = max(0, options.aspectRatio) || NaN;
      options.viewMode = max(0, min(3, round(options.viewMode))) || 0;

      if (options.autoCrop) {
        this.isCropped = true;

        if (options.modal) {
          this.$dragBox.addClass(CLASS_MODAL);
        }
      } else {
        $cropBox.addClass(CLASS_HIDDEN);
      }

      if (!options.guides) {
        $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
      }

      if (!options.center) {
        $cropBox.find('.cropper-center').addClass(CLASS_HIDDEN);
      }

      if (options.cropBoxMovable) {
        $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
        // $face.data('index', this.cropBoxIndex);
      }

      this.closeCrop();

      if (!options.highlight) {
        $face.addClass(CLASS_INVISIBLE);
      }

      if (options.background) {
        $cropper.addClass(CLASS_BG);
      }

      if (!options.cropBoxResizable) {
        $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
      }

      this.setDragMode(options.dragMode);
      this.render();
      this.isBuilt = true;
      this.setData(options.data);
      $this.one(EVENT_BUILT, options.built);

      // Trigger the built event asynchronously to keep `data('cropper')` is defined
      setTimeout($.proxy(function () {
        this.trigger(EVENT_BUILT);
        this.trigger(EVENT_CROP, this.getData());
        this.isCompleted = true;
      }, this), 0);
    },

    buildNewCrop: function(cropOptions, newIndex) {
      var options = this.options;
      var $clone = this.$clone;
      var $cropper = this.$cropper;
      var $cropBox;
      var $face;
      var index;

      if (!this.isLoaded) {
        return;
      }

      // Unbuild first when replace
      /*if (this.isBuilt) {
        this.unbuild();
      }*/

      // Create cropper elements
      this.$cropBox = $cropBox = $(Cropper.CROP_TEMPLATE);
      index = newIndex || generateUUID();
      this.cropBoxIndex = index;
      this.$cropBoxes[index] = this.$cropBox;

      this.$viewBox = $cropper.find('.cropper-view-box');
      this.$face = $face = $cropBox.find('.cropper-face');
      $face.parent().data('index', index);

      // Hide the original image
      $cropper.append($cropBox);

      this.closeCrop();

      // Show the clone image if is hidden
      if (!this.isImg) {
        $clone.removeClass(CLASS_HIDE);
      }

      /*this.initPreview();*/
      this.initNewPreview(index);
      this.bind();

      /*if (options.cropBoxMovable) {
        $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
        $face.data('index', this.cropBoxes.length);
      }*/

      options.aspectRatio = max(0, options.aspectRatio) || NaN;
      options.viewMode = max(0, min(3, round(options.viewMode))) || 0;

      if (options.autoCrop) {
        this.isCropped = true;

        if (options.modal) {
          this.$dragBox.addClass(CLASS_MODAL);
        }
      } else {
        $cropBox.addClass(CLASS_HIDDEN);
      }

      if (!options.guides) {
        $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
      }

      if (!options.center) {
        $cropBox.find('.cropper-center').addClass(CLASS_HIDDEN);
      }

      if (options.cropBoxMovable) {
        $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
      }

      if (!options.highlight) {
        $face.addClass(CLASS_INVISIBLE);
      }

      if (options.background) {
        $cropper.addClass(CLASS_BG);
      }

      if (!options.cropBoxResizable) {
        $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
      }

      this.setDragMode(options.dragMode);
      this.render(cropOptions);
      /*$this.one(EVENT_BUILT, options.built);*/

      // Trigger the built event asynchronously to keep `data('cropper')` is defined
      /*setTimeout($.proxy(function () {
        this.trigger(EVENT_BUILT);
        this.trigger(EVENT_CROP, this.getData());
        this.isCompleted = true;
      }, this), 0);*/
    },

    closeCrop: function (indexToClose) {

      if (indexToClose) {
        var closeEl = this.$cropBoxes[indexToClose];
        if (!closeEl) {
          return;
        }

        var closeIndex = this.$cropBoxes[indexToClose].data('index');
        this.close(closeIndex);
        closeEl.remove();
        event.preventDefault();
      }
      else {
        var that = this;
        $('.close-icon').click(function(event) {
          var closeIndex = $(this).parent().data('index');
          that.close.call(that, closeIndex);
          $(this).parent().remove();
          event.preventDefault();
        });
      }
    },

    close: function (closeIndex) {
      delete this.cropBoxes[closeIndex];
      delete this.$cropBoxes[closeIndex];
      delete this.previews[closeIndex];
      this.deletePreview(closeIndex);
      var keys = Object.keys(this.cropBoxes);
      
      if (this.cropBoxIndex === closeIndex) {
        if (keys.length > 0) {
          this.cropBoxIndex = keys[0];
        }
        else {
          this.cropBoxIndex = null;
          this.cropBox = null;
          this.$cropBox = null;
        }

      }
    },

    unbuild: function () {
      if (!this.isBuilt) {
        return;
      }

      this.isBuilt = false;
      this.isCompleted = false;
      this.initialImage = null;

      // Clear `initialCanvas` is necessary when replace
      this.initialCanvas = null;
      this.initialCropBox = null;
      this.container = null;
      this.canvas = null;

      // Clear `cropBox` is necessary when replace
      this.cropBox = null;
      this.cropBoxes = null;
      this.previews = null;
      this.unbind();

      this.resetPreview();
      this.$preview = null;

      this.$viewBox = null;
      this.$cropBox = null;
      this.$cropBoxes = null;
      this.$dragBox = null;
      this.$canvas = null;
      this.$container = null;

      this.$cropper.remove();
      this.$cropper = null;
    },
