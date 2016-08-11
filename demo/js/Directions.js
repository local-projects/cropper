function Directions (options) {
	this.options = options || {};
	var defaultDirections = this.options.directions || 
						Directions.defaultDirections;

	this.defaultDirections = defaultDirections;
	this.currentDirections = [];
	this.container = null;
	this.init();
}

Directions.prototype = {
	constructor: Directions,

	init: function () {
		this.container = this.getDirectionTemplate();
		// this.addListener();
	},

	setCurrentDirection: function (direction) {
		this.currentDirections.push(direction);
	},

	getCurrentDirections: function () {
		return this.currentDirections;
	},

	getAllDirections: function () {
		return this.defaultDirections;
	},

	getTemplate: function () {
		return this.container;
	},

	addListener: function (el) {
		var self = this;
		el.on('click', function (event) {
			event.preventDefault();
			var dir = $(event.currentTarget).text();
			var button = $(this).parent().parent().parent().find('button');
			var buttonChildren = button.children();
			button.text(dir);
			button.append(buttonChildren);

			var dr = $.inArray(dir, self.currentDirections);
			if (dr <= 0) {
				self.currentDirections.push(dir);
			}
		});
	},

	getDirectionTemplate: function () {
		var list = '';

		for (var i = 0; i < this.defaultDirections.length; i++) {
			var dr = this.defaultDirections[i];

			list += "<li><a href='#'>"+dr+"</a></li>";
		}

		var dropdownContainer = $("<div class='dropdown-container'></div>");
		var dir	= $("<div class='dropdown'>" +
						"<button class='btn btn-default dropdown-toggle' type='button'"+ 
						"data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
						"Direction" +
						"<span class='caret'></span>" +
						"</button>" +
						"<ul class='dropdown-menu' aria-labelledby='dropdownMenu1'>" +
						list +
						"</ul>" +
					"</div>")

		dropdownContainer.append(dir);
		this.addListener(dir.find('.dropdown-menu a'));

		return dropdownContainer;
	},

	remove: function () {
		this.container.remove();
	}
}

Directions.defaultDirections = 
		[
			'None',
			'North', 
			'North-East', 
			'East', 
			'South-East', 
			'South', 
			'South-West', 
			'West', 
			'North-West'
		];