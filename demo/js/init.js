function init (options) {
	var optns = options || {};

	var crops = localStorage.getItem('crops');
	var data = JSON.parse(crops);
	
	$.getJSON('/demo/js/config.json', function(json) {
			
			var combinedProps = $.extend(json, optns, data);
			console.log('combinedProps', combinedProps);

			var sk = new Skeleton(combinedProps);
		})
		.error(function(req) {
			console.error(req);
		});


	/*$.ajax({
      type: 'GET',
      url: "<endpoint>",
      dataType: jsonp,
      success: function (data) {
        var combinedProps = $.extend(optns, data);
		console.log('combinedProps', combinedProps);

		var sk = new Skeleton(combinedProps);
      },

    });*/
}

init();