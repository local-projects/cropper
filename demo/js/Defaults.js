	function Defaults() {
		var containerWid = 375, containerHt = 500;
		var xVal = (containerWid - 10) / 2;
		var yVal = 10;
		var shoulderPos = 50;
		var torsoHt = 200;

		this.pivots = {

			'torso': {
				x: xVal - 5,
				y: yVal - 5,
				id: 'torso',
				class: 'pivot'
			},

			'elbow-left': {
				x: xVal - 67.5,
				y: shoulderPos + 15,
				id: 'elbow-left',
				class: 'pivot'
			},

			'elbow-right': {
				x: xVal + 57.5,
				y: shoulderPos + 15,
				id: 'elbow-right',
				class: 'pivot'
			},

			'hand-left': {
				x: xVal - 45 - 47 - 10,
				y: shoulderPos + 55,
				id: 'hand-left',
				class: 'pivot'
			},

			'hand-right': {
				x: xVal + 45 + 47,
				y: shoulderPos + 55,
				id: 'hand-right',
				class: 'pivot'
			}


		};

		this.skeleton = {
			container: {
				width: containerWid, 
				height: containerHt
			},

			common: {
				width: 10,
				fill: 'lightgrey'
			},

			torso : {
				x: xVal, 
				y: yVal, 
				height: torsoHt, 
				id: 'torso-body',
				partOf: 'body'
			},

			leftShoulder: {
				x: xVal, 
				y: shoulderPos, 
				height: 60, 
				style: 'transform: rotate(70deg)', 
				class: 'left-hand', 
				id: 'left-shoulder',
				partOf: 'hand'
			},

			rightShoulder: {
				x: xVal, 
				y: shoulderPos, 
				height: 60, 
				style: 'transform: rotate(-70deg)', 
				class: 'right-hand', 
				id: 'right-shoulder',
				partOf: 'hand',
			},

			leftElbow: {
				x: xVal - 57.5, 
				/*x: 125, */
				y: shoulderPos + 20, 
				height: 50, 
				style: 'transform:rotate(45deg)', 
				class: 'left-hand', 
				id: 'left-elbow',
				partOf: 'hand',
			},

			rightElbow: {
				x: xVal + 57.5, 
				/*x: 240,*/
				y: shoulderPos + 20, 
				height: 50, 
				style: 'transform:rotate(-45deg)', 
				class: 'right-hand', 
				id: 'right-elbow',
				partOf: 'hand',
			},

			leftHand: {
				x: xVal - 45 - 47, 
				y: shoulderPos + 55, 
				height: 50, 
				style: 'transform:rotate(35deg)', 
				class: 'left-hand', 
				id: 'left-hand',
				partOf: 'hand',
			},

			rightHand: {
				x: xVal + 45 + 47, 
				y: shoulderPos + 55, 
				height: 50, 
				style: 'transform:rotate(-35deg)', 
				class: 'right-hand', 
				id: 'right-hand',
				partOf: 'hand',
			},

			leftPalm: {
				x: xVal - 45 - 47 - 25, 
				y: shoulderPos + 90, 
				height: 25, 
				style: 'transform:rotate(45deg)', 
				class: 'left-hand', 
				id: 'left-palm',
				partOf: 'hand'
			},

			rightPalm: {
				x: xVal + 45 + 47 + 25, 
				y: shoulderPos + 90, 
				height: 25, 
				style: 'transform:rotate(-45deg)', 
				class: 'right-hand', 
				id: 'right-palm',
				partOf: 'hand'
			},

			leftHip: {
				x: xVal, 
				y: torsoHt, 
				height: 25, 
				style: 'transform:rotate(60deg)', 
				class: 'left-leg', 
				id: 'left-hip',
				partOf: 'leg'
			},

			rightHip: {
				x: xVal, 
				y: torsoHt, 
				height: 25, 
				style: 'transform:rotate(-60deg)', 
				class: 'right-leg', 
				id: 'right-hip',
				partOf: 'leg'
			},

			leftKnee: {
				x: xVal - 20, 
				y: torsoHt + 10, 
				height: 125, 
				style: 'transform:rotate(15deg)', 
				class: 'left-leg', 
				id: 'left-knee',
				partOf: 'leg'
			},

			rightKnee: {
				x: xVal + 20, 
				y: torsoHt + 10, 
				height: 125, 
				style: 'transform:rotate(-15deg)', 
				class: 'right-leg', 
				id: 'right-knee',
				partOf: 'leg'
			},

			leftKnee2: {
				x: xVal - 52, 
				y: torsoHt + 25 + 105, 
				height: 75, 
				style: 'transform:rotate(0deg)', 
				class: 'left-leg', 
				id: 'left-knee2',
				partOf: 'leg'
			},

			rightKnee2: {
				x: xVal + 52, 
				y: torsoHt + 25 + 105, 
				height: 75, 
				style: 'transform:rotate(0deg)', 
				class: 'right-leg', 
				id: 'right-knee2',
				partOf: 'leg'
			},

			leftFoot: {
				x: xVal - 52, 
				y: torsoHt + 25 + 105 + 70, 
				height: 25, 
				style: 'transform:rotate(45deg)', 
				class: 'left-leg', 
				id: 'left-foot',
				partOf: 'leg'
			},

			rightFoot: {
				x: xVal + 52, 
				y: torsoHt + 25 + 105 + 70, 
				height: 25, 
				style: 'transform:rotate(-45deg)', 
				class: 'right-leg', 
				id: 'right-foot',
				partOf: 'leg'
			}
		}

		/*return {'skeleton': skeletonStructure, 'pivots': pivots};*/
	};

	function Directions () {
		var directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-Wast'];
		return directions;
	}