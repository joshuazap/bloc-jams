// Example Album
var albumPicasso = {
   title: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: 'assets/images/album_covers/01.png',
   songs: [
       { title: 'Blue', duration: '4:26' },
       { title: 'Green', duration: '3:14' },
       { title: 'Red', duration: '5:01' },
       { title: 'Pink', duration: '3:21'},
       { title: 'Magenta', duration: '2:15'}
   ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

// Third Example Album
var albumBoc = {
   title: 'Catalog 3',
   artist: 'Boards of Canada',
   label: 'Music70',
   year: '1987',
   albumArtUrl: 'assets/images/album_covers/Boc1.jpg',
   songs: [
     { title: 'Line Two', duration: '10:43' },
     { title: 'Drone 18', duration: '6:40' },
     { title: 'Drone 2', duration: '5:55'},
     { title: 'Breach Tones', duration: '8:13' },
     { title: 'Visual Drone 12', duration: '13:21'},
     { title: 'Stowed Under', duration: '4:15'},
     { title: 'Powerline', duration: '2:22'},
     { title: 'Press', duration: '5:08'}
   ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
  + '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '    <td class="song-item-title">' + songName + '</td>'
  + '    <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;
  
  return $(template);
};

var setCurrentAlbum = function(album) {
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');
  
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.L = '';
  
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
  }
};

var findParentByClassName = function(element, target) {
  while(element.parentNode) {
    if (element.parentNode.className === target) {
      return element.parentNode;
    }
    element = element.parentNode;
  }
};

var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);
  
  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {
  setCurrentAlbum(albumPicasso);
  
//  var index = 1;
//  var albumArray = [albumPicasso, albumMarconi, albumBoc];
//  var $albumImage = document.getElementsByClassName('album-cover-art')[0];
//  
//  $albumImage.addEventListener('click', function(event) {
//    var nextAlbum = albumArray[index];
//    setCurrentAlbum(nextAlbum);
//    index = (index + 1) % (albumArray.length);
//  })

  songListContainer.addEventListener('mouseover', function(event) {
    // Target individual song rows during event delegation
    if (event.target.parentElement.className === 'album-view-song-item') {
      // Change the content from song number to play button
      event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      var songItem = getSongItem(event.target);
      
      if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
        songItem.innerHTML = playButtonTemplate;
      }
      // Change the content from play button to pause button for currentlyPlayingSong
      else if (songItem.getAttribute('data-song-number') === currentlyPlayingSong) {
        songItem.innerHTML = pauseButtonTemplate;
      }
    }
  });
  
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      
      if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
    });
    
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
};
