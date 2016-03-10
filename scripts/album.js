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
  + '    <td class="song-item-number">' + songNumber + '</td>'
  + '    <td class="song-item-title">' + songName + '</td>'
  + '    <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;
  
  return template;
};

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
  
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  
  albumSongList.innerHTML = '';
  
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

window.onload = function() {
  setCurrentAlbum(albumPicasso);
  
  var index = 1;
  var albumArray = [albumPicasso, albumMarconi, albumBoc];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  
  albumImage.addEventListener('click', function(event) {
    var nextAlbum = albumArray[index];
    setCurrentAlbum(nextAlbum);
    index = (index + 1) % (albumArray.length);
  })
};
