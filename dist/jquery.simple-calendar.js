// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

    // Create the defaults once
    var pluginName = "simpleCalendar",
        defaults = {
            months: ['january','february','march','april','may','june','july','august','september','october','november','december'],
            days: ['sunday','monday','tuesday','wenesday','thursday','friday','saturday'], 
            fixedStartDay: true // Week begin always by monday (between 2 months)
    };

    // The actual plugin constructor
    function Plugin ( element, options ) {        
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var container = $(this.element);
            var todayDate = new Date();
            
            var calendar = $('<div class="calendar"></div>');
            var eventContainer = $('<div class="event-container"></div>');
            
            
            this.buildCalendar(todayDate,calendar);
            
            calendar.append(eventContainer);
            container.append(calendar);
            
            this.bindEvents();
        },
        
        //Build calendar of a month from date
        buildCalendar: function (todayDate, calendar) {
            var header = $('<header>'+
                           '<h2 class="month">'+this.settings.months[todayDate.getMonth()]+'</h2>'+
                           '<a class="btn btn-prev" href="#"><</a>'+
                           '<a class="btn btn-next" href="#">></a>'+
				            '</header>');
            
            var body = $('<table></table>');
            var thead = $('<thead></thead>');
            var tbody = $('<tbody></tbody>');
            
            //Header day in a week ( (1 to 8) % 7 to start the week by monday)
            for(var i=1; i<=this.settings.days.length; i++) {
                thead.append($('<td>'+this.settings.days[i%7].substring(0,3)+'</td>'));
            }
            
            //setting current year and month
            var y = todayDate.getFullYear(), m = todayDate.getMonth();
            
            //first day of the month
            var firstDay = new Date(y, m, 1);
            //If not monday set to previous monday
            while(firstDay.getDay() != 1){
                firstDay.setDate(firstDay.getDate()-1);
            }
            //last day of the month
            var lastDay = new Date(y, m + 1, 0);
            //If not sunday set to next sunday
            while(lastDay.getDay() != 0){
                lastDay.setDate(lastDay.getDate()+1);
            }
            
            //For firstDay to lastDay
            for(var day = firstDay; day <= lastDay; day.setDate(day.getDate())) {
                var tr = $('<tr></tr>');
                //For each row
                for(var i = 0; i<7; i++) {
                    var td = $('<td><a href="#" class="day">'+day.getDate()+'</a></td>');
                    //if today is this day
                    if(day.getDate() == todayDate.getDate()){
                        td.find(".day").addClass("today");
                    }
                    //if day is not in this month
                    if(day.getMonth() != todayDate.getMonth()){
                       td.find(".day").addClass("wrong-month"); 
                    }
                    tr.append(td);
                    day.setDate(day.getDate() + 1);
                }
                tbody.append(tr);
            }
            
            body.append(thead);
            body.append(tbody);
            
            calendar.append(header);
            calendar.append(body);
        },
        //Init events listeners
        bindEvents: function () {
            var plugin = this;
            
            //Click previous month
            $('.btn-prev').click(function(){
                console.log('click prev');
            });
            
            //Click next month
            $('.btn-next').click(function(){
                console.log('click next');
            });
            
            //Click date open event form
            $('.day').click(function(e){
                plugin.fillUp($(plugin.element),e.pageX,e.pageY);
            });
            
            //Click date open event form
            $('.event-container').click(function(e){
                plugin.empty($(plugin.element),e.pageX,e.pageY);
            });
        },
        //Small effect to fillup a container
        fillUp : function (elem,x,y){
            var elemOffset = elem.offset();
            
            var filler = $('<div class="filler" style=""></div>');
            filler.css("left", x-elemOffset.left);
            filler.css("top", y-elemOffset.top);
            
            $('.calendar').append(filler);
            
            filler.animate({
                width: "300%",
                height: "300%"
            }, 500, function() {
                $('.event-container').show();
                filler.hide();
            });
        },
        //Small effect to empty a container
        empty : function (elem,x,y){
            var elemOffset = elem.offset();
            
            var filler = $('.filler');
            filler.css("width", "300%");
            filler.css("height", "300%");
            
            filler.show();
            
            $('.event-container').hide();
            
            filler.animate({
                width: "0%",
                height: "0%"
            }, 500, function() {
                filler.remove();
            });
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
        });
    };

})( jQuery, window, document );
