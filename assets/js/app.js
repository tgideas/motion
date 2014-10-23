var App = (function() {
	
	var 
        $el = $( '#ac-wrapper' ),
		// device element
		$device = $el.find( '.ac-device' ),
		// the device image wrapper
		$trigger = $device.children( '.ac-trigger' ),
		// the screens
		$screens = $el.find( '.ac-grid > a' ),
		// the device screen image
		$screenImg = $device.find( 'img' ).css( 'transition', 'all 0.5s ease' ),
		// the device screen title
		$screenTitle = $device.find( '.ac-title' ),
		// navigation arrows
		$nav = $device.find( 'nav' ),
		$navPrev = $nav.find( '.nav-first' ),
		$navNext = $nav.find( '.nav-last' ),
		// current screen´s element index
		current = 0,
		// if navigating is in process
		animating = false,
		// total number of screens
		screensCount = $screens.length,
		// csstransitions support
		support = Modernizr.csstransitions,
		// transition end event name
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// HTML Body element
		$body = $( 'body' ),
        $win = $(window),
        resizeTimer = {}; 

	function init() {
		// show grid
		$trigger.on( 'click', showGrid );
		// when a grid´s screen is clicked, show the respective image on the device
		$screens.on( 'click', function() {
			showScreen( $( this ) );
			return false;
		} );
        $win.on("resize",function(){
            clearRequestTimeout(resizeTimer);
            resizeTimer = requestTimeout(function(){
                adjustDevicePos();
            },200);
        }).triggerHandler('resize');
		// navigate
		$navPrev.on( 'click', function() {
			navigate( 'prev' );
			return false;
		} );
		$navNext.on( 'click', function() {
			navigate( 'next' );
			return false;
		} );
	}

    function adjustDevicePos(){
        var winH = $win.height(),
            ctH = $el.height(),
            diff = 20;

        if( (winH - ctH) >= diff ){
            $el.addClass('v-center');
        }else{
            $el.removeClass('v-center');
        };
    }

	function showGrid() {
		$body.addClass( 'ac-gridview' );
		// clicking somewhere else on the page closes the grid view
		$body.off( 'click' ).on( 'click', function() { showScreen(); } );
		return false;
	}

	function showScreen( $screen ) {
		$body.removeClass( 'ac-gridview' );
		if( $screen ) {
			// update current
			current = $screen.index();
			// update image and title on the device
			$screenImg.attr( 'src', $screen.find( 'img' ).attr( 'src' ) );
			$screenTitle.text( $screen.find( 'span' ).text() );
		}
	}

	function navigate( direction ) {

		if( animating ) {
			return false;
		}

		animating = true;
		
		if( direction === 'next' ) {
			current = current < screensCount - 1 ? ++current : 0;
		}
		else if( direction === 'prev' ) {
			current = current > 0 ? --current : screensCount - 1;
		}
		
		// next screen to show
		var $nextScreen = $screens.eq( current );

		if( support ) {

			// append new image to the device
			var $nextScreenImg = $( '<img src="' + $nextScreen.find( 'img' ).attr( 'src' ) + '"></img>' ).css( {
				transition : 'all 0.5s ease',
				opacity : 0,
				transform : direction === 'next' ? 'scale(0.9)' : 'translateY(100px)'
			} ).insertBefore( $screenImg );

			// update title
			$screenTitle.text( $nextScreen.find( 'span' ).text() );

			requestTimeout( function() {

				// current image fades out / new image fades in
				$screenImg.css( {
					opacity : 0,
					transform : direction === 'next' ? 'translateY(100px)' : 'scale(0.9)' 
				} ).on( transEndEventName, function() { $( this ).remove(); } );

				$nextScreenImg.css( {
					opacity : 1,
					transform : direction === 'next' ? 'scale(1)' : 'translateY(0px)' 
				} ).on( transEndEventName, function() {
					$screenImg = $( this ).off( transEndEventName );
					animating = false;
				} );

			}, 25 );

		}
		else {
			// update image and title on the device
			$screenImg.attr( 'src', $nextScreen.find( 'img' ).attr( 'src' ) );
			$screenTitle.text( $nextScreen.find( 'span' ).text() );
			animating = false;
		}

	}

	return { init : init };

})(Zepto);

(function($){
    $(function(){
        App.init();    
    });    
})(Zepto);
