var slideMe = slideMe || {};
var slideMeContainer = document.querySelectorAll('[data-slidemejs]')[0];
var getHead = document.getElementsByTagName('head')[0];
var isMobile = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i);
var thisVideoPlayer;


// var thisPlayerEl;
// var isVideoSlide;
// var haveSource;
// var timeList = [];
// var addClicks;
// var createImgContainer;
// var firstImage;
// var preloaderWrapper;
// var playListData;
// var createImgContainerWrapper;
slideMe.errorThat = function (thisError, thisContainer) {
  var errorDiv = 'Player error:<br>' + thisError + '';
  thisContainer.setAttribute('class', 'slideme-error');
  thisContainer.innerHTML = errorDiv;
};


slideMe.addAttributes = function (element, attribute) {
  for (var value in attribute) {
    if (attribute.hasOwnProperty(value)) {
     element.setAttribute(value, attribute[value]);
    }
  }
};

// Remy throttle fn

slideMe.throttle = function (fn, threshhold, scope) {
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date(),
        args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};


slideMe.loadAssets = function (url, type, fn) {

  var getBody = document.getElementsByTagName('body')[0];
  var getAssets;

  if (type === 'css') {
    getAssets = document.createElement('link');
    getAssets.href = url;
    getAssets.rel = 'stylesheet';
    getAssets.type = 'text/css';
  } else {
    getAssets = document.createElement('script');
    getAssets.src = url;
    getAssets.async = true;
    getAssets.type = 'text/javascript';
  }

  getBody.appendChild(getAssets);

  if (fn !== undefined) {
    getAssets.onload = function(){
      fn();
    };
  }

};
slideMe.createDOM = function () {

  isVideoSlide = slideMe.data.videoslides !== undefined;
  haveSource = slideMe.data.videosources !== undefined;

  // create video dom

    var createVideoPlayer = document.createElement('div');
    createVideoPlayer.setAttribute('id', 'slideme-wrapper');   

    var videoPlayerLayout;

    if (haveSource) {

      videoPlayerLayout = '<video id="videojs" controls></video>';
      var videoSources;

      if (slideMe.data.videosourcesmobile !== undefined && isMobile !== null) {
        videoSources = slideMe.data.videosourcesmobile;
      } else {
        videoSources = slideMe.data.videosources;
      }
    
      createVideoPlayer.innerHTML = videoPlayerLayout;
      slideMeContainer.appendChild(createVideoPlayer);
      thisVideoPlayer = document.getElementById('videojs');

      for (var value in videoSources) {
        if (videoSources.hasOwnProperty(value)) {
          var createVideoSource = document.createElement("source");
          slideMe.addAttributes(createVideoSource, {
            "src": videoSources[value],
            "type": value
          });
          thisVideoPlayer.appendChild(createVideoSource);
        }
      }
      
      if (slideMe.data.subtitles !== undefined) {

        for (var i = 0; i < slideMe.data.subtitles.length; i++) {

          var createSubtitleNode = document.createElement('track');

          slideMe.addAttributes(createSubtitleNode, {
            'src' : slideMe.data.subtitles[i].src, 
            'srclang' : slideMe.data.subtitles[i].srclang,
            'label' : slideMe.data.subtitles[i].label
          });          

          if(slideMe.data.subtitles[i].default === 'true') {
            createSubtitleNode.setAttribute('default', '');
          }

          thisVideoPlayer.appendChild(createSubtitleNode);
        }

      }

    }


};

slideMe.loadJson = function (jsonUrl) {

  var request = new XMLHttpRequest();
  request.open('GET', jsonUrl, true);

  request.onload = function() {

    if (request.status >= 200 && request.status < 400) {

      slideMe.data = JSON.parse(request.responseText); 
      console.log('json fetched');
      
    } else {

      errorThat('cannot connect', slideMeContainer);

    }

  };

  request.onerror = function() {
    errorThat('cannot connect', slideMeContainer);
  };

  request.send();

};

