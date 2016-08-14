PortraitMachine.Init = function (options) {
	var optns = options || {};

	var crops = localStorage.getItem('crops');
	var data = JSON.parse(crops);
	// this.preview = new PortraitMachine.Preview({'url': this.image});
	this.preview = null;

	this.image = PortraitMachine.Defaults.crops[0];
	this.combinedProps = null;

	this.sk = null;
	this.container = null;

	var self = this;
	
	$.getJSON('/demo/js/config.json', function(json) {
			
			self.combinedProps = $.extend(json, optns, data);
			console.log('combinedProps', self.combinedProps);

			self.preview = new PortraitMachine.Preview({'url': self.image});

			if (self.combinedProps.crops) {
				self._renderPreviews();
			}
			self.sk = new PortraitMachine.Skeleton(self.combinedProps);
			self.container = self.sk.getContainer();
			PortraitMachine.Defaults.container = self.container;
			self._getData();
			self._saveData();
			self._attachListener();
		})
		.error(function(req) {
			console.error(req);
		});

	this._renderPreviews = function () {
		for (var crop in this.combinedProps.crops) {
			var cr = this.combinedProps.crops[crop];
			console.log(cr.preview.preview);
			this.preview.addSavedPreview(crop, cr);
		}
	}

	this._renderJointPreviews = function () {
		for (var crop in this.combinedProps) {
			var cr = this.combinedProps.crops[crop];
			console.log(cr.preview.preview);
			this.preview.addSavedPreview(crop, cr);
		}
	}

	this._getData = function () {
		var data = self.sk.getData();
		console.log(data);
	}

	this._saveData = function () {
		var self = this;
		$('.save-json').on('click', function () {
			var data = self.sk.getData();
			console.log(data);
		});
	}

	this._attachListener = function () {
		var self = this;
		if (this.container) {
			PortraitMachine.pubsub.subscribe('writeData', function () {
				var data = self.sk.getData();
				console.log(data);
			});
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

PortraitMachine.Init();


// https://davidwalsh.name/pubsub-javascript
PortraitMachine.pubsub = (function(){
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
})();