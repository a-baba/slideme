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