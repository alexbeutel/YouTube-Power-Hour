YouTube Power Hour
==================================

Includes the code for [youtubepower.com](http://youtubepowerhour.com/).  There
are no external dependenices.

Code was primarily written during a "code off" with [DJ
Sharkey](https://github.com/dsharkey) where we raced for a couple of hours to
see who could create the best YouTube Power Hour site.  As a result, code
organization is pretty bad.


TODO
===========================

 * Reorganize and Comment code
 * Better error handling - more clear notifications of songs that can't be embedded, etc
 * Deal with playlists that are less than 60 songs (or if songs are skipped due to errors).  Notify user and start the queue again would probably be the best UX. Don't stop the party
 * Buffer next song - not sure if new [YouTube API](https://developers.google.com/youtube/js_api_reference) `player.cueVideoById` will do this or need to have multiple players that we switch between
 * There are other errors - do power hour and catalog them as they occur
 * Add "Fork me on GitHub Bro" ribbon
