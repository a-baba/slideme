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