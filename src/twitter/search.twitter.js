/**
 * Jquery Simple Search Twitter Plugin
 * Licensed under the MIT license.
 * Build for touchmedia.fi
 * 
 * @author petteritorssonen
 * @version $Rev$
 * @requires OtherClassName
 */
(function($) {
    $.fn.searchTwitter = function(options) {
        var animateInterval = 5000;
		element = false,
		elementMask = false,
		elements = [],
		elementWidth = '240px',
		running = false,
        term = 'twitter',
		makeElementsFn = makeElements,
		starLoadSuccessful = false;
		url = 'http://search.twitter.com/search.json?&q=';

		//TODO: Test with options
        if (typeof options !== 'undefined') {
			if (typeof options == 'string'){
				term = options;
			}else{
				term = options.term;
				elementWidth = typeof options.elementWidth !== 'undefined' ? options.elementWidth : '240px';
				animateInterval = typeof options.animateInterval !== 'undefined' ? options.animateInterval : 5000;
				makeElementsFn = typeof options.makeElementsFn !== 'undefined' ? options.makeElementsFn : makeElements;
			}
        }

		function loadTweetsToElement () {
			ajax(url+term+'&rpp=30', makeElementsFn);
		}
		
		function fetchOneElement () {
			ajax(url+term+'&rpp=1', makeElementsFn);
		}
		
		function fetchMoreElements () {
			ajax(url+term+'&rpp=50', makeElementsFn);
		}
		
		//TODO: Add error handling
		function ajax (url, successFunc) {
			ajaxSetup = {
				url: url,
				dataType: 'jsonp',
				timeout: 30000,
				crossDomain: true,
				error: function(xhr, status, e) {
				},
				complete: function() {	
					animateIt();
				},
				success: function(data) {
					successFunc(data.results);
					starLoadSuccessful = true;
				}
			}
			
			$.ajax(ajaxSetup);
		}
		
		function animateIt () {
			if(running === false){
				running = true;
				setInterval(function  () {
					for (var i=0; i < elements.length; i++) {
						elements[i].animate({width: '0px', opacity: 0, margin: '0px', padding: '0px'}, 700);
						setTimeout(function  () {
							elements[i].remove();
							elements = jQuery.grep(elements, function(value) {
											return value != elements[i];
										});
							if(elements.length < 25){
								fetchMoreElements();
							}
						},1200);
						break;
					};
				}, animateInterval);
				
			}
			
		}
		
	
		
		function makeElements (results) {
			var count = results.length,
			width = 0;
			if(count > 0){
				results.reverse();
				$.each(results, function  (i) {
					var container = $('<div>').attr('class','tweetContainer'),
					paddingContainer = $('<div>').attr('style', 'padding:20px;'),
					image = $('<img>').attr('src',this.profile_image_url).attr('style', 'width:48px;height:48px'),
					username = $('<div>').attr('class', 'username').text('@'+this.from_user),
					text = $('<div>').attr('clss', 'tweetText').html(this.text),
					header = $('<div>').attr('class', 'header'),
					date = $('<div>').attr('class', 'date').text(prettyDate(this.created_at));
					username.append(date);
					header.append(image).append(username);
					paddingContainer.append(header).append(text);
					container.css({float: 'left', height: element.height(), width: elementWidth});
					container.append(paddingContainer);

					element.append(container); //adding element to container 
					elements.push(container);
				});
				width = parseInt(elements.length * parseInt(elementWidth));
				element.width(width+'px');
			}
		
		}
		
		/*
		 * JavaScript Pretty Date
		 * Copyright (c) 2008 John Resig (jquery.com)
		 * Licensed under the MIT license.
		 */
		// converts ISO time to casual time
		function prettyDate(time){
			var date = new Date((time || "").replace(/-/g,"/").replace(/TZ/g," ")),
				diff = (((new Date()).getTime() - date.getTime()) / 1000),
				day_diff = Math.floor(diff / 86400);

			if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
				return;
			var v = day_diff == 0 && (
					diff < 60 && "just now" ||
					diff < 120 && "1 minute ago" ||
					diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
					diff < 7200 && "1 hour ago" ||
					diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
				day_diff == 1 && "Yesterday" ||
				day_diff < 7 && day_diff + " days ago" ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
			if (!v)
				window.console && console.log(time);
			return v ? v : '';
		}


		return this.each(function() {
			var owner = $(this);
			elementMask = $('<div>').css({overflow: 'hidden', height: owner.height(), width: owner.width()+parseInt(elementWidth)+200, position: 'absolute'});
			element = $('<div>').css({overflow: 'hidden', height: owner.height(), position: 'absolute'});	
			loadTweetsToElement();		
			elementMask.append(element);
			owner.append(elementMask);
		}); 
    };
})(jQuery);
