    initPreview: function (position, direction) {
      var crossOrigin = getCrossOrigin(this.crossOrigin);
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var $clone2;
      
      if (this.$viewBox.length < 1) {
        this.$clone2 = $clone2 = $('<img' + crossOrigin + ' src="' + url + '">');
        this.$viewBox.html($clone2);
        this.$preview = $(this.options.preview);
        if (this.$preview.length === 0) {
          this.setPreview();
        }
      }
      else {
        this.setPreview();
      }

      var previewContainer = $(this.options.previewContainer);
      previewContainer.append(this.$preview);
      
      this.previews[position] = this.$preview;
      
      this.$preview.data(DATA_PREVIEW, {
          width: this.$preview.width(),
          height: this.$preview.height(),
          html: this.$preview.html(),
          index: this.cropBoxIndex
        });

      this.previewsData[position] = this.$preview.data();

      if (this.attachedPreview) {
        var template = this.attachedPreview.getTemplate(url, crossOrigin);
        this.$preview.html(template);
        this.addPreview(position, direction);
      }
      
    },

    setPreview: function () {
      var prev = this.options.preview.replace('.', '');
      this.$preview = $('<div class="' + prev + ' preview-lg"></div>')
    },

    addPreview: function (index, direction) {
      this.attachedPreview.addPreview(index, direction);
      // this.attachedPreview.addDirectionTemplate();
    },

    deletePreview: function (closeIndex) {
      var self = this;
      var prevs = $(this.options.preview)
      $.each(prevs, function (index, prev) {
        if (closeIndex === $(prev).data('preview')['index']) {
          $(prev).remove();
          self.attachedPreview.removePreview(closeIndex);
        }
      });
    },

    resetPreview: function () {
      if (!this.$preview) {
        return;
      }

      this.$preview.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_PREVIEW);

        $this.css({
          width: data.width,
          height: data.height
        }).html(data.html).removeData(DATA_PREVIEW);
      });
    },

    preview: function () {
      var image = this.image;
      var canvas = this.canvas;
      var cropBox = this.cropBoxes[this.cropBoxIndex] || this.cropBox;
      var cropBoxWidth = cropBox.width;
      var cropBoxHeight = cropBox.height;
      var width = image.width;
      var height = image.height;
      var left = cropBox.left - canvas.left - image.left;
      var top = cropBox.top - canvas.top - image.top;
      var prev = this.previews[this.cropBoxIndex];

      if (!this.isCropped || this.isDisabled) {
        return;
      }

      /*this.$clone2.css({
        width: width,
        height: height,
        marginLeft: -left,
        marginTop: -top,
        transform: getTransform(image)
      });*/

      if (prev) {
        var data = prev.data(DATA_PREVIEW);
        var originalWidth = data? data.width : 0; 
        var originalHeight = data? data.height : 0;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
            ratio = originalWidth / cropBoxWidth;
            newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        var imgWidth = width * ratio;
        var imgHeight = height * ratio;
        var imgMarginLeft = -left * ratio;
        var imgMarginTop = -top * ratio;

        prev.data(DATA_PREVIEW, {
          width: originalWidth,
          height: originalHeight,
          containerWidth: newWidth,
          containerHeight: newHeight,
          imgWidth: imgWidth,
          imgHeight: imgHeight,
          imgMarginLeft: imgMarginLeft,
          imgMarginTop: imgMarginTop,
          index: this.cropBoxIndex
        });

        prev.css({
          width: newWidth,
          height: newHeight
        }).find('img').css({
          width: imgWidth,
          height: imgHeight,
          marginLeft: imgMarginLeft,
          marginTop: imgMarginTop,
          transform: getTransform(image)
        });

      }
    },
