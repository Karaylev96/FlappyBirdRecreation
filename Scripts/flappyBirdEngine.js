var flappyBirdEngine = (function () {

	function Bird (altitude, width, height, velocity, maxVerticalVelocity) {

		this.width = width;
		this.height = height;
		this.altitude = altitude;
		this.velocity = velocity;
		this._maxVerticalVelocity = maxVerticalVelocity;
	}

	Bird.prototype.jump = function () {

		this.velocity = this._maxVerticalVelocity;
	};

	Bird.prototype.fall = function () {

		this.velocity -= 0.4;

		if(this.velocity <= -1 * this._maxVerticalVelocity) {

			this.velocity = -1 * this._maxVerticalVelocity;
		}
	};

	Bird.prototype.move = function (maxHeight, groundHeight) {

		this.altitude -= this.velocity;

		if(this.altitude < 0) {

			this.altitude = 0;
		}
		else if (this.altitude > maxHeight - this.height - groundHeight) {

			this.altitude = maxHeight - this.height - groundHeight;
		}
	}

	Bird.prototype.draw = flappyBirdRenderer.drawBird;

	function Pipe(x, y, width, height) {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	Pipe.prototype.move = function (gameSpeed) {

		this.x -= gameSpeed;
	}

	Pipe.prototype.draw = flappyBirdRenderer.drawPipe;

	function Ground (x, y, width, height) {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height
	}

	Ground.prototype.move = function (gameSpeed) {

		this.x -= gameSpeed;
	};

	Ground.prototype.draw = flappyBirdRenderer.drawGround;

	function Background (x, y, width, height) {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height
	}

	Background.prototype.move = function (gameSpeed) {

		this.x -= gameSpeed/4;
	};

	Background.prototype.draw = flappyBirdRenderer.drawBackground;

	return {

		Bird: Bird,
		Pipe: Pipe,
		Ground: Ground,
		Background: Background
	}

}());