function $(selector){
  return document.querySelector(selector)
}
function $$(selector){
  return document.querySelectorAll(selector)
}

var audio = new Audio()
var musicNumer = 0
var musicList = []

audio.ontimeupdate = function(){
  $('.progress .now').style.width = (this.currentTime/this.duration)*100 + '%'
}



audio.onplay = function(){
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = (Math.floor(audio.currentTime))%60
    var time = sec <= 9 ? min + ':0' + sec : min + ':' + sec
    $('.progress .time').innerText = time;
  }, 1000)
}
audio.onpause = function(){
  clearInterval(clock);
}
audio.onended = function(){
  musicNumer = (++musicNumer) % musicList.length
  loadMusic(musicList[musicNumer]);
  audio.play();
} 
getMusic (function(list){
  musicList = list
  //console.log(list[musicNumer])
  
  for(var music in list){
    var li = document.createElement('li')
    li.innerText = list[music].title + '-' + list[music].author
    li.setAttribute('musicNumber', music)
    //console.log(li)
    $('.playlist').appendChild(li);
  }
  loadMusic(list[musicNumer])
})

$('.play').addEventListener('click', function(){
  if($('.play span').classList.contains('icon-play-')){
    //console.log('play')
    audio.play()
    $('.play span').classList.remove('icon-play-')
    $('.play span').classList.add('icon-pause-')
  }else{
    //console.log('stop')
    audio.pause()
    $('.play span').classList.add('icon-play-')
    $('.play span').classList.remove('icon-pause-')
  }
})
$('.next').addEventListener('click', function(){
  //console.log(musicList)
  musicNumer = (++musicNumer) % musicList.length
  loadMusic(musicList[musicNumer]);
  audio.play();
  $('.play span').classList.remove('icon-play-')
  $('.play span').classList.add('icon-pause-')
})
$('.back').addEventListener('click', function(){
  //console.log(musicList)
  if(musicNumer == 0){
    musicNumer = musicList.length - 1
  }else{
    musicNumer = musicNumer - 1
  }
  loadMusic(musicList[musicNumer]);
  audio.play();
  $('.play span').classList.remove('icon-play-')
  $('.play span').classList.add('icon-pause-')
})

$('.progress .bar').addEventListener('click', function(e){
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  audio.currentTime = audio.duration * percent
  $('.progress .now').style.width = percent*100 + '%'
})

$('.playlist').addEventListener('click',function(e){
  musicNumer = e.target.getAttribute('musicNumber')
  $('.play span').classList.add('icon-pause-')
  $('.play span').classList.remove('icon-play-')
  loadMusic(musicList[e.target.getAttribute('musicNumber')])
  //console.log(musicNumer)
  audio.play()
})
function getMusic(callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'music.json', true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status <300) || xhr.status ===304){
      callback(JSON.parse(xhr.responseText))
    }else{
      console.log('error')
    }
  }
  xhr.onerror = function(){
    console.log('error')
  }
  xhr.send()
}

function loadMusic(musicObj){
  //console.log('play' + musicObj.title)
  $('.musicpanel .title').innerText = musicObj.title
  $('.musicpanel .author').innerText = musicObj.author
  $('.musicpanel .image img').src = musicObj.img
  audio.src = musicObj.src
  console.log(musicNumer)
  var list = $$('.playlist li')
  for(var number = 0; number < list.length; number++){
    //console.log(list)
    //console.log(number)
    if(musicNumer == number){
      //console.log($$('.playlist li')[number].classList)
      $$('.playlist li')[number].classList = 'click';
    }else{
      $$('.playlist li')[number].classList = '';
    }
  }
}