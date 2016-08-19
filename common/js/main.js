$(function () {

  'use strict';

  var console = window.console || { log: function () {} };
  var $image = $('#image');
  var $btnSave = $('.btn.save');
  var $nextBtn = $('.next-step');
  var $saveJson = $('.save-json');
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
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
        cropstart: function (e) {
          console.log('cropstart');
        },
        crop: function (e) {},
        cropend: function (e) {
          console.log('cropend');
          enableSave();
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
    'close.cropper': onClose
    ,
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

  function onClose(e){
    var crops = $image.cropper('getData');
    if (Object.keys(crops).length){
      enableSave();
    }else{
      disableSave();
    }
  }

  function saveData(){
    var crops = $image.cropper('getData');

    var oldCrops = localStorage.getItem('crops');
    var oldCropsCuts;
    
    // Keep previous previews
    if (oldCrops) {
      oldCrops = JSON.parse(oldCrops);
      oldCropsCuts = oldCrops.crops ? oldCrops.crops : {};
    }

    if (oldCropsCuts) {
      for (var occ in oldCropsCuts) {
        if (occ in crops) {
          crops[occ]['skeletonPreview'] = oldCropsCuts[occ]['skeletonPreview'];
        }
      }
    }
    

    var data = {'crops': crops}
    localStorage.setItem('crops', JSON.stringify(data));

    $btnSave.attr('disabled', true)
  }
  
  function goToNext(){
    saveData();
    hideCropper();
    InitializeCropper();
  }

  function enableSave(){
    $nextBtn.removeAttr('disabled');
    $btnSave.removeAttr('disabled');
  }

  function disableSave(){
    $nextBtn.attr('disabled',true);
    $btnSave.attr('disabled',true);
  } 

  function hideCropper() {
    $('.img-container').removeClass('active');
    $nextBtn.removeClass('active');
    $('#svg-container').addClass('active');
    $('.btns-container').addClass('active');
    $('.left-col').addClass('active');
    $('.docs-preview').empty();
  }

  function InitializeCropper() {
    preview.removeSubscribers();
    preview = null;
    PortraitMachine.Init();
  }

  function saveSkeletonData() {
    PortraitMachine._getData();
  }

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

  $nextBtn.on('click', goToNext);

  $btnSave.on("click", saveSkeletonData);

  $saveJson.on('click', saveSkeletonData);


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
