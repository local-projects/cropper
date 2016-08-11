function init (options) {
	var optns = options || {};

	var crops = localStorage.getItem('crops');
	var data = JSON.parse(crops);
	this.preview = new Preview({'url': this.image});

	this.image = Defaults.crops[0];
	this.combinedProps = null;

	var self = this;
	
	$.getJSON('/demo/js/config.json', function(json) {
			
			self.combinedProps = $.extend(json, optns, data);
			console.log('combinedProps', self.combinedProps);

			self.preview = new Preview({'url': self.image});

			if (self.combinedProps.crops) {
				self.renderPreviews();
			}
			var sk = new Skeleton(self.combinedProps);
		})
		.error(function(req) {
			console.error(req);
		});

	this.renderPreviews = function () {
		for (var crop in this.combinedProps.crops) {
			var cr = this.combinedProps.crops[crop];
			console.log(cr.preview.preview);
			this.preview.addSavedPreview(crop, cr);
		}
	}


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