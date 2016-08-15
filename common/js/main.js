$(function () {

  'use strict';

  var console = window.console || { log: function () {} };
  var $image = $('#image');
  var $download = $('#download');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var preview = new PortraitMachine.Preview();

  var data = localStorage.getItem('crops');
  var json, crops;
  if (data) {
    json = JSON.parse(data);
    crops = json.crops || {};
  }

  var options = {
        aspectRatio: NaN,
        preview: '.img-preview',
        previewContainer: '.docs-preview',
        data: crops,
        cropstart: function (e) {
          console.log('cropstart');
        },
        crop: function (e) {
          $dataX.val(Math.round(e.x));
          $dataY.val(Math.round(e.y));
          $dataHeight.val(Math.round(e.height));
          $dataWidth.val(Math.round(e.width));
          $dataRotate.val(e.rotate);
          $dataScaleX.val(e.scaleX);
          $dataScaleY.val(e.scaleY);
        },
        cropend: function (e) {
          console.log('cropend');
        },
        attachedPreview: preview,
        cropBoxes : ['crop1', 'crop2'],
      };


  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Cropper
  $image.on({
    'build.cropper': function (e) {
      /*console.log('build.cropper');*/
    },
    'built.cropper': function (e) {
      /*console.log('built.cropper');*/
    },
    'cropstart.cropper': function (e) {
      /*console.log('cropstart.cropper');*/
    },
    'cropmove.cropper': function (e) {
      /*console.log('cropmove.cropper');*/
    },
    'cropend.cropper': function (e) {
      /*console.log('cropend.cropper');*/
    },
    'crop.cropper': function (e) {
      /*console.log('crop.cropper');*/
    },
    'zoom.cropper': function (e) {
      /*console.log('zoom.cropper');*/
    }
  }).cropper(options);

  /*$image.cropper(options);*/
  


  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }


  $('.get-data').on('click', function (event) {
    event.preventDefault();
    console.log($image.cropper('getData'));
  });

  $('.next-step').on('click', function (event) {
    var $this = $(this);
    var crops = $image.cropper('getData');
    var data = {'crops': crops}
    localStorage.setItem('crops', JSON.stringify(data));


  });

  $('.get-json').on('click', function (event) {
    event.preventDefault();
    /*var data = $image.cropper('getData');*/
    window.sk.getData();
    var data = localStorage.getItem('crops');
    if (data) {
      $('#putJson').val(data);
    }
    else {
      $('#putJson').val('Error getting data');
    }
  });


  // Keyboard
  $(document.body).on('keydown', function (e) {

    if (!$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }

  });


  // Import image
  var $inputImage = $('#inputImage');
  var URL = window.URL || window.webkitURL;
  var blobURL;

  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          blobURL = URL.createObjectURL(file);
          $image.one('built.cropper', function () {

            // Revoke when load complete
            URL.revokeObjectURL(blobURL);
          }).cropper('reset').cropper('replace', blobURL);
          $inputImage.val('');
        } else {
          window.alert('Please choose an image file.');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }

});
