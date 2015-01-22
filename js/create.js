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
