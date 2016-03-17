/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint plusplus: true*/

//Store state of playing songs
var currentlyPlayingSongNumber = null,
    currentlyPlayingSong = null,
    currentSongFromAlbum = null,
    currentAlbum = null;

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var clickHandler = function () {
	"use strict";
    
    var songNumber = $(this).attr('data-song-number'),
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
                songNumber = songNumberCell.attr('data-song-number');
            
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate);
            }
        },
        
        offHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = songNumberCell.attr('data-song-number');
            
            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            }
        };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    "use strict";
    
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

var updatePlayerBarSong = function () {
    "use strict";
    
    if (currentSongFromAlbum) {
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    } else {
        $('.currently-playing .song-name').text(null);
        $('.currently-playing .artist-name').text(null);
        $('.currently-playing .artist-song-mobile').text(null);
    }
    
};

$(document).ready(function () {
    "use strict";
    
    setCurrentAlbum(albumPicasso);
});
