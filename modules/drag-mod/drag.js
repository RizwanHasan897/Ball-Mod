var navBar = document.getElementsByClassName('nav-bar')[0];
var navBarSize = navBar.getBoundingClientRect();

var container = document.getElementsByClassName('container')[0];
var containerSize = container.getBoundingClientRect();

var numInput = document.getElementById('num-ball');

var loadingPage = document.getElementsByClassName('loadingPage')[0];

var ballCount;
var ballArray = [];


(() => {
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
            
            shape.onmousedown = onMouseDown;
            container.appendChild(shape);
            ballArray.push(shape);
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
            ballCount = numInput.value;
            creatBalls();
        } else {
            container.innerHTML = '';
        }
    });
    
    function onMouseDown(event){
            event.preventDefault();
            if (event.buttons === 1){
                this.coordinates = {
                    x: event.clientX,
                    y: event.clientY,
                    oldX: event.clientX,
                    oldY: event.clientY
                };
                document.onmouseup = onMouseUp.bind(this);
                document.onmousemove = onMouseMove.bind(this);
                this.classList.add('selected');
            }; 
    };

    function onMouseUp(){
        document.onmouseup = null;
        document.onmousemove = null;
        this.classList.remove('selected');
    };
    
    function onMouseMove(event) {
        event.preventDefault();
        this.coordinates = {
            x: this.coordinates.oldX - event.clientX,
            y: this.coordinates.oldY - event.clientY,
            oldX: event.clientX,
            oldY: event.clientY
        };

        if (parseInt(this.style.top) - this.coordinates.y < navBarSize.y) {
            this.style.top = `${navBarSize}px`;
        } else
        if (parseInt(this.style.top) - this.coordinates.y + this.offsetHeight > containerSize.height) {
            this.style.top = `${containerSize.height - this.offsetHeight}px`; 
        } else {
            this.style.top = `${parseInt(this.style.top) - this.coordinates.y}px`;
        };

        if (parseInt(this.style.left) - this.coordinates.x < containerSize.x) {
            `${this.style.left = containerSize.x}px`;
        } else if (parseInt(this.style.left) - this.coordinates.x + this.offsetWidth > containerSize.width) {
            this.style.left = `${this.style.left = containerSize.width - this.offsetWidth}px`;
        } else {
            this.style.left = `${parseInt(this.style.left) - this.coordinates.x}px`
        };

        

        getBallPosition();
    };

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
    
        if(ball1.classList.contains('selected')){
            ball1.classList.remove('selected')
            ball2.classList.add('selected')
            ball1.style.left = ball1.offsetLeft + moveX + 'px';
            ball1.style.top = ball1.offsetTop + moveY + 'px';
        } else {
            ball2.classList.remove('selected')
            ball1.classList.add('selected')
            ball2.style.left = ball2.offsetLeft - moveX + 'px';
            ball2.style.top = ball2.offsetTop - moveY + 'px';
        }
    
    }

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
        }
    }

    resetbtn.addEventListener('click', () => {
        ballCount = 0;
    });
})()