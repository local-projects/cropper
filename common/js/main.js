$(function () {

  'use strict';

  var console = window.console || { log: function () {} };
  var $image = $('#image');
  var $btnSave = $('.btn.save');
  var $nextBtn = $('.next-step');
  var $cropBtn = $('.crop-step');
  var $saveJson = $('.save-json');
  var preview, portraitMachineInit;

  function init(){

    var data, json, crops, options;
    var docsPreview = $('.docs-preview');
    preview = new PortraitMachine.Preview({container: docsPreview});

    // TODO fetch initially from API instead of fetching using localStorage

    console.log('artWorkId', window.artWorkId);

    /*$.ajax({
      type: 'GET',
      url: "/admin/crop/" + window.artWorkId,
      dataType: 'jsonp',
      success: function (json) {
        console.log('fetched', json);
      },

    });*/


    data = localStorage.getItem('crops');
     
    if (data) {
      json = JSON.parse(data);
      crops = json.crops || {};
    }
    else {
      crops = {};
    }


    options = {
      aspectRatio: NaN,
      preview: '.img-preview',
      previewContainer: '.docs-preview',
      data: crops, 
      cropstart: function (e) {
        console.log('cropstart');
      },
      crop: function (e) {},
      cropend: function (e) {
        console.log('cropend');
        enableSave();
      },
      viewMode: 1,
      attachedPreview: preview,
      cropBoxes : ['crop1', 'crop2'],
    };

    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Cropper
    if ($image.prop('complete')) {
        onImageLoad();
      } else {
        $image.load(onImageLoad);
      }
    

    function onImageLoad(){ 
      var initW = $image.width();    

      $image.on({
        'build.cropper': function (e) {
          
          /*console.log('build.cropper');*/
        },
        'built.cropper': function (e) {

          var cropper = $image.data('cropper'),
              resizeW = $(".cropper-canvas").width(),
              scale = resizeW/initW;
   
          cropper.options.minCropBoxWidth = 50*scale;
          cropper.options.minCropBoxHeight = 50*scale; 
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

    }
  }




  

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

    // TODO Use initial fetched data (from above) instead of using localStorage
    // for getting old crops and skeleton previews.

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

    return data;

    // $btnSave.attr('disabled', true)
  }
  
  function goToNext(event){
    saveData();
    hideCropper();
    InitializeCropper();

    event.preventDefault();
  }

  function goToCrop(event){
    // window.location.reload();
    
    // should probably save Skeleton data
    saveSkeletonDataLocally();
    showCropper();
    InitializePreview();

    event.preventDefault();
  }

  function enableSave(){
    $nextBtn.removeAttr('disabled');
    $btnSave.removeAttr('disabled');
  }

  function disableSave(){
    // $nextBtn.attr('disabled',true);
    // $btnSave.attr('disabled',true);
  } 

  function hideCropper() {
    $('.img-container').removeClass('active');
    $nextBtn.addClass('active');
    $cropBtn.removeClass('active');
    $('#svg-container').addClass('active');
    $('.btns-container').addClass('active');
    $('.left-col').addClass('active');
    $('.docs-preview').removeClass('active');
    $('.skeleton-preview').addClass('active');
    $('#preview-tags').show();
  }

  function showCropper() {
    $('.img-container').addClass('active');
    $nextBtn.removeClass('active');
    $cropBtn.addClass('active');
    $('#svg-container').removeClass('active');
    $('.btns-container').removeClass('active');
    $('.left-col').removeClass('active');
    $('.docs-preview').addClass('active');
    $('.skeleton-preview').removeClass('active');
    $('.skeleton-preview').empty();
    $('#preview-tags').hide();
  }

  function InitializeCropper() {
    if(preview){
      preview.removeSubscribers();
      preview = null;
    }
    
    if (!portraitMachineInit) {
      try {
        portraitMachineInit = new PortraitMachine.Init();
      }
      catch(err) {
        console.error(err);
      }
    }
  }

  function InitializePreview() { 
    if(portraitMachineInit){
      portraitMachineInit.destroy();
      portraitMachineInit = null;
    }
   
    init(); 
  }

  function saveSkeletonData() {
    if(portraitMachineInit) portraitMachineInit.saveData();
  }

  function saveSkeletonDataLocally() {
    if(portraitMachineInit) portraitMachineInit.getData();
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
  $cropBtn.on('click', goToCrop);
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

  init();
});
