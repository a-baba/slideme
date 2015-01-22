/**
  SlideMe v0.07 - https://github.com/InnovationEnterprise/slideme
**/

function slideMe(jsonUrl, reqJson) {





///////////////////////////////////
///////////////////////////////////
  // set presentation slides
///////////////////////////////////
///////////////////////////////////

  function slideMePresentation() {

    var videoSlides = data.videoslides;
    var videoSlidesLength = videoSlides.length;

  // create dom for slides

    var createPresentationContainer = document.createElement('div');
    createPresentationContainer.setAttribute('id', 'slideme-container');
    slideMeContainer.appendChild(createPresentationContainer);

    if (!haveSource) {
      createPresentationContainer.style.float = 'none';
      createPresentationContainer.style.margin = 'auto';
      createPresentationContainer.style.width = '480px';
    }

    
    createImgContainer = document.createElement('div');
    createImgContainer.setAttribute('id', 'slideme-list');
   

    createImgContainerWrapper = document.createElement('div');
    createImgContainerWrapper.setAttribute('id', 'slideme-list-wrapper');

    if (data.videoslidestype === 'images') {

      var createButtons = '<div id="slideme-btn-prev"><i class="icon-prevslide"><</i></div><div id="slideme-btn-next"><i class="icon-nextslide">></i></div>';
      createImgContainerWrapper.innerHTML = createButtons;

    } else {

      createImgContainerWrapper.setAttribute('class', 'slideme-text');

      var createHtmlPresentationNav =  document.createElement('div');
      createHtmlPresentationNav.setAttribute('id', 'slideme-html-nav');
      createHtmlPresentationNav.innerHTML = '<div id="slideme-html-nav-left"><</div><div id="slideme-html-nav-right">></div>';
      createImgContainerWrapper.appendChild(createHtmlPresentationNav);

      slideMeContainer.style.height = '360px';

    }

    slideMeContainer.appendChild(createImgContainerWrapper);
    createImgContainerWrapper.appendChild(createImgContainer);

  // create slider next/prev buttons

  if (data.videoslidestype === 'images') {

    var animated = false;
    var imgContainerWidth = 0;

    document.getElementById('slideme-btn-next').addEventListener('click', function() {

      var imgContainerPosition = createImgContainer.offsetLeft;

      if (animated === false && imgContainerPosition > - imgContainerWidth + 500) {

        animated = true;        
        createImgContainer.style.left = imgContainerPosition - 200 + 'px';

        setTimeout(function(){
          animated = false;
        }, 325);

      }

    }, false);

    document.getElementById('slideme-btn-prev').addEventListener('click', function() {

      var imgContainerPosition = createImgContainer.offsetLeft;

      if (animated === false && imgContainerPosition < 50) {

        animated = true; 
        var slideThatMuch;

        if (imgContainerPosition < -50) {
          slideThatMuch = 200;
        } else {
          slideThatMuch = 100;
        }
        createImgContainer.style.left = imgContainerPosition + slideThatMuch + 'px';
        setTimeout(function(){
          animated = false;
        }, 325);

      }

    }, false);   

  }

  // set nodes for slides

    function setContent(isImg) {

      for (var i = 0; i < videoSlidesLength; i++) {

        var thisContent = videoSlides[i].slidecontent;
        var thisContentTime = 60 * videoSlides[i].timemin + parseInt(videoSlides[i].timesec);
        var createSlideNode;

        if (isImg) {

          createSlideNode = document.createElement('img');
          addAttributes(createSlideNode, {'src' : thisContent, 'data-slideme-time' : thisContentTime});
          imgContainerWidth = 100 * videoSlidesLength;
          createImgContainer.style.width = imgContainerWidth + 'px';


        } else {

          createSlideNode = document.createElement('div');
          createSlideNode.innerHTML = '<div class="slideme-list-content">' + thisContent + '</div>';
          createSlideNode.setAttribute('data-slideme-time', thisContentTime);

        }
        
        timeList.push(thisContentTime);

        createImgContainer.appendChild(createSlideNode);

      }

    // set first slide


      if (isImg) {

        var getFirstImg = videoSlides[0].slidecontent;
        firstImage = document.createElement('img');
        firstImage.setAttribute('src', getFirstImg);
        createPresentationContainer.appendChild(firstImage);

        preloaderWrapper.remove();
        slideMeContainer.style.overflow = 'visible';

      }

      console.log('slider content set');

      if (data.videoslidestype === 'html') {

        var setSlideMeNav = true;

        document.getElementById('slideme-html-nav-left').addEventListener('click', function (){

          var top = createImgContainer.offsetTop;

          if (top < 0 && setSlideMeNav === true) {

            createImgContainer.style.top = createImgContainer.offsetTop + 360 + 'px';

            setSlideMeNav = false;

            setTimeout(function(){
              setSlideMeNav = true;
            }, 350);

          } 

        });

        document.getElementById('slideme-html-nav-right').addEventListener('click', function (){

          var top = createImgContainer.offsetTop;
          var height = createImgContainer.offsetHeight;

          if (top > -height + 360 && setSlideMeNav === true) {

            createImgContainer.style.top = createImgContainer.offsetTop - 360 + 'px';

            setSlideMeNav = false;

            setTimeout(function(){
              setSlideMeNav = true;
            }, 350);

          }

        });

      }

    // add click to slides

      addClicks = document.querySelectorAll('[data-slideme-time]');
      addClicks[0].setAttribute('class', 'slideme-img-active');

      function addClicksFn() {

        if (haveSource) {

          var thisTime = this.getAttribute('data-slideme-time');
          thisPlayer.currentTime(thisTime);
          thisPlayer.play();

        } else {

          firstImage.setAttribute('src', this.getAttribute('src'));

        }

        if (data.videoslidestype === 'images' && this !== addClicks[0]) {

          createImgContainer.style.left = 150 - this.offsetLeft + 'px';

        }

        document.getElementsByClassName('slideme-img-active')[0].classList.remove('slideme-img-active');
        this.setAttribute('class', 'slideme-img-active');

      }

      for (var g = 0; i <  addClicks.length; g++) {

          addClicks[g].addEventListener('click', addClicksFn, false);

      }
      
    }

  // check if img or other 

    if (data.videoslidestype === 'images') {

      var ajaxImgCount = 0;

      for (var i = 0; i < videoSlidesLength; i++) {

        (function () {

          var thisImg = videoSlides[i].slidecontent;

          var reqImg = new Image();
          
          reqImg.src = thisImg;

          reqImg.onload = function() {

            ajaxImgCount = ajaxImgCount + 1;

            if (ajaxImgCount === videoSlidesLength) {

              setContent(true);

            }

          };

          reqImg.onerror = function() {

            errorThat('cannot load image', slideMeContainer);

          };


          
        }) ();

      }

    } else {

      setContent(false);

    }

  }


  // click events on slides

    var currentArrayNr = '00';

    function setNewSlide() {

      var getCurrentTime = Math.round(thisPlayer.currentTime());
      
      var arrayNr;

      for (var i = 0; i < timeList.length; i++) {   

        if (getCurrentTime >= timeList[i]) {
          arrayNr = timeList[i];
        }

      }

      if (currentArrayNr !== arrayNr) {

        currentArrayNr = arrayNr;

        var getSlideFromDom = document.querySelectorAll('[data-slideme-time="' + arrayNr + '"]')[0];

        if (data.videoslidestype === 'images') {
          
          if (getSlideFromDom !== addClicks[0]) {

            createImgContainer.style.left =  150 - getSlideFromDom.offsetLeft + 'px';

          } else { 

            createImgContainer.style.left =  50 - getSlideFromDom.offsetLeft + 'px' ;

          }

          firstImage.setAttribute('src', getSlideFromDom.getAttribute('src'));

        } else {

          createImgContainer.style.top = - getSlideFromDom.offsetTop + 'px';

        }

        document.getElementsByClassName('slideme-img-active')[0].classList.remove('slideme-img-active');
        getSlideFromDom.setAttribute('class', 'slideme-img-active');

      }

    }

///////////////////////////////////
///////////////////////////////////
  // create player nodes
///////////////////////////////////
///////////////////////////////////


///////////////////////////////////
///////////////////////////////////
  // fire up videojs
///////////////////////////////////
///////////////////////////////////




  function loadVideoJs() {

    if (typeof vjs === 'undefined') {

      slideMe.loadAssets('//vjs.zencdn.net/4.11.2/video.js', 'script', fireVideJs);

    } else {

      fireVideJs();

    }

  }



///////////////////////////////////
///////////////////////////////////
  // mini api
///////////////////////////////////
///////////////////////////////////



  ///////////////////////////////////
  ///////////////////////////////////
    // load base css
  ///////////////////////////////////
  ///////////////////////////////////

  slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/slidemecss.min.css', 'css');
  slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/video-js.min.css', 'css');

  ///////////////////////////////////
  ///////////////////////////////////
    // request json file
  ///////////////////////////////////
  ///////////////////////////////////

    if (reqJson !== false) {

      loadJson(jsonUrl);

    } else {

      data = jsonUrl;

      if (data === undefined) {

        errorThat('no config', slideMeContainer);
        return false;

      }
      
      if (data) {

        createPlayer();
        if (isVideoSlide !== undefined) {
          slideMePresentation();
        }
        if (haveSource) {
          loadVideoJs();
        }

        playList();

      } else {

        errorThat('no config', slideMeContainer);

      }
    
    }
  
}

document.addEventListener('DOMContentLoaded', function() {

  var checkIfSlideMe = document.querySelectorAll('[data-slidemejs]')[0];

  if (checkIfSlideMe !== undefined && checkIfSlideMe.getAttribute('data-slidemejs') !== '') {

    slideMe(checkIfSlideMe.getAttribute('data-slidemejs'));

  }

});
