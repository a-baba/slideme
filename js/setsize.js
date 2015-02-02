slideMe.setSize = function() {

    var sW = slideMeContainer.offsetWidth;
    var sH;

    if (slideMe.data.videosourcesmobile === undefined && slideMe.data.videosources === undefined) {
      sH = 480;
    } else {
      sW = sW / 2;
      sH = sW / 1.78;
      sW = sH * 1.33;

    }

    slideMe.presentationNode.style.width = sW + 'px';
    slideMe.presentationNode.style.height = sH + 'px';

    var vW = slideMeContainer.offsetWidth;
    var vH;
    if (slideMe.data.videoslides === undefined) {
      vH = vW / 1.78;
    } else {
      vW = vW / 2;
      vH = vW / 1.78;
    }
    
    slideMe.addAttributes(slideMe.thisVideoPlayer, {'id': 'videojs', 'controls': '', 'width': vW, 'height': vH});

};
