const container = document.querySelector('.container');
const videosWow = document.querySelectorAll('[data-video-type="wow"]');
const videoAudioOverlays = document.querySelectorAll('videoAudioOverlay');

const playPauses = document.querySelectorAll('.play-pause');

let volumeValue = 50;
const audioSpeakers = document.querySelectorAll('.audio-speaker');
const audioLevelsContainer =  document.querySelector('.audio-levels-container');


//search for any URL query parameters
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
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




videosWow.forEach(video => {

  video.volume = 0;

  //mouseover
  video.addEventListener("mouseover", (event) => {

    videosWow.forEach(videoRef => {

      const audioLevels = videoRef.parentElement.querySelector('.audio-levels');
      audioLevels.classList.add('opacity-0');

    });
  });


  //click
  video.addEventListener("click", (event) => {

     videosWow.forEach(videoRef => {

      //remove or add overlay graphics
      const videoAudioOverlay = videoRef.parentElement.querySelector('.videoAudioOverlay');
      const audioWaves = videoRef.parentElement.querySelector('[data-id="waves"]')
    

      if(!videoRef.muted) {
        videoRef.muted = true
        videoAudioOverlay.classList.remove('opacity-0');
        audioWaves.classList.add('opacity-0');
      } else {
        videoRef.muted = false
        videoAudioOverlay.classList.add('opacity-0');
        audioWaves.classList.remove('opacity-0');

      }
    
      // are we paused?
      const playPauseButton = videoRef.parentElement.querySelector('.play-pause');
      const playButton = playPauseButton.querySelector('.play');
      const pauseButton = playPauseButton.querySelector('.pause');
      const isVideoPlaying = playButton.classList.contains('opacity-0');

      if(!isVideoPlaying) {
        videoRef.play();
        videoAudioOverlay.classList.add('opacity-0');
        playButton.classList.add('opacity-0');
        pauseButton.classList.remove('opacity-0');
      }


     });
  });



});




document.addEventListener("scroll", (event) => {

  videosWow.forEach(video => {
    var videoID = video.getAttribute('data-id'); 
    const audioLevels = video.parentElement.querySelector('.audio-levels');
    audioLevels.classList.add('opacity-0');

    inViewport = getElementVisibility(video);
    video.volume = (inViewport * .01) * (volumeValue * .01) ;

    const playButton = video.parentElement.querySelector('.play');
    const isVideoPlaying = playButton.classList.contains('opacity-0');

    //if the user has not paused the video and we are in view then play....
    if(isVideoPlaying && inViewport > 0) {
      video.play();
       console.log("video: ", videoID, " | play");
    } else {
      video.pause(); 
      console.log("video: ", videoID, " | pause");
    }  

  });

});


// VOLUME CONTROL 

function volumeChange(value) {

  console.log("value: " + value);
  volumeValue = value;

  console.log("Current slider value:", volumeValue);

  //adjust volume on each video for the update
  videosWow.forEach(video => {

    //change each audio volume slider to match the one that was changed
    const audioLevels = video.parentElement.querySelector('.audio-levels');
    audioLevels.value =  volumeValue;


    inViewport = getElementVisibility(video);
    video.volume = (inViewport * .01) * (volumeValue * .01) ;
    console.log("video.volume: " + video.volume);

  });
}


Array.from(playPauses).forEach(playPause => {

  //don't show on mobile
  if(!isMobile()) {

    //show tooltip
    playPause.addEventListener('mouseover', (event) => { 

    const playButton = event.currentTarget.querySelector('.play');
    const isVideoPlaying = playButton.classList.contains('opacity-0');

    console.log("isVideoPlaying: " + isVideoPlaying);
    const copyTipText = isVideoPlaying ? "Pause" : "Play";

    const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
    showTipText.textContent  = copyTipText;
    showTipText.classList.add('visibility');


    });

    //move tooltip
    playPause.addEventListener('mousemove', (event) => {

      const playButton = event.currentTarget.querySelector('.play');
      const isVideoPlaying = playButton.classList.contains('opacity-0');

      const copyTipText = isVideoPlaying ? "Pause" : "Play";
      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.textContent  = copyTipText;

      const video = event.currentTarget.parentElement.querySelector('[data-video-type="wow"]');

      const rect = video.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;


      showTipText.style.top =  (y + 20) + 'px';
      showTipText.style.left =  (x - 50) + 'px';

    });


    //hide tooltip
    playPause.addEventListener('mouseout', (event) => { 

      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.classList.remove('visibility');
      
    });

  }

  

  playPause.addEventListener('click', (event) => { 


    const playButton = event.currentTarget.querySelector('.play');
    const isVideoPlaying = playButton.classList.contains('opacity-0');

    //don't show on mobile
    if (!isMobile()) { 

      const copyTipText = isVideoPlaying ? "Play" : "Pause";
      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.textContent  = copyTipText;

    }

    //update each
    videosWow.forEach(videoRef => {

      //remove or add overlay graphics
      const playPauseButton = videoRef.parentElement.querySelector('.play-pause');
      const playButton = playPauseButton.querySelector('.play');
      const pauseButton = playPauseButton.querySelector('.pause');

      //audio
      const videoAudioOverlay = videoRef.parentElement.querySelector('.videoAudioOverlay');
      const audioWaves = videoRef.parentElement.querySelector('[data-id="waves"]')
      const audioLevels = videoRef.parentElement.querySelector('.audio-levels');


      if(isVideoPlaying) {
        videoRef.pause();
        videoAudioOverlay.classList.remove('opacity-0');
        playButton.classList.remove('opacity-0');
        pauseButton.classList.add('opacity-0');

        videoRef.muted = true
        videoAudioOverlay.classList.remove('opacity-0');
        audioWaves.classList.add('opacity-0');

        //don't show on mobile
        if (!isMobile()) {
          audioLevels.classList.add('opacity-0')
        }
      } else {
        videoRef.play();
        videoAudioOverlay.classList.add('opacity-0');
        playButton.classList.add('opacity-0');
        pauseButton.classList.remove('opacity-0');

        videoRef.muted = false
        videoAudioOverlay.classList.add('opacity-0');

        //don't show on mobile
        if (!isMobile()) {
          audioLevels.classList.remove('opacity-0')
        }
      }
      
    }); 

  });
});


