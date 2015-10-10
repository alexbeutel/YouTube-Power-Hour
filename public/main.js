function Song(newid, ti, du, th, vi) {
	this.id = newid;
	this.title = ti;
	this.duration = du;
	this.thumbnail = th;
	this.views = vi;
	this.getListItem = function() {
		var d = document.createElement('div');
		d.style.cursor = 'pointer';
		var img = document.createElement('img');
		img.src = this.thumbnail;
		d.appendChild(img);
		var span = document.createElement('span');
		span.innerHTML = this.title;
		d.appendChild(span);
		d.onclick = function(s) {
			return function() {
				curPlaylist.push(s);
				amb.$('lists2').innerHTML = '';
				amb.$('searchQuery').value = '';
			}
		}(this);
		//console.log(d);
		return d;
	}
}
function Playlist(nid, ti) {
	this.id = nid;
	this.title = ti;
	this.songs = null;
	this.getMenuItem = function() {
		var div = document.createElement('div');
		var d = document.createElement('a');
		d.href = '#'+this.title;
		d.style.cursor= 'pointer';
		d.innerHTML = this.title;
		d.id= this.id;
		d.onclick = function(o) {
				loadNewPlaylist(o.target.id);
		};
		div.appendChild(d);
		return div;
	}
}

function error(msg) {
	amb.$('error').innerHTML = msg;
	amb.$('error').style.display='';
	setTimeout('clearError()', 7000);
}
function clearError() {
	amb.$('error').style.display='none';
}


// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
	error("An error occured of type " + errorCode + " on " + curSong.title);
	skipSong();
}

var ytplayer;
// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("ytPlayer");
	ytplayer.addEventListener("onError", "onPlayerError");
	ut = setInterval('updateTime()', 1000);
	nextSong();
}

var time = -1;
var seconds = 0;
var ut = null;
var curPlaylist = new Array();
	var gl;
var curSong = null;
var noEmbed = "";
var lastId = "";
function addPlaylist(json) {
	gl = json;
	console.log(json);
	var it = json['items'];
	for(var i = 0; i < it.length; i++) {
		var s1 = it[i]['snippet'];
		var title = s1['title'];
		var vid = s1['resourceId']['videoId'];
		var th = (s1['thumbnails']) ? s1['thumbnails']['default']['url'] : '';
		var S = new Song(vid, title, 150, th);
		curPlaylist.push(S);
		//var th = (s1['thumbnail']) ? s1['thumbnail']['hqDefault'] : '';
		//var S = new Song(s1['id'], s1['title'], s1['duration'], th);
		//if(s1['accessControl'] && s1['accessControl']['embed'] == 'allowed' ) {
			//curPlaylist.push(S);
		//} else {
			//noEmbed += s1['title'] + ", ";
		//}
	}

	if(json['nextPageToken']) {
		loadNewPlaylist(lastId,json['nextPageToken']);
	} else {
		error("Embed disabled on " + noEmbed);
		startPlaylist();
	}
	//if(json['data']['totalItems'] > json['data']['startIndex'] + 50)
		//loadNewPlaylist(json['data']['id'],json['data']['startIndex']+51);
	//else{
		//error("Embed disabled on " + noEmbed);
		//startPlaylist();
	//}
	
}

function shuffle(a,b) {
	return Math.round(Math.random()*2) - 1;
}

var defaultSize = 'default';
function getAppropriateSize() {
	var w = amb.getWidth();
	var h = amb.getHeight() - 100;
	if(h < 240) {
		defaultSize = 'small';
		return [320,240];
   }else if (h <576 || w < 1024){
		defaultSize = 'medium';
		return [640,360];
   }else if (h < 720 || w < 1280){
		defaultSize = 'large';
		return [1024,576];
   }else if (h < 1080 || w < 1920){
		defaultSize = 'hd720';
		return [1280,720];
   }else{
		defaultSize = 'hd1080';
		return [1920,1080];
	}
}

function enterFullscreen() {
	//alert(amb.getHeight() + ", " + amb.getWidth());
	resizePlayer(amb.getWidth(), amb.getHeight());	
}
function resizePlayer(width, height) {
	var playerObj = document.getElementById("ytPlayer");
	playerObj.height = height;
	playerObj.width = width;
	ytplayer.setSize( width, height);
}
                    	

var totalViewed = 0;
function nextSong() {
	setTimeout('nextSong()', 60000);
	//setTimeout('nextSong()', 6000);
	time++;
	seconds = 0;
	skipSong();
}

function skipSong() {
	if(curPlaylist.length > 0) {
		var s = curPlaylist.pop();
		curSong = s;
		amb.$('vidTitle').innerHTML = s.title;
		if(ytplayer) {
			var t = amb.rand(10, s.duration-70);
			ytplayer.loadVideoById(s.id,t, defaultSize);
			if(ytplayer.getPlayerState() != 1) {
				ytplayer.playVideo();
				totalViewed++;
				if (totalViewed % 5 == 0) {
					console.log(totalViewed);
				}
			}
		}
	} else {
		console.log("Total = " + totalViewed);
	}
}

