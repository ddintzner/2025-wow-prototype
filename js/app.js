const videosWow = document.querySelectorAll('[data-video-type="wow"]');
const videoAudioOverlays = document.querySelectorAll('videoAudioOverlay');
const volumeSlider = document.getElementById("volume"); 
let volumeValue = volumeSlider.value;


//search for any URL query parameters
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


if (typeof params["volumebar"] !== 'undefined') {

  document.getElementById('content-audio-controls').style.display  = "flex";
}


function getElementVisibility(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

  const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
  const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));

  const elementArea = rect.width * rect.height;
  const visibleArea = visibleWidth * visibleHeight;

  return (elementArea > 0) ? (visibleArea / elementArea) * 100 : 0;
}



volumeSlider.addEventListener("input", function() {
 
  volumeValue = this.value;
  console.log("Current slider value:", volumeValue);

  //adjust volume on each video for the update
  videosWow.forEach(video => {

    inViewport = getElementVisibility(video);
    video.volume = (inViewport * .01) * (volumeValue * .01) ;
    console.log("video.volume: " + video.volume);
    video.muted = false;
    const videoAudioOverlay = video.previousElementSibling;
    videoAudioOverlay.classList.add('opacity-0');

  });

});



videosWow.forEach(video => {

  video.volume = 0;

  video.addEventListener("click", (event) => {

     videosWow.forEach(videoRef => {

      //videoRef.muted =  (videoRef.muted ) ? false : true;
      const videoAudioOverlay = videoRef.previousElementSibling;

      if(!videoRef.muted) {
        videoRef.muted = true
        videoAudioOverlay.classList.remove('opacity-0');
      } else {
        videoRef.muted = false
        videoAudioOverlay.classList.add('opacity-0');
      }
     
     });
  });
});



document.addEventListener("scroll", (event) => {

  videosWow.forEach(video => {

    inViewport = getElementVisibility(video);
    video.volume = (inViewport * .01) * (volumeValue * .01) ;
    video.play();

  });


});

