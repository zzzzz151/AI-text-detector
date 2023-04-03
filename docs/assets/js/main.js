/* ===================================================================
 * Transcend - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    
    var cfg = {
        scrollDuration : 700, // smoothscroll duration
    },

    $WIN = $(window);

   /* Preloader
    * -------------------------------------------------- */
    var clPreloader = function() {
        
        $("html").addClass('cl-preload');

        $WIN.on('load', function() {

            //force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('cl-preload');
            $("html").addClass('cl-loaded');
        
        });
    };


   /* Menu on Scrolldown
    * ------------------------------------------------------ */
    var clMenuOnScrolldown = function() {
        
        var menuTrigger = $('.header-menu-toggle');

        $WIN.on('scroll', function() {

            if ($WIN.scrollTop() > 150) {
                menuTrigger.addClass('opaque');
            }
            else {
                menuTrigger.removeClass('opaque');
            }

        });
    };


   /* OffCanvas Menu
    * ------------------------------------------------------ */
    var clOffCanvas = function() {

        var menuTrigger     = $('.header-menu-toggle'),
            nav             = $('.header-nav'),
            closeButton     = nav.find('.header-nav__close'),
            siteBody        = $('body'),
            mainContents    = $('section, footer');

        // open-close menu by clicking on the menu icon
        menuTrigger.on('click', function(e){
            e.preventDefault();
            siteBody.toggleClass('menu-is-open');
        });

        // close menu by clicking the close button
        closeButton.on('click', function(e){
            e.preventDefault();
            menuTrigger.trigger('click');
        });

        // close menu clicking outside the menu itself
        siteBody.on('click', function(e){
            if( !$(e.target).is('.header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span') ) {
                siteBody.removeClass('menu-is-open');
            }
        });

    };

    /* Calendar table logic
     * ------------------------------------------------------ */
    var clTableLogic = function() {
        
        // Set up pagination
        var rowsPerPage = 10;
        var totalRows = $(".calendar-table tbody tr").length;
        var numPages = Math.ceil(totalRows / rowsPerPage);
        var currentPage = 1;
        
        // Set up tablesorter
        $.tablesorter.addParser({
            id: "custom-date",
            is: function(s) {
                return false;
            },
            format: function(s, table, cell, cellIndex) {
                var dateString = $(cell).text();
                var dateParts = dateString.split("-");
                var year = dateParts[2];
                var month = dateParts[1];
                var day = dateParts[0];
                return new Date(year, month - 1, day);
            },
            type: "numeric"
        });
        $(".calendar-table").tablesorter({
            headers: {
                0: {
                    sorter: "custom-date"
                }
            }
        });
    
        // add a callback function to update the display property after sorting
        // this function is called after each sorting event
        // it shows all the rows, and then hides the ones that should be hidden because of pagination
        $(".calendar-table")
        .bind("sortEnd",function(e, table) {
    
            var startRow = (currentPage - 1) * rowsPerPage;
            var endRow = startRow + rowsPerPage;
    
            $(".calendar-table tbody tr").hide();
            $(".calendar-table tbody tr").slice(startRow, endRow).show();
        });
    
        for (var i = 1; i <= numPages; i++) {
            $(".pagination").append('<a href="#" class="page-link">' + i + '</a>');
        }
    
        $(".pagination a:first").addClass("active");
    
        $(".calendar-table tbody tr").hide();
        $(".calendar-table tbody tr").slice(0, rowsPerPage).show();
    
        $(".pagination a").click(function () {
            var clickedPage = $(this).text();
    
            if (clickedPage != currentPage) {
                $(".pagination a").removeClass("active");
                $(this).addClass("active");
    
                var startRow = (clickedPage - 1) * rowsPerPage;
                var endRow = startRow + rowsPerPage;
    
                $(".calendar-table tbody tr").hide();
                $(".calendar-table tbody tr").slice(startRow, endRow).show();
    
                // update the currentPage variable and hide the rows that should be hidden because of pagination
                currentPage = clickedPage;
                $(".calendar-table tbody tr").each(function(index) {
                    if (index < (currentPage-1) * rowsPerPage || index >= currentPage * rowsPerPage) {
                        $(this).hide();
                    }
                });
            }
    
            return false;
        });
    };
    

    /* slick slider
     * ------------------------------------------------------ */
    var clSlickSlider = function() {
        
        $('.testimonials__slider').slick({
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var clSmoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
            
                e.preventDefault();
                e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {

                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('.header-menu-toggle').trigger('click');
                }

                window.location.hash = target;
            });
        });

    };


   /* Placeholder Plugin Settings
    * ------------------------------------------------------ */
    var clPlaceholder = function() {
        $('input, textarea, select').placeholder();  
    };


   /* Alert Boxes
    * ------------------------------------------------------ */
    var clAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };


   /* Animate On Scroll
    * ------------------------------------------------------ */
    var clAOS = function() {
        
        AOS.init( {
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 300,
            once: true,
            disable: 'mobile'
        });

    };

   /* Back to Top
    * ------------------------------------------------------ */
    var clBackToTop = function() {

        const $backTop = $(".back-to-top");
        if ($backTop) {
            let e = function () {
                $WIN.scrollTop() > 750 ? $backTop.addClass("active") : $backTop.removeClass("active")
            };
            $WIN.on("load", e)
            $WIN.on("scroll", e)
            $backTop.on("click", () => {
                $('html, body').animate({scrollTop: 0}, 1000, 'easeInOutExpo');
                return false;
            })
        }
    };


   /* Initialize
    * ------------------------------------------------------ */
    (function clInit() {
        
        clPreloader();
        clMenuOnScrolldown();
        clOffCanvas();
        clTableLogic();
        clSlickSlider();
        clSmoothScroll();
        clPlaceholder();
        clAlertBoxes();
        clAOS();
        clBackToTop();

    })();
        
})(jQuery);