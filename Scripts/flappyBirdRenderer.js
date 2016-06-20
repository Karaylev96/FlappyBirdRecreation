var flappyBirdRenderer = (function () {

	var animationObject = {

		bird: 'bird',
		background: 'background',
		ground: 'ground',
		pipe: 'pipe'
	};

	function getAnimation (animationName) {

		var gameAnimations = [
			{
				src: {
					stageOne: "images/bird-stage-one.png",
					stageTwo: "images/bird-stage-two.png",
					stageThree: "images/bird-stage-three.png"
				}, 
				id:"bird"
			},
	        {src:"images/background.png", id:"background"},
	        {src:"images/ground.png", id:"ground"},
	        {
	        	src: {
        			upwards: "images/pipe.png", 
        			downwards: "images/pipe-downwards.png",
        		},
	        	id: "pipe"
	        },
		],
		returnData;

		gameAnimations.forEach(function (animation) {

			if(animation.id == animationName) {

				returnData = animation.src;
			}
	 	});

		return returnData;
	}

	this.drawGround = function (ctx, maxHeight) {

		var groundImg = groundImg || new Image(),
			groundSrcObj = getAnimation(animationObject.ground);

		groundImg.src = groundSrcObj;

		ctx.drawImage(groundImg, this.x, this.y, this.width, this.height);
	};

	this.drawBackground = function (ctx) {

		var backgroundImg = backgroundImg || new Image(),
			backgroundSrcObj = getAnimation(animationObject.background);

		backgroundImg.src = backgroundSrcObj;

		ctx.drawImage(backgroundImg, this.x, this.y, this.width, this.height);
	};

	this.drawBird = function (ctx, maxWidth) {

		var birdImg = birdImg || new Image(),
			imagesSrcObj =  getAnimation(animationObject.bird);

		if( Math.sqrt(Math.pow(this.velocity / this._maxVerticalVelocity, 2)) <= 0.3 ) {

			birdImg.src = imagesSrcObj.stageTwo;
		}
		else if (this.velocity > 0 ) {

			birdImg.src = imagesSrcObj.stageOne;
		}
		else {

			birdImg.src = imagesSrcObj.stageThree;
		}


		ctx.drawImage(birdImg, maxWidth/3, this.altitude, this.width, this.height);
	};

	this.drawPipe = function (ctx, maxHeight) {

		var pipeImg = pipeImg || new Image(),
			pipeDownImg = pipeDownImg || new Image(),
			pipeSrcObj = getAnimation(animationObject.pipe);

		pipeImg.src = pipeSrcObj.upwards;
		pipeDownImg.src = pipeSrcObj.downwards;

		ctx.drawImage(pipeImg, this.x, this.y, this.width, maxHeight - this.y);
		ctx.drawImage(pipeDownImg, this.x, 0, this.width, this.y - this.height);
	};

	return {

		drawBird: this.drawBird,
		drawPipe: this.drawPipe,
		drawGround: this.drawGround,
		drawBackground: this.drawBackground
	}

}());