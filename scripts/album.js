//Store state of playing songs
var currentlyPlayingSongNumber = null,
    currentlyPlayingSong = null,
    currentSongFromAlbum = null,
    currentAlbum = null;

// Button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButton = '<span class="ion-play"></span>',
    playerBarPauseButton = '<span class="ion-pause"></span>';

var updatePlayerBarSong = function () {
    
    if (currentSongFromAlbum) {
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
        $('.main-controls .play-pause').html(playerBarPauseButton);
    } else {
        $('.currently-playing .song-name').text(null);
        $('.currently-playing .artist-name').text(null);
        $('.currently-playing .artist-song-mobile').text(null);
        $('.main-controls .play-pause').html(playerBarPlayButton);
    }
    
};

var clickHandler = function () {
    
    var songNumber = parseInt($(this).attr('data-song-number'), 10),
        currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');

	if (currentlyPlayingSongNumber !== null) {
        // Revert to song number when user starts playing new song
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	
    if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play to Pause button to indicate new song is playing
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        
	} else if (currentlyPlayingSongNumber === songNumber) {
        // Switch from Pause to Play button for currently playing song
		$(this).html(playButtonTemplate);
		currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
	}
    
    updatePlayerBarSong();
};

var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
        '<tr class="album-view-song-item">'
        + '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '    <td class="song-item-title">' + songName + '</td>'
        + '    <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>',
        
        $row = $(template),
        
        onHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
            
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            }
        },
        
        offHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
            
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            }
        };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title'),
        $albumArtist = $('.album-view-artist'),
        $albumReleaseInfo = $('.album-view-release-info'),
        $albumImage = $('.album-cover-art'),
        $albumSongList = $('.album-view-song-list'),
        i;
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
    
    for (i = 0; i < album.songs.length; i++) {
        $albumSongList.append(createSongRow(i + 1, album.songs[i].title, album.songs[i].duration));
    }
};

var trackIndex = function (album, song) {
    
    return album.songs.indexOf(song);
};

var nextSong = function () {
    
    var getLastSongNumber = function (index) {
        return index === 0 ? currentAlbum.songs.length : index;
    },
        currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex),
        $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'),
        $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    
    var getLastSongNumber = function (index) {
        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
    },
        currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex),
        $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'),
        $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next');

$(document).ready(function () {
    
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
