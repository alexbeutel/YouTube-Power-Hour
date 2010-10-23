//Generic interface for client-side storage.  Use localStorage when available.
//Otherwise use cookies
//Cookie code from: http://www.quirksmode.org/js/cookies.html
//For reference on localStorage: http://diveintohtml5.org/storage.html
Storage = function() {
	return {
		get : function(key) {
			if (supports_html5_storage()) {
				return localStorage.getItem(key);
			} else {
				return readCookie(key);
			}
		},
		set : function(key, value) {
			if (supports_html5_storage()) {
				return localStorage.setItem(key,value);
			} else {
				return createCookie(key,value,1000);
			}
		},
		remove : function(key) {
			if (supports_html5_storage()) {
				return localStorage.removeItem(key);
			} else {
				return eraseCookie(key);
			}
		},
		createCookie : function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		readCookie : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		eraseCookie : function(name) {
			createCookie(name,"",-1);
		},
		supports_html5_storage : function () {
			try {
				return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}
		}
	};
}();