function updateTime() {
	var s= seconds;
	if(seconds < 10) s = "0" + seconds;
	amb.$('time').innerHTML = time + ":" + s;
	amb.$('time2').innerHTML = time + ":" + s;
	seconds++;
}
function startPlaylist() {
	_run();
	amb.$('videoInfo').style.display='';
	amb.$('playlistSelect').style.display='none';
	curPlaylist.sort(shuffle);
}
function addSongCallback(json) {
		if(json['data']['accessControl'] && json['data']['accessControl']['embed'] == 'allowed') {
			var th = (json['data']['thumbnail']) ? json['data']['thumbnail']['hqDefault'] : '';
			var s = new Song(json['data']['id'], json['data']['title'], json['data']['duration'], th);
			curPlaylist.push(s);
		} else {
			alert(json['data']['title'] + " not allowed to be embeded");
		}
}
function addSong() {
	var url = 'http://gdata.youtube.com/feeds/api/videos/' + amb.$('songID').value + '?v=2&alt=jsonc&callback=addSongCallback';
	amb.$('songID').value = "";
	amb.addScript(url);
}

function searchCallback(json) {
	console.log(json);
	var it = json['items'];
	for(var i = 0; i < it.length; i++) {
		var s1 = it[i];
		var th = (s1['snippet']['thumbnails']) ? s1['snippet']['thumbnails']['default']['url'] : '';
		var S = new Song(s1['id']['videoId'], s1['snippet']['title'], 150, th);
		//if(s1['accessControl'] && s1['accessControl']['embed'] == 'allowed') {
		amb.$('lists2').appendChild(S.getListItem());
			//}
	}
}
function search() {
	//var url ='http://gdata.youtube.com/feeds/api/videos?q=' + amb.$('searchQuery').value + '&v=2&alt=jsonc&callback=searchCallback&max-results=10';
	//'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=britney+spears&type=video&videoEmbeddable=true&key='
	var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=' + amb.$('searchQuery').value + '&type=video&videoEmbeddable=true&key=AIzaSyCONCDofhD3weS3rw4wpxHI1rxgAfjyLDc&callback=searchCallback'
	console.log(url);
	amb.addScript(url);
}


function loadNewPlaylist(id,start) {
	//var url = 'http://gdata.youtube.com/feeds/api/playlists/'+id+'?v=2&alt=jsonc&callback=addPlaylist&max-results=50&start-index='+start;
	var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=50&playlistId=' + id +'&key=AIzaSyCONCDofhD3weS3rw4wpxHI1rxgAfjyLDc&callback=addPlaylist'
	if(start)
		url += "&pageToken="+start;
	lastId = id;
	console.log(url);
	amb.addScript(url);
}

function getUserPlaylists(json) {
	var it = json['data']['items'];
	amb.$('lists').innerHTML = 'Select a playlist:<br />';
	for(var i = 0; i < it.length; i++) {
		var p = it[i];
		var P = new Playlist(p['id'], p['title']);
		amb.$('lists').appendChild(P.getMenuItem());
	}
}

function loadUserPlaylists() {
   var id = amb.$('playlistInput').value;
	var url = 'http://gdata.youtube.com/feeds/api/users/'+id+'/playlists?v=2&alt=jsonc&callback=getUserPlaylists'; 
	amb.addScript(url);
}

function loadPlayer(s) {
  var videoID = "ylLzyHk54Z0"
  var params = { allowScriptAccess: "always", allowFullScreen: 'true', wmode:'transparent'};
  var atts = { id: "ytPlayer" , allowFullScreen: 'true', wmode: 'transparent'};

  swfobject.embedSWF("http://www.youtube.com/v/" + videoID + 
  "&enablejsapi=1&playerapiid=player1", 
  "videoDiv", s[0], s[1], "8", null, null, params, atts);
}


var sizeParameters = null;
function fullscreen() {
	amb.$('timeOverlay').style.display = '';
	resizePlayer( amb.getWidth()-30, amb.getHeight()-20);
	amb.$('resizeButton').style.display='';
	amb.$('fullscreenButton').style.display='none';
	
}
function unfullscreen() {
	amb.$('timeOverlay').style.display = 'none';
	sizeParameters = getAppropriateSize();
	resizePlayer( sizeParameters[0], sizeParameters[1]);
	amb.$('resizeButton').style.display='none';
	amb.$('fullscreenButton').style.display='';
}

function _run() {
	sizeParameters = getAppropriateSize();
	loadPlayer(sizeParameters);
 //  amb.$('videoDiv').style.width = sizeParameters[0];
 //  amb.$('videoDiv').style.height = sizeParameters[1];
}
//google.setOnLoadCallback(_run);