slideMe.reload = function (jsonUrl) {

    videojs.dispose();

    while(slideMeContainer.firstChild) {
      slideMeContainer.removeChild(slideMeContainer.firstChild);
    }

    addPreloader();
    loadJson(jsonUrl);

  };
var insertSpiner = document.createElement('style');
insertSpiner.innerHTML = '#slideme-preloader{font-family: Helvetica, Arial, sans-serif;position:absolute;top:0;bottom:0;left:0;right:0;padding:15% 0 0;background:#fff;z-index:100;color:#000;text-align:center}#slideme-preloader:after{content:"Loading, please wait...";font-size:12px;font-weight:100;display:block}@keyframes slideMeSpinner{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@-webkit-keyframes slideMeSpinner{from{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}.icon-spinner{-webkit-animation:slideMeSpinner .75s linear infinite;animation:slideMeSpinner 2s linear infinite;font-size:20px;line-height:50px;width:50px;height:50px;cursor:default;text-align:center;color:#000}';
getHead.appendChild(insertSpiner);

slideMe.addPreloader = function () {

  var preloaderDom = '<i class="icon-spinner">.</i>';
  preloaderWrapper = document.createElement('div');
  preloaderWrapper.setAttribute('id', 'slideme-preloader');
  preloaderWrapper.innerHTML = preloaderDom;
  slideMeContainer.appendChild(preloaderWrapper);

};

slideMe.addPreloader();

slideMe.playList = function () {

  var createPlaylist;

  if (document.getElementById('slideme-playlist') !== null) {

    createPlaylist = document.getElementById('slideme-playlist');

  } else {

    createPlaylist = document.createElement('div');
    createPlaylist.setAttribute('id', 'slideme-playlist');

  }

  createPlaylist.innerHTML = '<div id="slideme-playlist-title">Playlist<div id="slideme-playlist-drop">></div></div><div id="slideme-playlist-list"></div>';
  slideMeContainer.appendChild(createPlaylist);

  slideMeContainer.style.margin = '0 auto 50px auto';


  var playListTitle = document.getElementById('slideme-playlist-title');
  var playListList = document.getElementById('slideme-playlist-list');

  if (data.playlist !== undefined) {
    playListData = data.playlist;
  }

  function playlistReloadClick() {

    slideMe.reload(this.getAttribute('data-json'));
    return false;

  }

  for (var i = 0; i < playListData.length; i++) {

    var newElemnt;

    if (playListData[i].type === 'json') {

      newElemnt = document.createElement('p');
      newElemnt.innerHTML = playListData[i].title;
      newElemnt.setAttribute('data-json', playListData[i].link);

      playListList.appendChild(newElemnt);

      newElemnt.addEventListener('click', playlistReloadClick);

    } else {

      newElemnt = document.createElement('a');
      newElemnt.innerHTML = playListData[i].title;
      newElemnt.setAttribute('href', playListData[i].link);

      playListList.appendChild(newElemnt);

    }

  }

  var open = false;
  playListTitle.addEventListener('click', function() {

    if (open === false) {

      open = true;
      playListList.style.display = 'block';
      playListTitle.classList.add('slideme-drop-active');

    } else {

      open = false;
      playListList.style.display = 'none';
      playListTitle.classList.remove('slideme-drop-active');

    }

  });

};


slideMe.destroyPlaylist = function() {

    document.getElementById('slideme-playlist').remove();

  };

