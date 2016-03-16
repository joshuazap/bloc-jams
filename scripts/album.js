/*jslint browser: true*/
/*global $, jQuery, alert*/

var currentAlbum = null,
    currentlyPlayingSongNumber = null,
    currentSongFromAlbum = null,
    $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next'),
    playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButton = '<span class="ion-play"></span>',
    playerBarPauseButton = '<span class="ion-pause"></span>',
    currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');

var updatePlayerBarSong = function () {
    "use strict";
    
    $('.currently-playing .song-name').text($(this).title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text($(this).title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var clickHandler = function () {
    "use strict";
    
    var songNumberCell = $(this).find('.song-item-number'),
        songNumber = songNumberCell.data('.song-item-number');

	if (currentlyPlayingSongNumber === null) {
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
    if (currentlyPlayingSongNumber !== songNumber) {
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	} else if (currentlyPlayingSongNumber === songNumber) {
		$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
	}
    updatePlayerBarSong();
};

var createSongRow = function (songNumber, songName, songLength) {
    "use strict";
    
    var template =
        '<tr class="album-view-song-item">'
        + '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '    <td class="song-item-title">' + songName + '</td>'
        + '    <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>',
        $row = $(template),
        onHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = $(this).attr('data-song-number');
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            } else {
                songNumberCell.html(pauseButtonTemplate);
            }
        },
        offHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = parseInt($(this).attr('data-song-number'), 10);
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            } else {
                songNumberCell.html(pauseButtonTemplate);
            }
        };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    "use strict";
    
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
    
    for (i = 0; i < album.songs.length; i += 1) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function (album, song) {
    "use strict";
    
    return currentAlbum.songs.indexOf(song);
};

var nextSong = function () {
    "use strict";
    
    var getLastSongNumber = function (index) {
        return index === 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex += 1;
    
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
        $lastSongNumberCell = $('.song-item-number[data-song-number="' + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $nextSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    "use strict";
    
    var getLastSongNumber = function (index) {
        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex -= 1;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex),
        $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'),
        $lastSongNumberCell = $('.song-item-number[data-song-number="' + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $nextSongNumberCell.html(lastSongNumber);
};

$(document).ready(function () {
    "use strict";
    
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
