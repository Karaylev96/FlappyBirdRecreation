var flappyBird = (function () {

	//constants {

	var getMaxVerticalVelocity = function () {

		return 7;
	};

	var getPipeWidth = function () {

		return 70;
	};

	var getPipeHeight = function () {

		return 120;
	};

	var getGroundWidth = function () {

		return 100;
	};

	var getGroundHeight = function () {

		return 100;
	};

	var getBackgroundWidth = function () {

		return 300;
	};

	var getBackgroundHeight = function () {

		return 300;
	};

	var getGroundSpacer = function () {

		return 15;
	};

	var getReplayWidth = function() {

		return 50;
	};

	var getReplayHeight = function() {

		return 50;
	};
	//} end of constatns

	var canvas = document.getElementById('flappy-bird-canvas'),
		finalCtx = canvas.getContext('2d'),
		tempCanvas = document.createElement('canvas'),
		ctx = tempCanvas.getContext('2d'),
		maxWidth = canvas.width,
		maxHeight = canvas.height;

	var gameSpeed = 2,
		gameOver = false,
		gameStarted = false;

	var pipes = [],
		grounds = [],
		backgrounds = [],
		tempNextPipeDist = 300,
		firstInitOfGrounds = true,
		score = 0,
		scoreUpdated = false,
		gameStarting = true;

	ctx.imageSmoothingEnabled = false;

	tempCanvas.width = maxWidth;
	tempCanvas.height = maxHeight;

	function getRandomHeight() {

		var randomHeight = Math.floor(Math.random() * (maxHeight + 1));

		if(randomHeight < 100 || randomHeight > maxHeight - 100) {
			return getRandomHeight();
		}
		else {
			return randomHeight;
		}
	}

	function getRandomDist () {

		var randomDist = Math.floor(Math.random() * (600 - 200 + 1)) + 200;

		return randomDist;
	}

	function handlePipes() {

		pipes.forEach(function (pipe) {

			if(pipe.x <= -1 * getPipeWidth()) {

				pipes.splice(pipes.indexOf(pipe), 1);
			}

		});

		if(pipes.length < 4 && (pipes.length == 0 || pipes[pipes.length-1].x < maxWidth - tempNextPipeDist) ) {

			pipes.push(new flappyBirdEngine.Pipe(maxWidth, getRandomHeight(), getPipeWidth(), getPipeHeight() ) );
		}

		pipes.forEach(function (pipe) {

			pipe.move(gameSpeed);
			pipe.draw(ctx, maxHeight);
		});

		tempNextPipeDist = getRandomDist();
	}

	function handleGrounds() {

		if(firstInitOfGrounds) {

			var i = 1;
			while(grounds.length == 0 || grounds[grounds.length -1].x > 0) {

				grounds.push(new flappyBirdEngine.Ground(maxWidth - getGroundWidth()*i, maxHeight - getGroundHeight(), 
							getGroundWidth(), getGroundHeight() ) );

				i+= 1;
			}

			firstInitOfGrounds = false;
		}

		//--------------------------------------------GROUNDS--------------------------------------------

		grounds.forEach(function (ground) {

			if(ground.x <= -1 * getGroundWidth()) {

				grounds.splice(grounds.indexOf(ground), 1);
			}
		});

		if(grounds.length == 0 || grounds[grounds.length-1].x < maxWidth - getGroundWidth() ) {

			grounds.push(new flappyBirdEngine.Ground(maxWidth - getGroundSpacer(), maxHeight - getGroundHeight(), 
				getGroundWidth(), getGroundHeight() ) );
		}

		grounds.forEach(function (ground) {

			ground.move(gameSpeed);
			ground.draw(ctx);
		});
	}

	function handleBackgrounds() {

		if(firstInitOfGrounds) {

			var i = 1;
			while(backgrounds.length == 0 || backgrounds[backgrounds.length -1].x > 0) {

				backgrounds.push(new flappyBirdEngine.Background(maxWidth - getGroundSpacer() - getBackgroundWidth()*i, maxHeight - getGroundHeight() - getBackgroundHeight(), 
				getBackgroundWidth(), getBackgroundHeight() ) );

				i+= 1;
			}

			setTimeout(function () {

				gameStarting = false;
			}, 500);
		}

		//--------------------------------------------BACKGROUNDS--------------------------------------------

		backgrounds.forEach(function (background) {

			if(background.x <= -1 * getBackgroundWidth() ) {

				backgrounds.splice(backgrounds.indexOf(background), 1);
			}
		});

		if(backgrounds.length == 0 || backgrounds[backgrounds.length-1].x < maxWidth - getBackgroundWidth() ) {

			backgrounds.push(new flappyBirdEngine.Background(maxWidth - getGroundSpacer(), maxHeight - getGroundHeight() - getBackgroundHeight(), 
				getBackgroundWidth(), getBackgroundHeight() ) );
		}

		backgrounds.forEach(function (background) {

			background.move(gameSpeed);
			background.draw(ctx);
		});
		
	}

	function handleCrashes(bird) {

		var inPipeSection = false;

		if(bird.altitude >= maxHeight - bird.height - getGroundHeight() ) {

			gameSpeed -= (1/gameSpeed)/30;
			gameOver = true;
		}

		if(gameSpeed <= 0.3) {

			gameSpeed = 0;
		}

		pipes.forEach(function (pipe) {

			//IN PIPE SECTION
			if( maxWidth/3 + bird.width >= pipe.x  && maxWidth/3 <= pipe.x + pipe.width  && !gameOver) {

				inPipeSection = true;

				//hit pipe
				if(bird.altitude + bird.height > pipe.y || bird.altitude < pipe.y - pipe.height) {

					gameSpeed = 0;
					
					setTimeout(function () {

						gameOver = true;
					}, 5000);
				}
				else if(!scoreUpdated) {

					score += 1;
					scoreUpdated = true;
					
				}
			}
		});

		if(!inPipeSection && scoreUpdated) {

			scoreUpdated = false;
		}

	}

	function displayScore () {

		ctx.font = "48px serif";
		ctx.fillText(score, maxWidth/2, maxHeight/2);
	}

	function drawReplay() {

		var repeatImg = repeatImg || new Image();

		repeatImg.src = "images/repeat.png";

		ctx.drawImage(repeatImg, maxWidth/2, maxHeight/2, getReplayWidth(), getReplayHeight() );

		ctx.rect( maxWidth/2, maxHeight/2, getReplayWidth(), getReplayHeight());
		ctx.stroke();

		finalCtx.drawImage(tempCanvas, 0, 0);
	}

	function restartGame() {

		pipes = [];
		backgrounds = [];
		grounds = [];
		score = 0;
		gameStarting = true;
		gameStarted = true;
		gameOver = false;
		firstInitOfGrounds = true;
		gameSpeed = 2;

		flappyBird = new flappyBirdEngine.Bird(maxHeight/3, 30, 30, 0, getMaxVerticalVelocity() );
	}


	var flappyBird = new flappyBirdEngine.Bird(maxHeight/3, 30, 30, 0, getMaxVerticalVelocity() );

	function flappyBirdFrame () {

		var birdJumped = false;

		finalCtx.clearRect(0, 0, maxWidth, maxHeight);
		ctx.clearRect(0, 0, maxWidth, maxHeight);


		handleBackgrounds();
		handlePipes();
		handleGrounds();

		document.addEventListener('keypress', function (e) {

			if(e.keyCode == 32 && !gameOver && gameSpeed !== 0) {

				flappyBird.jump();
				birdJumped = true;
			}
		});

		if(!birdJumped && !gameStarting) {

			flappyBird.fall();
		}

		flappyBird.move(maxHeight, getGroundHeight() );

		handleCrashes(flappyBird);

		flappyBird.draw(ctx, maxWidth);


		displayScore();
		finalCtx.drawImage(tempCanvas, 0, 0);


		if(!gameOver || gameSpeed !== 0) {
			requestAnimationFrame(flappyBirdFrame);
		}
		else {

			drawReplay();
		}
	}

	drawReplay();

	setTimeout(function () {

		drawReplay();
	}, 100);

	canvas.addEventListener('click', function (e) {

		if(!gameStarted || gameOver) {
			x = e.pageX - canvas.getBoundingClientRect().left;
		    y = e.pageY - canvas.getBoundingClientRect().top;

			if(x >= maxWidth/2 && x <= maxWidth/2 + getReplayWidth() &&
				y >= maxHeight/2 && y <= maxHeight/2 + getReplayHeight() ) {

				restartGame();
				requestAnimationFrame(flappyBirdFrame);
			}

			gameStarted = true;
		}
	});


}());