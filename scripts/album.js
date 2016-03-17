/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint plusplus: true*/

//Store state of playing songs
var currentlyPlayingSong = null;

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var clickHandler = function () {
	"use strict";
    
    var songNumber = $(this).attr('data-song-number'),
        currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');

	if (currentlyPlayingSong === null) {
		currentlyPlayingCell.html(currentlyPlayingSong);
	}
	
    if (currentlyPlayingSong !== songNumber) {
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSong = songNumber;
	} else if (currentlyPlayingSong === songNumber) {
		$(this).html(playButtonTemplate);
		currentlyPlayingSong = null;
	}
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
            
            if (songNumber !== currentlyPlayingSong) {
                songNumberCell.html(playButtonTemplate);
            }
        },
        
        offHover = function (event) {
            var songNumberCell = $(this).find('.song-item-number'),
                songNumber = songNumberCell.attr('data-song-number');
            
            if (songNumber !== currentlyPlayingSong) {
                songNumberCell.html(songNumber);
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
    $albumSongList.L = '';
    
    for (i = 0; i < album.songs.length; i++) {
        $albumSongList.append(createSongRow(i + 1, album.songs[i].title, album.songs[i].duration));
    }
};

$(document).ready(function () {
    "use strict";
    setCurrentAlbum(albumPicasso);
});