Array.from(audioSpeakers).forEach(audioSpeaker => {

  //don't show on mobile
  if (!isMobile()) { 

    //show tooltip
    audioSpeaker.addEventListener('mouseover', (event) => { 

      //don't show on mobile
      if (!isMobile()) { 

        const video = event.currentTarget.parentElement.querySelector('[data-video-type="wow"]');
        const copyTipText = video.muted ? "Unmute" : "Mute";
        const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
        showTipText.textContent  = copyTipText;

        showTipText.classList.add('visibility');

      }

    });

    // //move tooltip
    audioSpeaker.addEventListener('mousemove', (event) => {

      //don't show on mobile
      if (!isMobile()) {  
      const video = event.currentTarget.parentElement.querySelector('[data-video-type="wow"]');
      const copyTipText = video.muted ? "Unmute" : "Mute";
      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.textContent  = copyTipText;

      const rect = video.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      showTipText.style.top =  (y + 20) + 'px';
      showTipText.style.left =  (x - 50) + 'px';
      }
    });

    //hide tooltip
    audioSpeaker.addEventListener('mouseout', (event) => { 

      //don't show on mobile
      if (!isMobile()) {  
      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.classList.remove('visibility');
      }

    });

    audioSpeaker.addEventListener('mouseover', (event) => { 
    
      const audioWaves = event.currentTarget.querySelector('[data-id="waves"]')
      const audioLevels = event.currentTarget.parentElement.querySelector('.audio-levels');
      let mute = audioWaves.classList.contains('opacity-0');

      audioLevels.classList.remove('opacity-0');
    
    });

  }


  audioSpeaker.addEventListener('click', (event) => { 

    //don't show on mobile
    if (!isMobile()) { 

      //update tooltip on click
      const video = event.currentTarget.parentElement.querySelector('[data-video-type="wow"]');
      const copyTipText = video.muted ? "Mute" : "Unmute";
      const showTipText = event.currentTarget.parentElement.querySelector('.tooltiptext');
      showTipText.textContent  = copyTipText;
    }

    //update each
    videosWow.forEach(videoRef => {

      //remove or add overlay graphics
      const videoAudioOverlay = videoRef.parentElement.querySelector('.videoAudioOverlay');
      const audioWaves = videoRef.parentElement.querySelector('[data-id="waves"]')
      const audioLevels = videoRef.parentElement.querySelector('.audio-levels');

      //remove or add overlay graphics
      const playPauseButton = videoRef.parentElement.querySelector('.play-pause');
      const playButton = playPauseButton.querySelector('.play');
      const pauseButton = playPauseButton.querySelector('.pause');

      //console.log("videoAudioOverlay: ", videoAudioOverlay);

      if(!videoRef.muted) {
        videoRef.muted = true
        videoAudioOverlay.classList.remove('opacity-0');
        audioWaves.classList.add('opacity-0');
        audioLevels.classList.add('opacity-0')
      } else {
        videoRef.muted = false
        videoAudioOverlay.classList.add('opacity-0');
        audioWaves.classList.remove('opacity-0');

        //don't show on mobile
        if (!isMobile()) { 
        audioLevels.classList.remove('opacity-0');
        }

        videoRef.play();
        videoAudioOverlay.classList.add('opacity-0');
        playButton.classList.add('opacity-0');
        pauseButton.classList.remove('opacity-0');

      }
      
    }); 

  });






});

