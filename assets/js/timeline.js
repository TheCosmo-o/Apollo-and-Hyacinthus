/* ----------------------------------
  jQuery Timelinr 0.9.54 - desktop + mobile
---------------------------------- */

jQuery.fn.timelinr = function(options){
    var settings = jQuery.extend({
        orientation: 'horizontal',
        containerDiv: '#timeline',
        datesDiv: '#dates',
        datesSelectedClass: 'selected',
        datesSpeed: 'normal',
        issuesDiv: '#issues',
        issuesSelectedClass: 'selected',
        issuesSpeed: 'fast',
        issuesTransparency: 0.2,
        issuesTransparencySpeed: 500,
        prevButton: '#prev',
        nextButton: '#next',
        arrowKeys: 'false',
        startAt: 1,
        autoPlay: 'false',
        autoPlayDirection: 'forward',
        autoPlayPause: 2000
    }, options);

    $(function(){
        var $dates = $(settings.datesDiv+' li');
        var $issues = $(settings.issuesDiv+' li');
        var howManyDates = $dates.length;
        var howManyIssues = $issues.length;
        var widthContainer = $(settings.containerDiv).width();
        var heightContainer = $(settings.containerDiv).height();
        var widthIssue = $issues.width();
        var heightIssue = $issues.height();
        var widthDate = $dates.width();
        var heightDate = $dates.height();

        // desktopowe ustawienia
        if(settings.orientation == 'horizontal'){    
            $(settings.issuesDiv).width(widthIssue*howManyIssues);
            $(settings.datesDiv).width(widthDate*howManyDates).css('marginLeft',widthContainer/2-widthDate/2);
            var defaultPositionDates = parseInt($(settings.datesDiv).css('marginLeft'));
        } else {
            $(settings.issuesDiv).height(heightIssue*howManyIssues);
            $(settings.datesDiv).height(heightDate*howManyDates).css('marginTop',heightContainer/2-heightDate/2);
            var defaultPositionDates = parseInt($(settings.datesDiv).css('marginTop'));
        }

        // funkcja zmiany slajdu
        function goToSlide(index){
            if(window.innerWidth > 600){ // desktop
                if(settings.orientation == 'horizontal') {
                    $(settings.issuesDiv).animate({'marginLeft':-widthIssue*index},{queue:false, duration:settings.issuesSpeed});
                } else {
                    $(settings.issuesDiv).animate({'marginTop':-heightIssue*index},{queue:false, duration:settings.issuesSpeed});
                }

                $issues.animate({'opacity':settings.issuesTransparency},{queue:false, duration:settings.issuesSpeed})
                    .removeClass(settings.issuesSelectedClass)
                    .eq(index).addClass(settings.issuesSelectedClass).fadeTo(settings.issuesTransparencySpeed,1);

                $dates.find('a').removeClass(settings.datesSelectedClass);
                $dates.eq(index).find('a').addClass(settings.datesSelectedClass);

                if(settings.orientation == 'horizontal') {
                    $(settings.datesDiv).animate({'marginLeft':defaultPositionDates-(widthDate*index)},{queue:false, duration:settings.datesSpeed});
                } else {
                    $(settings.datesDiv).animate({'marginTop':defaultPositionDates-(heightDate*index)},{queue:false, duration:settings.datesSpeed});
                }
            } else { // mobile
                $issues.hide().removeClass(settings.issuesSelectedClass);
                var $slide = $issues.eq(index).show().addClass(settings.issuesSelectedClass);

                // kontener slajdu w mobilce
                $slide.css({
                    display: 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'flex-start',
                    'align-items': 'center',
                    'text-align': 'center',
                    height: 'auto',
                    minHeight: '80vh',
                    boxSizing: 'border-box',
                    padding: '20px',
                    margin: '0 auto'
                });

                // obrazek nad tekstem
                $slide.find('img').css({
                    width: '80%',
                    maxWidth: '300px',
                    height: 'auto',
                    marginBottom: '15px',
                    flexShrink: 0
                });

                // h1
                $slide.find('h1').css({
                    margin: '0 0 10px 0',
                    fontSize: '1.5em'
                });

                // p
                $slide.find('p').css({
                    margin: 0,
                    padding: '0 10px',
                    maxHeight: 'calc(80vh - 350px)',
                    overflowY: 'auto',
                    flexGrow: 1
                });
            }
        }

        // kliknięcie w datę
        $dates.find('a').click(function(event){
            event.preventDefault();
            var currentIndex = $(this).parent().index();
            goToSlide(currentIndex);
        });

        // przycisk NEXT
        $(settings.nextButton).click(function(event){
            event.preventDefault();
            var currentIndex = $issues.filter('.'+settings.issuesSelectedClass).index();
            currentIndex = (currentIndex + 1) % howManyIssues;
            goToSlide(currentIndex);
        });

        // przycisk PREV
        $(settings.prevButton).click(function(event){
            event.preventDefault();
            var currentIndex = $issues.filter('.'+settings.issuesSelectedClass).index();
            currentIndex = (currentIndex - 1 + howManyIssues) % howManyIssues;
            goToSlide(currentIndex);
        });

        // strzałki klawiatury
        if(settings.arrowKeys == 'true'){
            $(document).keydown(function(event){
                if(settings.orientation == 'horizontal'){
                    if(event.keyCode == 39) $(settings.nextButton).click();
                    if(event.keyCode == 37) $(settings.prevButton).click();
                } else {
                    if(event.keyCode == 40) $(settings.nextButton).click();
                    if(event.keyCode == 38) $(settings.prevButton).click();
                }
            });
        }

        // startowa pozycja
        goToSlide(settings.startAt-1);

        // autoplay
        if(settings.autoPlay == 'true'){
            setInterval(function(){
                var currentIndex = $issues.filter('.'+settings.issuesSelectedClass).index();
                if(settings.autoPlayDirection == 'forward'){
                    currentIndex = (currentIndex + 1) % howManyIssues;
                } else {
                    currentIndex = (currentIndex - 1 + howManyIssues) % howManyIssues;
                }
                goToSlide(currentIndex);
            }, settings.autoPlayPause);
        }

        // resize
        $(window).resize(function(){
            var currentIndex = $issues.filter('.'+settings.issuesSelectedClass).index();
            goToSlide(currentIndex);
        });
    });
};
