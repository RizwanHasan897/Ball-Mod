var navBar = document.getElementsByClassName('nav-bar')[0];
var navBarSize = navBar.getBoundingClientRect();

var container = document.getElementsByClassName('container')[0];
var containerSize = container.getBoundingClientRect();

var loadingPage = document.getElementsByClassName('loadingPage')[0];
var addShadowBtn = document.getElementsByClassName('shadow')[0]

var mannualBtn = document.getElementsByClassName('move-balls')[0];

var resetbtn = document.getElementsByClassName('reset')[0];
var playBtn = document.getElementsByClassName('play')[0];

var collisionBox = document.createElement('div');
var dataUse = document.getElementsByClassName('data-use')[0];

var script;

container.appendChild(collisionBox);


(()=>{

    function loadingShadowFunction(){
        script = document.createElement('script');
        script.src = 'modules/shadow-mod/shadow.js';
        script.async = true;
        document.body.appendChild(script);
        displayMemoryUsage();
    };

    function loaddingDragFunction(){
        script = document.createElement('script');
        script.src = 'modules/drag-mod/drag.js';
        script.async = true;
        document.body.appendChild(script);
        displayMemoryUsage();
    };

    function unloadFunction(){
        if(script){
            container.remove(script);
            script.src = null;
            loadingPage.style.display = 'flex';
            displayMemoryUsage();
        }
    };

    function displayMemoryUsage() {
        var memoryInfo = window.performance.memory;
        var memoryInMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
        dataUse.innerHTML = `Memory Usage: ${memoryInMB.toFixed(2)} MB`;
        
    }
    
    
    addShadowBtn.addEventListener('click',()=> {
        loadingPage.style.display = 'none';
        resetbtn.style.display = 'flex';  
        loadingShadowFunction();
    });
    
    
    mannualBtn.addEventListener('click', ()=> {
        loadingPage.style.display = 'none';
        resetbtn.style.display = 'flex';  
        playBtn.style.display = 'none';
        loaddingDragFunction();
    });


    resetbtn.addEventListener('click', () => {
        resetbtn.style.display = 'none';
        playBtn.style.display = 'none';
        numInput.value = 0;
        loadingPage.style.display = 'flex';
        if(script){
            location.reload();
        };
    });
    displayMemoryUsage();   
    setInterval(displayMemoryUsage, 1000);
})()