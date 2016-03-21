//Store state of playing songs
var currentlyPlayingSongNumber = null,
    previouslyPlayingSongNumber = null,
    currentSongFromAlbum = null,
    previousSongFromAlbum = null,
    currentAlbum = null,
    previousAlbum = null,
    currentSoundFile = null,
    previousSoundFile = null,
    currentVolume = 80,
    $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next'),
    $playerBarPlayPauseButton = $('.main-controls .play-pause');

// Button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButtonTemplate = '<span class="ion-play"></span>',
    playerBarPauseButtonTemplate = '<span class="ion-pause"></span>';

var setSong = function (songNumber) {
    if (currentlyPlayingSongNumber !== null) {
        previouslyPlayingSongNumber = currentlyPlayingSongNumber;
        previousSongFromAlbum = currentSongFromAlbum;
        previousAlbum = currentAlbum;
        previousSoundFile = currentSoundFile;
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ["mp3"]
    });
    
    setVolume(currentVolume);
};

var setVolume = function (volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBarSong = function () {
    
    if (currentSongFromAlbum) {
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
        $playerBarPlayPauseButton.html(playerBarPauseButtonTemplate);
    } else {
        $('.currently-playing .song-name').text(null);
        $('.currently-playing .artist-name').text(null);
        $('.currently-playing .artist-song-mobile').text(null);
        $playerBarPlayPauseButton.html(playerBarPlayButtonTemplate);
    }
    
    if (currentSoundFile.isPaused()) {
        $playerBarPlayPauseButton.html(playerBarPlayButtonTemplate);
    }
};

var clickHandler = function () {
    
    var songNumber = parseInt($(this).attr('data-song-number'), 10),
        currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
	
    if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play to Pause button to indicate new song is playing
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
		$(this).html(pauseButtonTemplate);
		setSong(songNumber);
        if (previousSoundFile) {
            previousSoundFile.stop();
        }
        currentSoundFile.play();
	}
    
    else {
        // Switch from Pause to Play button for currently playing song
        if (currentSoundFile.isPaused()) {
            $(this).html(playButtonTemplate);
            currentSoundFile.togglePlay();
        }
		else {
            $(this).html(pauseButtonTemplate);
            currentSoundFile.togglePlay();
        }
	}
    
    updatePlayerBarSong();
};

var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
        '<tr class="album-view-song-item">' +
        '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + 
        '    <td class="song-item-title">' + songName + '</td>' + 
        '    <td class="song-item-duration">' + songLength + '</td>' + 
        '</tr>',
        
        $row = $(template),
        
        onHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
            
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            }
            
            if (songNumber === currentlyPlayingSongNumber) {
                if (currentSoundFile.isPaused()) {
                    songNumberCell.html(playButtonTemplate);
                }
                else {
                    songNumberCell.html(pauseButtonTemplate);
                }
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
    
    if (currentAlbum !== null) {
        previousAlbum = currentAlbum;
    }
    
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

//var nextSong = function () {
//    
//    var getLastSongNumber = function (index) {
//        return index === 0 ? currentAlbum.songs.length : index;
//    },
//        currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    
//    currentSongIndex++;
//    
//    if (currentSongIndex >= currentAlbum.songs.length) {
//        currentSongIndex = 0;
//    }
//    
//    setSong(currentSongIndex + 1);
//    
//    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
//    $('.currently-playing .artist-name').text(currentAlbum.artist);
//    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
//    $('.main-controls .play-pause').html(playerBarPauseButton);
//    
//    var lastSongNumber = getLastSongNumber(currentSongIndex),
//        $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber),
//        $lastSongNumberCell = getSongNumberCell(lastSongNumber);
//    
//    $nextSongNumberCell.html(pauseButtonTemplate);
//    $lastSongNumberCell.html(lastSongNumber);
//};
//
//var previousSong = function () {
//    
//    var getLastSongNumber = function (index) {
//        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
//    },
//        currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//    
//    currentSongIndex--;
//    
//    if (currentSongIndex < 0) {
//        currentSongIndex = currentAlbum.songs.length - 1;
//    }
//    
//    setSong(currentSongIndex + 1);
//    
//    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
//    $('.currently-playing .artist-name').text(currentAlbum.title);
//    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
//    $('.main-controls .play-pause').html(playerBarPauseButton);
//    
//    var lastSongNumber = getLastSongNumber(currentSongIndex),
//        $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber),
//        $lastSongNumberCell = getSongNumberCell(lastSongNumber);
//    
//    $previousSongNumberCell.html(pauseButtonTemplate);
//    $lastSongNumberCell.html(lastSongNumber);
//};

var changeSong = function (direction) {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    switch(direction) {
        case 'next':
            var getLastSongNumber = function (index) {
                return index === 0 ? currentAlbum.songs.length : index;
            };
            
            currentSongIndex++;
            
            if (currentSongIndex >= currentAlbum.songs.length) {
                currentSongIndex = 0;
            }
            
            break;
            
        case 'previous':
            var getLastSongNumber = function (index) {
                return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
            };
            
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                currentSongIndex = currentAlbum.songs.length - 1;
            }
            
            break;
    }
    
    setSong(currentSongIndex + 1);
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $playerBarPlayPauseButton.html(playerBarPauseButtonTemplate);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex),
    $targetSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber),
    $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $targetSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
    if (previousSoundFile) {
        previousSoundFile.stop();
    }
    currentSoundFile.play();
};

var togglePlayFromPlayerBar = function () {
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    if (currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            currentlyPlayingCell.html(pauseButtonTemplate);
            $playerBarPlayPauseButton.html(playerBarPauseButtonTemplate);
            currentSoundFile.togglePlay();
        }
        else {
            currentlyPlayingCell.html(playButtonTemplate);
            $playerBarPlayPauseButton.html(playerBarPlayButtonTemplate);
            currentSoundFile.togglePlay();
        }
    }
    
    else {
        setSong(0);
        currentSoundFile.play();
	}
    
    updatePlayerBarSong();
}

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function () {
        changeSong('previous');
    });
    $nextButton.click(function () {
        changeSong('next');
    });
    $playerBarPlayPauseButton.click(function () {
        togglePlayFromPlayerBar();
    });
});
