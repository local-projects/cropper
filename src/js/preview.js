    initPreview: function () {
      var crossOrigin = getCrossOrigin(this.crossOrigin);
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var $clone2;

      this.$preview = $(this.options.preview);
      this.$clone2 = $clone2 = $('<img' + crossOrigin + ' src="' + url + '">');
      this.$viewBox.html($clone2);
      this.previews[this.cropBoxIndex] = this.$preview;
      this.$preview.data(DATA_PREVIEW, {
          width: this.$preview.width(),
          height: this.$preview.height(),
          html: this.$preview.html(),
          index: this.cropBoxIndex
        });

      this.$preview.html(
        '<img' + crossOrigin + ' src="' + url + '" style="' +
        'display:block;width:100%;height:auto;' +
        'min-width:0!important;min-height:0!important;' +
        'max-width:none!important;max-height:none!important;' +
        'image-orientation:0deg!important;">'
      );

      if (this.attachedPreview) {
        this.addPreview(this.$preview[0]);
      }
      
    },

    initNewPreview: function (position) {
      var crossOrigin = getCrossOrigin(this.crossOrigin);
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var previewContainer = $(this.options.previewContainer);
      var prev = this.options.preview.replace('.', '');
      this.$preview = $('<div class="' + prev + ' preview-lg"></div>')
      previewContainer.append(this.$preview);
      this.previews[position] = this.$preview;

      this.$preview.data(DATA_PREVIEW, {
          width: this.$preview.width(),
          height: this.$preview.height(),
          html: this.$preview.html(),
          index: position
        });

      this.$preview.html(
        '<img' + crossOrigin + ' src="' + url + '" style="' +
        'display:block;width:100%;height:auto;' +
        'min-width:0!important;min-height:0!important;' +
        'max-width:none!important;max-height:none!important;' +
        'image-orientation:0deg!important;">'
      );

      if (this.attachedPreview) {
        this.addPreview(this.$preview[0]);
      }
      
    },

    addPreview: function (el) {
      this.attachedPreview.addPreview(el);
    },

    resetPreview: function () {
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
        var originalWidth = data.width;
        var originalHeight = data.height;
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

        prev.css({
          width: newWidth,
          height: newHeight
        }).find('img').css({
          width: width * ratio,
          height: height * ratio,
          marginLeft: -left * ratio,
          marginTop: -top * ratio,
          transform: getTransform(image)
        });
      }
    },

    deletePreview: function (closeIndex) {
      var prevs = $(this.options.preview)
      $.each(prevs, function (index, prev) {
        if (closeIndex === $(prev).data('preview')['index']) {
          $(prev).remove();
        }
      });
    },
