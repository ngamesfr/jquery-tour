//Comes from http://tympanus.net/codrops/2010/12/21/website-tour/

(function($) {
$(function() {
    // Does nothing if no config provided in current page
    if (typeof jqueryTourConfig == 'undefined') {
        return;
    }

    /*
        TL  top left
        TR  top right
        BL  bottom left
        BR  bottom right
        LT  left top
        LB  left bottom
        RT  right top
        RB  right bottom
        T   top
        R   right
        B   bottom
        L   left
     */
    
    //current step of the tour
    var step        = 0;
    
    //total number of steps
    var total_steps = jqueryTourConfig.steps.length;
    var title = jqueryTourConfig.title;
        
    //show the tour controls
    showControls();
    showOverlay();
    
    $("html").keyup(function(e) {
        if(typeof tourDisabled == "undefined") {
            switch(e.keyCode) {
                case 39:
                    if (step == 0) startTour();
                    else if(step < total_steps) nextStep();
                    else endTour();
                    break;
                case 27:
                    endTour();
                    break;
            }
        }
        
        return true;
    });

    // Event handlers
    $('#activatetour').click(startTour);
    $(document).on('click', '#endtour, #canceltour', endTour);
    $(document).on('click', '#nextstep', nextStep);
    
    function startTour(){
        $('#jquery-tour-controls').remove();
        
        if(total_steps > 1) {
            $('#nextstep').show();
            $('#endtour').hide();
        } else {
            $('#endtour').show();
        }

        nextStep();
    }
    
    function nextStep(){
        step++;
        showTooltip();
        
        if(step == total_steps) {
            $('#nextstep').hide();
            $('#endtour').show();
        } else {
            $('#nextstep').show();
            $('#endtour').hide();
        }
        
        if(step > total_steps){
            //if last step then end tour
            endTour();
            return false;
        }
    }
    
    function endTour(){
        step = 0;
        removeTooltip();
        hideControls();
        hideOverlay();
        
        if (typeof jqueryTourConfig.endCallback == 'function') {
            jqueryTourConfig.endCallback();
        }
    }
    
    function showTooltip() {
        //remove current tooltip
        removeTooltip();
        
        var step_config     = jqueryTourConfig.steps[step-1];
        var $elem           = $(step_config.element);
        var bgcolor         = typeof step_config.bgcolor == "undefined" ? "#222" : step_config.bgolor;
        var color           = typeof step_config.color == "undefined" ? "white" : step_config.bgolor;
        var tip_position    = typeof step_config.position == "undefined" ? "TL" : step_config.position;
        
        var $tooltip = $('<div>', {
            id          : 'jquery-tour-tooltip',
            'class'     : 'jquery-tour-tooltip'
        }).css({
            'display'           : 'none',
            'background-color'  : bgcolor,
            'color'             : color
        });
        
        var tooltipHtml = '<div class="tip-text">'+step_config.text+'</div><span class="jquery-tour-tooltip-arrow"></span>';
        tooltipHtml     += '<div class="jquery-tour-nav"><span class="jquery-tour-button" id="nextstep" style="display:none;">Suivant »</span> ';
        tooltipHtml     += '<span class="jquery-tour-button" id="endtour" style="display:none;">Terminer</span></div>';
        tooltipHtml     += '<span class="jquery-tour-close" id="canceltour">&#215;</span>';
        
        $tooltip.html(tooltipHtml);
        
        //position the tooltip correctly:
        
        //the css properties the tooltip should have
        var properties      = {};
        
        //append the tooltip but hide it
        $('body').prepend($tooltip);
        
        //get some info of the element
        var e_w             = $elem.outerWidth();
        var e_h             = $elem.outerHeight();
        var e_l             = $elem.offset().left - 15;
        var e_t             = $elem.offset().top;
        
        switch(tip_position) {
            case 'TL'   :
                properties = {
                    'left'  : e_l + e_w / 2,
                    'top'   : e_t + e_h + 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_TL');
                break;
            case 'TR'   :
                properties = {
                    'left'  : e_l + e_w / 2 - $tooltip.width(),
                    'top'   : e_t + e_h + 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_TR');
                break;
            case 'BL'   :
                properties = {
                    'left'  : e_l,
                    'top'   : e_t - $tooltip.height() - 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_BL');
                break;
            case 'BR'   :
                properties = {
                    'left'  : e_l + e_w - $tooltip.width(),
                    'top'   : e_t - $tooltip.height() - 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_BR');
                break;
            case 'LT'   :
                properties = {
                    'left'  : e_l + e_w,
                    'top'   : e_t
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_LT');
                break;
            case 'LB'   :
                properties = {
                    'left'  : e_l + e_w,
                    'top'   : e_t + e_h - $tooltip.height()
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_LB');
                break;
            case 'RT'   :
                properties = {
                    'left'  : e_l - $tooltip.width(),
                    'top'   : e_t
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_RT');
                break;
            case 'RB'   :
                properties = {
                    'left'  : e_l - $tooltip.width(),
                    'top'   : e_t + e_h - $tooltip.height()
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_RB');
                break;
            case 'T'    :
                properties = {
                    'left'  : e_l + e_w/2 - $tooltip.width()/2,
                    'top'   : e_t + e_h + 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_T');
                break;
            case 'R'    :
                properties = {
                    'left'  : e_l - $tooltip.width(),
                    'top'   : e_t + e_h/2 - $tooltip.height()/2
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_R');
                break;
            case 'B'    :
                properties = {
                    'left'  : e_l + e_w/2 - $tooltip.width()/2,
                    'top'   : e_t - $tooltip.height() - 5
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_B');
                break;
            case 'L'    :
                properties = {
                    'left'  : e_l + e_w ,
                    'top'   : e_t + e_h/2 - $tooltip.height()/2
                };
                $tooltip.find('span.jquery-tour-tooltip-arrow').addClass('jquery-tour-tooltip-arrow_L');
                break;
        }
        
        if ($elem.css("position") == "fixed") { alert("oops"); }
        
        /*
        if the element is not in the viewport
        we scroll to it before displaying the tooltip
         */
        var w_t = $(window).scrollTop();
        var w_b = $(window).scrollTop() + $(window).height();
        //get the boundaries of the element + tooltip
        var b_t = parseFloat(properties.top,10);
        
        if(e_t < b_t) {
            b_t = e_t;
        }
        
        var b_b = parseFloat(properties.top,10) + $tooltip.height();
        if((e_t + e_h) > b_b)
            b_b = e_t + e_h;
            
        
        if((b_t < w_t || b_t > w_b) || (b_b < w_t || b_b > w_b)) {
            // Not in the viewport, scroll and display
            $('html, body').stop()
            .animate({scrollTop: b_t}, 500, 'easeInOutExpo', function() {
                $tooltip.css(properties).show();
            });
        } else {
            // Display right now
            $tooltip.css(properties).show();
        }
    }
    
    function removeTooltip() {
        $('#jquery-tour-tooltip').remove();
    }
    
    function showControls() {
        /*
        we can restart or stop the tour,
        and also navigate through the steps
         */
        var $tourcontrols  = '<div id="jquery-tour-controls" class="jquery-tour-controls">';
        $tourcontrols += '<h2>' + title + '</h2>';
        $tourcontrols += '<div style="text-align: center;"><span class="jquery-tour-button" id="activatetour">Démarrer le tutoriel</span></div>';
        $tourcontrols += '<span class="jquery-tour-close" id="canceltour">&#215;</span>';
        $tourcontrols += '</div>';
        
        $('body').prepend($tourcontrols);
        $('#jquery-tour-controls').animate({'right':'30px'}, 500);
    }
    
    function hideControls() {
        $('#jquery-tour-controls').remove();
    }
    
    function showOverlay() {
        var $overlay = '<div id="jquery-tour-overlay" class="jquery-tour-overlay"></div>';
        $('body').prepend($overlay);
    }
    
    function hideOverlay() {
        $('#jquery-tour-overlay').remove();
    }
});
})(require('jquery'));
