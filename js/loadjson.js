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