slideMe.fireVideJs = function () {

  //player source


  // player settings

  if (data.preload === undefined || '') {

    data.preload = 'metadata';

  }

  if (data.poster === undefined || '') {

    data.poster = '';

  }

  addAttributes(thisVideoPlayer, {

    'class': 'video-js vjs-default-skin',
    'poster': data.poster,
    'preload': data.preload

  });

  thisPlayer = videojs(thisVideoPlayer);

  // get ads if available

  if (data.adTagUrl !== undefined) {

    var options = {

      id: 'videojs',
      adTagUrl: data.adTagUrl

    };

    slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/ads/slidemeads.js', 'css');

    slideMe.loadAssets('//imasdk.googleapis.com/js/sdkloader/ima3.js', 'script');

    slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/ads/slidemeads.js', 'script', function() {

      thisPlayer.ima(options);
      thisPlayer.ima.initializeAdDisplayContainer();
      thisPlayer.ima.requestAds();
      console.log('ad script loaded');

    });

  }

  thisPlayer.ready(function() {

    thisPlayer = this;
    thisPlayerEl = document.getElementsByTagName('video')[0];

    console.log('player created');

    if (data.videoslidestype === 'html') {

      preloaderWrapper.remove();
      slideMeContainer.style.overflow = 'visible';

    }

    if (data.autoplay !== undefined && data.autoplay !== 'false') {
      thisPlayer.play();
    }

    if (data.videoslides !== undefined) {

      document.getElementsByTagName('video')[0].addEventListener('timeupdate', throttle(setNewSlide, 1000));

    }

    if (data.videosources && data.videosourcesmobile !== undefined) {

      var createQualityNode = document.createElement('div');
      createQualityNode.setAttribute('id', 'slideme-quality');
      var thisTypeUrl = thisPlayer.src();
      var findThatType = thisPlayerEl.querySelectorAll('[src="' + thisTypeUrl + '"]')[0];
      findThatType = findThatType.getAttribute('type');

      var videoHigh;
      var videoLow;

      for (var sourceType in data.videosources) {
        if (sourceType === findThatType) {
          videoHigh = data.videosources[sourceType];
        }
      }
      for (var sourceTypeMobile in data.videosourcesmobile) {
        if (sourceTypeMobile === findThatType) {
          videoLow = data.videosourcesmobile[sourceTypeMobile];
        }
      }

      createQualityNode.innerHTML = '<div id="slideme-change-quality">Auto</div><div id="slideme-change-quality-list"><p data-quality="' + videoHigh + '">High</p><p data-quality="' + videoLow + '">Low</p></div>';
      document.getElementsByClassName('vjs-control-bar')[0].appendChild(createQualityNode);

      var showHide = false;
      var showHideQualityNode = document.getElementById('slideme-change-quality-list');

      var getNewSource = function() {

        var thisTime = thisPlayer.currentTime();
        var src = this.getAttribute('data-quality');
        document.getElementById('slideme-change-quality').innerHTML = this.innerHTML;
        thisPlayer.src(src);
        thisPlayer.currentTime(thisTime);
        thisPlayer.play();

        showHide = false;
        showHideQualityNode.style.display = 'none';

      };

      document.querySelectorAll('[data-quality]')[0].addEventListener('click', getNewSource);

      document.querySelectorAll('[data-quality]')[1].addEventListener('click', getNewSource);

      document.getElementById('slideme-change-quality').addEventListener('click', function() {

        if (showHide === false) {
          showHide = true;
          showHideQualityNode.style.display = 'block';
        } else {
          showHide = false;
          showHideQualityNode.style.display = 'none';
        }

      });

      thisPlayerEl.addEventListener('click', function() {

        showHide = false;
        showHideQualityNode.style.display = 'none';

      });

    }


  });

};
document.addEventListener('DOMContentLoaded', function() {

  var checkIfSlideMe = document.querySelectorAll('[data-slidemejs]')[0];

  if (checkIfSlideMe !== undefined && checkIfSlideMe.getAttribute('data-slidemejs') !== '') {

    slideMe.loadJson(checkIfSlideMe.getAttribute('data-slidemejs'));

  }


  slideMe.loadAssets('//vjs.zencdn.net/4.11.2/video.js', 'script', function(){
    slideMe.createDOM();
  });
  slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/slidemecss.min.css', 'css');
  slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/video-js.min.css', 'css');


});