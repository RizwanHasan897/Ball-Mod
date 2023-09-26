var navBar = document.getElementsByClassName('nav-bar')[0];
var navBarSize = navBar.getBoundingClientRect();

var container = document.getElementsByClassName('container')[0];
var containerSize = container.getBoundingClientRect();

var sun = document.getElementsByClassName('sun')[0];

var url = 'https://api.sunrise-sunset.org/json';

var numInput = document.getElementById('num-ball');
var playBtn = document.getElementsByClassName('play')[0];

var loadingPage = document.getElementsByClassName('loadingPage')[0];

var ballCount;
var ballArray = [];
(()=> {
    
    // loadingPage.style.display = 'none'loadingPageloadingPage
    function resizeContainer(){
        containerSize = container.getBoundingClientRect();
    }
    
    window.addEventListener('resize', resizeContainer);
    
    
    function creatBalls() {
        ballArray =[];
        for (var i = 0; i < ballCount; i++) {
            var shape = document.createElement('div');
            shape.className = "shape";
            shape.style.cssText = `
            left: ${Math.floor(Math.random() * (containerSize.width - (27 + containerSize.x)) + containerSize.x)}px;
            top: ${Math.floor(Math.random() * ((containerSize.height - shape.offsetHeight) - (27 + containerSize.y)) + containerSize.y)}px;
            background: radial-gradient(circle at 17px 17px,rgb(${changeColor()}, ${changeColor()}, ${changeColor()}) , #333);
            `;
            if (parseInt(shape.style.top) + shape.offsetHeight > containerSize.height) {
               shape.style.top = containerSize.height - shape.offsetHeight + 'px';
            }
            if (parseInt(shape.style.left) + shape.offsetWidth > containerSize.width) {
               shape.style.left = containerSize.width - shape.offsetWidth + 'px';
            }
            
            container.appendChild(shape);
            container.appendChild(sun);
            moveSun();
            moveIt(shape);
            ballArray.push(shape);
            addShadow(shape);
        }; 
    };


    function changeColor() {
        return Math.floor(Math.random() * 255);
    };

    numInput.addEventListener('input', () => {
        if(numInput.value > 15) {
            numInput.value = 15;
            numInput.innerHTML = '15'
        }

        if(numInput.value > 0){
            container.innerHTML = '';
            playBtn.innerHTML = 'Play ▶';
            ballCount = numInput.value;
            creatBalls();
        } else {
            container.innerHTML = '';
            removeBalls();
        }
    });
    
    function addShadow(element) {
        var sunPos = sun.getBoundingClientRect();
        var ballPos = element.getBoundingClientRect();
      
        var sunDistanceX = sunPos.left + sunPos.width / 2 - (ballPos.left + ballPos.width / 2);
        var sunDistanceY = sunPos.top + sunPos.height / 2 - (ballPos.top + ballPos.height / 2);
      
        var shadowDistanceX = sunDistanceX * -0.05;
        var shadowDistanceY = sunDistanceY * -0.05;
      
        var shadowBlur = Math.sqrt(Math.pow(shadowDistanceX, 2) + Math.pow(shadowDistanceY, 2));
      
        var shadowColor = "rgba(0, 0, 0, 0.8)";
    
    
        sun.style.display = 'block'
        element.style.boxShadow = `${shadowDistanceX}px ${shadowDistanceY}px ${shadowBlur}px ${shadowColor}`;
    
    }
    
    function moveSun() {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            var sunrise = parseInt(data.results.sunrise.slice(0,1));
            var sunset;
            if(data.results.sunset.slice(-2) === 'PM'){
                sunset = parseInt(data.results.sunset.slice(0,1)) + 12
            };
    
            var time = new Date();
            var hour = 14
            // time.getHours();
    
            if(hour < sunrise || hour > sunset){
                sun.style.backgroundColor = 'white';
                container.style.backgroundColor = 'black';
                navBar.style.backgroundColor = 'grey'
            };
    
    
            var dayTime = sunset - sunrise;
            var stages = (containerSize.width / dayTime);
            var stage = 0;
            var top = 80;
            
            for(var i = sunrise; i <= sunset; i++){
                stage++ 
                if(hour == i){
                    
                    sun.style.left = `${(stages * stage) - (100 * 2)}px`;
                    if(hour < 12 ){
                        sun.style.top = `${top - (stage * 10)}%`
                    } 
                    else if (hour > 12) {
                        top = 10;
                        sun.style.top = `${(hour % 12) * 10}%`
    
                    } else {
                        sun.style.top = '10%'
                    }
                }
            }
        });
    }; 
    
    function moveIt(ball){  
        var directionX = 1;
        var directionY = 1;
        var play = false; 
        playBtn.addEventListener('click', () => {
            if(play){
                play = !play;
                playBtn.innerHTML = 'Play ▶'
            } else {
                play = true
                playBtn.innerHTML = 'Pause <div class="small">▐▐</div>'
            }
        })
    
    
        setInterval(function() {
            if(play) {
                
                var currentX = parseInt(ball.style.left);
                var currentY = parseInt(ball.style.top);
                var width = ball.offsetWidth;
    
    
                function ballCheck(){
                    var posX = parseInt(ball.style.left);
                    var posY = parseInt(ball.style.top);
                    for (var i = 0; i < ballArray.length; i++) {
                        if (ballArray[i] !== ball) {
                            var otherBall = ballArray[i];
                            var otherPosX = parseInt(otherBall.style.left);
                            var otherPosY = parseInt(otherBall.style.top);
                            var otherWidth = otherBall.offsetWidth;
                            
                            var disX = posX - otherPosX;
                            var disY = posY - otherPosY;
                            var distance = Math.sqrt(disX * disX + disY * disY);
                            var minDistance = width / 2 + otherWidth / 2;
                            
                            if (distance < minDistance) {
                                var moveX = disX * (minDistance - distance) / distance;
                                var moveY = disY * (minDistance - distance) / distance;
                                directionX *= -1;
                                directionY *= -1;
                                posX += moveX;
                                posY += moveY;
                                ball.style.left = posX + 'px';
                                ball.style.top = posY + 'px';
                                return true
                            }
                        }
                    }
                }
                
                
                if (currentX + ball.offsetWidth >= containerSize.width || currentX <= containerSize.x|| ballCheck(ball)) {
                    directionX *= -1; 
                }
    
                ball.style.left = `${currentX + (2 * directionX)}px`;
                getBallPosition();
                
                if (currentY + ball.offsetHeight >= containerSize.height || currentY <= navBarSize.y || ballCheck(ball)) {
                    directionY *= -1; 
                }
                ball.style.top = `${currentY + (2 * directionY)}px`;  
                getBallPosition();   
            }
        }, 10);          
    };

    function checkCollisionWithContainer(ball) {
        if (parseInt(ball.style.top) < navBarSize.y) {
            ball.style.top = navBarSize.y + 'px';
        }else if (parseInt(ball.style.top) + ball.offsetHeight > containerSize.height + 5) {
            ball.style.top = `${containerSize.height - ball.offsetHeight}px`;
        }
    
        if (parseInt(ball.style.left) < containerSize.x) {
            ball.style.left = `${containerSize.x}px`;
        } else if (parseInt(ball.style.left) + ball.offsetWidth > containerSize.width) {
            ball.style.left = `${containerSize.width - ball.offsetWidth}px`;
        }
    }
    
    
    function getBallPosition() { 
        for(var i = 1; i < ballArray.length; i++) {
            for(var j = 0; j < i; j++){
                if((Math.abs(ballArray[i].offsetLeft - ballArray[j].offsetLeft) < 50)
                && (Math.abs(ballArray[i].offsetTop - ballArray[j].offsetTop) <  50)) {
                    checkOverlap(ballArray[i], ballArray[j]);
                };
            };
        };
        for(var i = 0; i < ballArray.length; i++) {
            checkCollisionWithContainer(ballArray[i]);
            addShadow(ballArray[i])
        }
    }

    function checkOverlap(ball1, ball2){
        var disX = ball1.offsetLeft - ball2.offsetLeft;
        var disY = ball1.offsetTop - ball2.offsetTop;
        var distance = Math.sqrt(disX * disX + disY * disY);
        var minDistance = ball1.offsetWidth / 2 + ball2.offsetWidth / 2;
        var moveX = 0;
        var moveY = 0;
    
        if (distance < minDistance) {
            moveX = disX * (minDistance - distance) / distance;
            moveY = disY * (minDistance - distance) / distance;
        }
        
        if(ball1.classList.contains('selected')){
            ball1.cssText = ''
            ball2.cssText = 'ball selected'
            
        } else {
            ball2.cssText = ''
            ball1.cssText = 'ball selected'
        }
        
    
        if(ball1.classList.contains('selected')){
            ball1.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            ball2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }
    
        ball1.style.transition = 'transform 0.2s';
        ball2.style.transition = 'transform 0.2s';
    
        setTimeout(function() {
            ball1.style.transform = '';
            ball2.style.transform = '';
            ball1.style.transition = '';
            ball2.style.transition = '';
        }, 200);
    }    
})()