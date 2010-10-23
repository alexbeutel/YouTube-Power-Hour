amb = function() {
	return {
				$ : function(id) {
					return document.getElementById(id);
				},
				addScript : function(url) {
					var tag = document.head;
					if(!tag) {
						tag = document.getElementsByTagName('head')[0];
					}
					var s = document.createElement('script');
					s.src = url;
					s.type = 'text/javascript';
					tag.appendChild(s);
				},
				rand: function(begin, end) {
					return (end-begin)*Math.random() + begin;
				},
				getHeight: function() {
					var b = amb.browserType();
					return (b == 'Webkit' && !document.evaluate) ? self['innerHeight'] :
					(b == 'Opera') ? document.body['clientHeight'] : document.documentElement['clientHeight'];
				},
				getWidth: function() {
					var b = amb.browserType();
					return (b == 'Webkit' && !document.evaluate) ? self['innerWidth'] :
			        (b == 'Opera') ? document.body['clientWidth'] : document.documentElement['clientWidth'];
				},
				browserType: function() {
				   if(!!(window.attachEvent && !window.opera))
						return 'IE';
				   if(!!window.opera)
					   	return 'Opera';
				   if(navigator.userAgent.indexOf('AppleWebKit/') > -1)
					   	return 'Webkit';
				   if(navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1)
					   	return 'Gecko';
				   if(!!navigator.userAgent.match(/Apple.*Mobile.*Safari/))
						return 'MobileSafari';
				   return '';
				}

			}
}();
