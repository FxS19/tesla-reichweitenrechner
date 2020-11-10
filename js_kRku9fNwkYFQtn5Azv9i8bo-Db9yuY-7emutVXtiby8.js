/**
 * Created by jdolinsky on 12/1/16.
 * best to include at the bottom of the page
 */
dataLayer=[];

(function(window, document, $, Drupal) {
  "use strict";

  Drupal.behaviors.chassis_explorer = {
    attach: function() {

      var slickOptions = {
        initialSlide: 1,
        speed: 0,
        useCSS: false,
        easing: false,
        fade: true,
        cssEase: false,
        responsive: [{
          breakpoint: 480,
          settings: {
            arrows: true,
            initialSlide: 1,
            speed: 300,
            useCSS: false,
            fade: false
          }
        }],
        onAfterChange: function(e) {
          var $activeNav = $('.nav-link[data-slide="' + e.currentSlide + '"]'),
            toggle = $activeNav.data('toggle'),
            $slideContainer = $('.motor-slide[data-toggle="' + toggle + '"]'),
            $activeSlideVideo = $slideContainer.find('video');

          $activeNav.parent().siblings().removeClass('nav-selected');
          $activeNav.parent().addClass('nav-selected');

          // check if browser supports video playback
          if (Modernizr.video) {

            // stop all videos if playing anything
            $('.section-chassis-explorer').find('video').each(function() {
              if (!this.paused) this.pause();
            });

            // play active video
            if ($activeSlideVideo.length && $activeSlideVideo.get(0).paused) {
              $activeSlideVideo.get(0).play();
            }
          }
        }
      };

      var $carousel = $('.slick-slider-container');

      if (!$carousel.hasClass('slick-initialized')) {
        $carousel.slick(slickOptions);
      }

      $('#engineering').on('click', '.nav-link', function(e) {

        var $this = $(e.target);

        // only target links, and only target those with hashes in the href.
        if ($this.is('[href]') && $this.attr('href').indexOf("#") >= 0) {
          e.preventDefault();
        }

        var thisParent = $this.parent('.nav-item'),
          allSiblings = thisParent.siblings(),
          slideContent = $('.chassis-container').find('.chassis-slide, .slide-content'),
          motorSlides = $('.motor-slide');

        if (thisParent.closest('.motortype-nav').length) {
          for (var i = 0; i < motorSlides.length; i++) {
            if (!$(motorSlides[i]).hasClass('hidden')) {
              $(motorSlides[i]).addClass('hidden');
            }
          }
          $('.chassis-slide').find('[data-toggle="' + $this.data('toggle') + '"]').removeClass('hidden');
          $carousel.slickGoTo($this.data('slide'));
        }

        // only remove and add classes if necessary
        if (!thisParent.hasClass('nav-selected')) {
          allSiblings.removeClass('nav-selected');
          thisParent.addClass('nav-selected');
        }
      });
    }
  }

  Drupal.behaviors.local_scroll = {
    attach: function() {
      if ($('body').hasClass('browser-notcar')) {
        $.localScroll({
          queue: true,
          hash: false
        });
      }
    }
  }

  Drupal.behaviors.toggleBatteryOptions = {
    attach: function() {
      var rwd = false;

      $('.show-rwd').click(
        function(e) {
          e.preventDefault();
          if (!rwd) {
            $('.battery-data--60d').hide().addClass('hidden').removeAttr('style');
            $('.battery-data--60').fadeIn('slow', function() {
              $(this).removeClass('hidden').removeAttr('style');
              rwd = true;
            });
          }
        }
      );
      $('.show-awd').click(
        function(e) {
          e.preventDefault();
          if (rwd) {
            $('.battery-data--60').hide().addClass('hidden').removeAttr('style');
            $('.battery-data--60d').fadeIn('slow', function() {
              $(this).removeClass('hidden').removeAttr('style');
              rwd = false;
            });
          }

        }
      );
    }
  };

  Drupal.behaviors.stickyHeader = {
    attach: function() {

      $(window).scroll(function() {

        if ($(window).scrollTop() > 42) {
          $("#sticky-header").css({
            position: 'fixed',
            top: '0px'
          });
        } else {
          $("#sticky-header").css({
            position: ''
          });
        }
      });
    }
  }

}(this, this.document, this.jQuery, this.Drupal));;

(function(window, document, $, Drupal) {
  "use strict";

  Drupal.behaviors.range_calculator = {
    attach: function(context, settings) {
      var configJson,
        //configJsonPath = "config",
        rangeData = {},
        rangeSettings = {},
        Drupal = {},
        needIeFallback,
        thisLocale,
        drupalLocale = settings.tesla.locale || 'en_US';
      var fwindows = "up";
      var flights = "off";
      Drupal.settings = {};
      Drupal.settings.tesla = {};

      // lets find the locale class so we can properly switch the settings
      thisLocale = document.getElementsByTagName("body")[0].className.match(/i18n-\w*/)[0];

      switch (thisLocale) {
        default: Drupal.settings.tesla.unit = 'metric';
      }
//******************************************************************************************************FELIX
      function getJSONF(name){
          return JSON.parse(name);
      }


      $(document).ready(function() {


        needIeFallback = $('html').hasClass('lt-ie9');
        // get the configuration data based on locale

        var data=getJSONF(config);
        configJson = data[Drupal.settings.tesla.unit];



            // default settings
            rangeSettings.wheelFPS = configJson.wheelFPS;
            rangeSettings.speedIndex = configJson.speedIndex;
            rangeSettings.speed = configJson.speed;
            rangeSettings.tempIndex = configJson.temperatureIndex;
            rangeSettings.temp = configJson.temperature;
            //console.log("Temp:  "+rangeSettings.temp);
            rangeSettings.ac = configJson.ac.replace("ac", "").toLowerCase();
            //console.log("AC:  "+rangeSettings.ac);
            //rangeSettings.ac = "off";
            rangeSettings.wheels = configJson.wheels.replace("Wheels", "");
            rangeSettings.windows = configJson.windows.replace("Windows", "").toLowerCase();
            rangeSettings.season = configJson.season;
            rangeSettings.road = configJson.road;
            //console.log("Road:  "+rangeSettings.road);
            rangeSettings.lights = configJson.lights.replace("Lights", "").toLowerCase();
            //alert(configJson.windows.replace("Windows","").toLowerCase());
            //alert(configJson.lights.replace("Lights","").toLowerCase());
            //console.log("READY");

            initializeRangeData();
      });

      // ***********************
      // grab the range data JSON files and set into local obj
      function initializeRangeData() {
        var region = Drupal.settings.tesla.unit;
        // grab the 4 json file data for imperial unit countries

          // set global data for later use
            rangeData.rangedata_60 = (getJSONF(metric60Miles));
            //console.log(rangeData.rangedata_60);
            rangeData.rangedata_70D = (getJSONF(metric70DMiles));

            rangeData.rangedata_75 = (getJSONF(metric75Miles));

            rangeData.rangedata_75D = (getJSONF(metric75DMiles));

            rangeData.rangedata_85 = (getJSONF(metric85Miles));

            rangeData.rangedata_85D = (getJSONF(metric85DMiles));

            rangeData.rangedata_90D = (getJSONF(metric90DMiles));

            rangeData.rangedata_100D = (getJSONF(metric100DMiles));

            rangeData.rangedata_P100D = (getJSONF(metricP100DMiles));

            rangeData.rangedata_70 = (getJSONF(metric70Miles));

            rangeData.rangedata_90 = (getJSONF(metric90Miles));

            rangeData.rangedata_60D = (getJSONF(metric60DMiles));

            //console.log(rangeData);

          // update the UI

            initDefaultData();
            initButtons();
            updateUI();

      }

      // ***********************
      // Update the UI elements after calculations
      function updateUI() {
        rangeSettings.speedIndex = $(".range-controls--speed .spinner-number").data('oldvalue');
        rangeSettings.tempIndex = $(".range-controls--climate .spinner-number").data('oldvalue');
        rangeSettings.ac = $(".climate-controller .controls-data").data('value');

        rangeSettings.speed = configJson.speedRange[rangeSettings.speedIndex];
        rangeSettings.temp = configJson.outsideTemps[rangeSettings.tempIndex];
        rangeSettings.wheels = $(".range-controls--wheels input:checked").val();
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        document.getElementById("f75").innerHTML = "Stadt: " + getCityForBatteries("75");
        document.getElementById("f75d").innerHTML = "Stadt: " + getCityForBatteries("75D");
        document.getElementById("f90d").innerHTML = "Stadt: " + getCityForBatteries("90D");
        document.getElementById("f100d").innerHTML = "Stadt: " + getCityForBatteries("100D");
        document.getElementById("fp100d").innerHTML = "Stadt: " + getCityForBatteries("P100D");
        document.getElementById("f60").innerHTML = "Stadt: " + getCityForBatteries("60");
        document.getElementById("f85").innerHTML = "Stadt: " + getCityForBatteries("85");
        document.getElementById("f85d").innerHTML = "Stadt: " + getCityForBatteries("85D");
        document.getElementById("f70d").innerHTML = "Stadt: " + getCityForBatteries("70D");
        document.getElementById("f70").innerHTML = "Stadt: " + getCityForBatteries("70");
        document.getElementById("f90").innerHTML = "Stadt: " + getCityForBatteries("90");
        document.getElementById("f60d").innerHTML = "Stadt: " + getCityForBatteries("60D");

        setRangeUiValues('.battery-badge--60', '.battery-range-content', getRangesForBatteries("60"));
        setRangeUiValues('.battery-badge--70d', '.battery-range-content', getRangesForBatteries("70D"));
        setRangeUiValues('.battery-badge--75', '.battery-range-content', getRangesForBatteries("75"));
        setRangeUiValues('.battery-badge--75d', '.battery-range-content', getRangesForBatteries("75D"));
        setRangeUiValues('.battery-badge--85', '.battery-range-content', getRangesForBatteries("85"));
        setRangeUiValues('.battery-badge--85d', '.battery-range-content', getRangesForBatteries("85D"));
        setRangeUiValues('.battery-badge--90d', '.battery-range-content', getRangesForBatteries("90D"));
        setRangeUiValues('.battery-badge--100d', '.battery-range-content', getRangesForBatteries("100D"));
        setRangeUiValues('.battery-badge--p100d', '.battery-range-content', getRangesForBatteries("P100D"));
        setRangeUiValues('.battery-badge--70', '.battery-range-content', getRangesForBatteries("70"));
        setRangeUiValues('.battery-badge--90', '.battery-range-content', getRangesForBatteries("90"));
        setRangeUiValues('.battery-badge--60d', '.battery-range-content', getRangesForBatteries("60D"));


        setRangeUiValues('.battery-badge--60', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--70D', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--75', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--75d', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--85', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--85d', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--90d', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--100d', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--p100d', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--70', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--90', '.battery-range-units', configJson.speedLabel.toUpperCase());
        setRangeUiValues('.battery-badge--60D', '.battery-range-units', configJson.speedLabel.toUpperCase());

        $(".range-controls--speed .spinner-number").text(rangeSettings.speed);

        var speed_measurement = configJson.measurement;

        if (configJson.measurement.hasOwnProperty(drupalLocale)) {
          speed_measurement = configJson.measurement[drupalLocale];
        } else if (Drupal.settings.tesla.unit == "metric") {
          speed_measurement = configJson.measurement['default'];
        } else {
          speed_measurement = configJson.measurement;
        }

        $(".range-controls--speed .spinner-unit").text(speed_measurement);

        $(".range-controls--climate .spinner-number").text(rangeSettings.temp);

        if (rangeSettings.wheels == '19') {
          $(".wheels-front").removeClass("wheels-twentyone").addClass("wheels-nineteen");
          $(".wheels-rear").removeClass("wheels-twentyone").addClass("wheels-nineteen");
        } else {
          $(".wheels-front").removeClass("wheels-nineteen").addClass("wheels-twentyone");
          $(".wheels-rear").removeClass("wheels-nineteen").addClass("wheels-twentyone");
        }

        // speed spinner
        var increaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--increase"),
          decreaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--decrease");

        if (parseInt(rangeSettings.speedIndex) === configJson.speedRange.length - 1) {
          if (needIeFallback) {
            increaseSpeedRangeSpinner.addClass("disabled");
          } else {
            increaseSpeedRangeSpinner.attr("disabled", "disabled");
          }
        } else if (parseInt(rangeSettings.speedIndex) === 0) {
          if (needIeFallback) {
            decreaseSpeedRangeSpinner.addClass("disabled");
          } else {
            decreaseSpeedRangeSpinner.attr("disabled", "disabled");
          }
        } else {
          if (needIeFallback) {
            increaseSpeedRangeSpinner.removeClass("disabled");
            decreaseSpeedRangeSpinner.removeClass("disabled");
          } else {
            increaseSpeedRangeSpinner.removeAttr("disabled");
            decreaseSpeedRangeSpinner.removeAttr("disabled");
          }
        }

        // temperature spinner
        var increaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--increase"),
          decreaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--decrease");

        if (parseInt(rangeSettings.tempIndex) === configJson.outsideTemps.length - 1) {
          if (needIeFallback) {
            decreaseTemperatureRangeSpinner.addClass("disabled");
          } else {
            decreaseTemperatureRangeSpinner.attr("disabled", "disabled");
          }
        } else if (parseInt(rangeSettings.tempIndex) === 0) {
          if (needIeFallback) {
            increaseTemperatureRangeSpinner.addClass("disabled");
          } else {
            increaseTemperatureRangeSpinner.attr("disabled", "disabled");
          }
        } else {
          if (needIeFallback) {
            increaseTemperatureRangeSpinner.removeClass("disabled");
            decreaseTemperatureRangeSpinner.removeClass("disabled");
          } else {
            increaseTemperatureRangeSpinner.removeAttr("disabled");
            decreaseTemperatureRangeSpinner.removeAttr("disabled");
          }
        }

        setClimateLabel($(".climate-controller .controls-data").data('value'));

        $(".climate-controller .controls-text").text(rangeSettings.climateLabel);

        // ***********************
        // Set the values of the range UI as elements are updates
        // @selector  => battery type based on class structure
        // @container => the container that needs to be updated
        // @content   => what should go in the container
        function setRangeUiValues(selector, container, content) {

          return $(selector).closest('.battery-option').find(container).html(content);

        }

        // air conditioning spinner
        if (rangeSettings.tempIndex >= 3) {

          if (rangeSettings.ac === "on") {
            $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-heat');
          } else {
            $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-heat');
          }
        } else {

          if (rangeSettings.ac === "on") {
            $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-ac');
          } else {
            $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-ac');
          }
        }
      }


      // ***********************
      // get the range data from the battery specific JSON
      // @batteryId => battery type [70, 70D, 85, 85D, P85D, etc]
      // @speed => current speed selected by user
      function getRangesForBatteries(batteryId, speed) {

        var tmpRangeData = rangeData["rangedata_" + batteryId];
        var miles;

        _.each(tmpRangeData, function(v, k) {
          if (v.ac == rangeSettings.ac && v.lights == rangeSettings.lights && v.windows == rangeSettings.windows && v.temp == rangeSettings.temp && v.wheelsize == rangeSettings.wheels) {
            _.each(v.hwy, function(vv, kk) {
              if (rangeSettings.speed == vv.mph) {
                miles = vv.miles;

              }
            });
          }
        });

        return Math.round(miles);
      }

      function getCityForBatteries(batteryId) {
        //console.log(rangeSettings.ac+"-"+rangeSettings.temp+"-"+rangeSettings.wheels);
        var tmpRangeData = rangeData["rangedata_" + batteryId];
        var fcity;
        //console.log("test  "+tmpRangeData[0].city); <<--Funktioniert
        var aa=0;
        var bb=null;
        _.each(tmpRangeData, function(v, k) {
          aa++;
          if (v.ac == rangeSettings.ac && v.lights == rangeSettings.lights && v.windows == rangeSettings.windows && v.temp == rangeSettings.temp && v.wheelsize == rangeSettings.wheels) {
            fcity = v.city;
            bb=v;
          }
        });
        //console.log(aa+" <--> "+bb);
        //console.log("fcity 565   "+fcity);
        return Math.round(fcity);
      }


      // ***********************
      // initialize the click handlers for controls
      function initButtons() {
        if ($(".range-controls--speed .spinner-controls--increase").length) {
          $(".range-controls--speed .spinner-controls--increase").unbind("click");
          $(".range-controls--speed .spinner-controls--increase").click(function() {
            setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "up");
          });
        }
        if ($(".range-controls--speed .spinner-controls--decrease").length) {
          $(".range-controls--speed .spinner-controls--decrease").unbind("click");
          $(".range-controls--speed .spinner-controls--decrease").click(function() {
            setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "down");
          });
        }
        if ($(".range-controls--climate .spinner-controls--increase").length) {
          $(".range-controls--climate .spinner-controls--increase").unbind("click");
          $(".range-controls--climate .spinner-controls--increase").click(function() {
            setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "up");
          });
        }
        if ($(".range-controls--climate .spinner-controls--decrease").length) {
          $(".range-controls--climate .spinner-controls--decrease").unbind("click");
          $(".range-controls--climate .spinner-controls--decrease").click(function() {
            setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "down");
          });
        }
        if ($(".climate-controller .controls-data").length) {
          $(".climate-controller .controls-data").unbind("click");
          $(".climate-controller .controls-data").click(function() {
            setAC($(".climate-controller .controls-data").data('value'));
          });
        }

        if ($(".range-controls--wheels input").length) {
          $(".range-controls--wheels input").unbind("click");
          $(".range-controls--wheels input").click(function() {
            setWheels($(this));
          });
        }
        //**************************************************************************************************************************
        if ($(".cfwindows").length) {
          $(".cfwindows").unbind("click");
          $(".cfwindows").click(function() {
            if (fwindows === "up") {
              fwindows = "down";
              document.getElementById("fwindows").innerHTML = "Fenster unten";
            } else {
              fwindows = "up";
              document.getElementById("fwindows").innerHTML = "Fenster oben";
            }
            rangeSettings.windows = fwindows;
            updateUI();
          });
        }
        if ($(".cflights").length) {
          $(".cflights").unbind("click");
          $(".cflights").click(function() {
            if (flights === "off") {
              flights = "on";
              document.getElementById("flights").innerHTML = "Lichter eingeschaltet";
            } else {
              flights = "off";
              document.getElementById("flights").innerHTML = "Lichter ausgeschaltet";
            }
            rangeSettings.lights = flights;
            updateUI();
          });
        }
      }

      // ***********************
      // initialize default values for controls
      function initDefaultData() {
        $(".range-controls--speed .spinner-number").data('oldvalue', configJson.speedIndex);
        $(".range-controls--climate .spinner-number").data('oldvalue', configJson.temperatureIndex);

        $(".climate-controller .controls-data").data('value', rangeSettings.ac);
        //$(".climate-controller .controls-data").data('value', "on");
        $(".range-controls--wheels input").data('value', rangeSettings.wheels);

      }


      // ***********************
      // set the current speed from user selection
      function setSpeedIndex(currentSpeed, direction) {

        // set speed index
        var newSpeedIndex = direction === "up" ? parseInt(currentSpeed) + 1 : parseInt(currentSpeed) - 1;

        if (newSpeedIndex > configJson.speedRange.length - 1) {
          newSpeedIndex = currentSpeed;
        }

        if (newSpeedIndex < 0) {
          newSpeedIndex = 0;
        }

        rangeSettings.speedIndex = newSpeedIndex;
        $(".range-controls--speed .spinner-number").data('oldvalue', newSpeedIndex);

        updateUI();
      }


      // ***********************
      // set the current temperature based on user selection
      function setTemperature(currentTemp, direction) {

        var newTempIndex = direction === "up" ? parseInt(currentTemp) - 1 : parseInt(currentTemp) + 1;

        if (newTempIndex > configJson.outsideTemps.length - 1) {
          newTempIndex = currentTemp;
        }
        if (newTempIndex < 0) {
          newTempIndex = 0;
        }

        rangeSettings.tempIndex = newTempIndex;
        $(".range-controls--climate .spinner-number").data('oldvalue', newTempIndex);

        updateUI();
      }

      function setClimateLabel(climateOnOff) {
        if (climateOnOff === "off") {
          if (rangeSettings.tempIndex >= 3) {
            rangeSettings.climateLabel = Tesla.Smartling._heatOff;
          } else {
            rangeSettings.climateLabel = Tesla.Smartling._acOff;
          }
        } else {
          if (rangeSettings.tempIndex >= 3) {
            rangeSettings.climateLabel = Tesla.Smartling._heatOn;
          } else {
            rangeSettings.climateLabel = Tesla.Smartling._acOn;
          }
        }
      }



      // ***********************
      // set the current data based on AC button selection
      function setAC(climateOnOff) {

        if (climateOnOff === "on") {
          $(".climate-controller .controls-data").prop('checked', false);

          setClimateLabel(climateOnOff);

          rangeSettings.ac = "off";
        } else {
          $(".climate-controller .controls-data").prop('checked', true);
          setClimateLabel(climateOnOff);

          rangeSettings.ac = "on";
        }

        $(".climate-controller .controls-data").data('value', rangeSettings.ac);

        updateUI();
      }


      // ***********************
      // set the current wheels based on user selection
      function setWheels(wheelSize) {

        rangeSettings.wheels = wheelSize.val();
        $('.controls-wheelsize label').removeClass('selected');

        if (wheelSize.val() == '19') {
          $(".wheelsize-nineteen").addClass('selected');
        } else {
          $(".wheelsize-twentyone").addClass('selected');
        }



        updateUI();
      }
    }
  };

}(this, this.document, this.jQuery, this.Drupal));;
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.13
 */
;
(function(k) {
  'use strict';
  k(['jquery'], function($) {
    var j = $.scrollTo = function(a, b, c) {
      return $(window).scrollTo(a, b, c)
    };
    j.defaults = {
      axis: 'xy',
      duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
      limit: !0
    };
    j.window = function(a) {
      return $(window)._scrollable()
    };
    $.fn._scrollable = function() {
      return this.map(function() {
        var a = this,
          isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
        if (!isWin) return a;
        var b = (a.contentWindow || a).document || a.ownerDocument || a;
        return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement
      })
    };
    $.fn.scrollTo = function(f, g, h) {
      if (typeof g == 'object') {
        h = g;
        g = 0
      }
      if (typeof h == 'function') h = {
        onAfter: h
      };
      if (f == 'max') f = 9e9;
      h = $.extend({}, j.defaults, h);
      g = g || h.duration;
      h.queue = h.queue && h.axis.length > 1;
      if (h.queue) g /= 2;
      h.offset = both(h.offset);
      h.over = both(h.over);
      return this._scrollable().each(function() {
        if (f == null) return;
        var d = this,
          $elem = $(d),
          targ = f,
          toff, attr = {},
          win = $elem.is('html,body');
        switch (typeof targ) {
          case 'number':
          case 'string':
            if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
              targ = both(targ);
              break
            }
            targ = win ? $(targ) : $(targ, this);
            if (!targ.length) return;
          case 'object':
            if (targ.is || targ.style) toff = (targ = $(targ)).offset()
        }
        var e = $.isFunction(h.offset) && h.offset(d, targ) || h.offset;
        $.each(h.axis.split(''), function(i, a) {
          var b = a == 'x' ? 'Left' : 'Top',
            pos = b.toLowerCase(),
            key = 'scroll' + b,
            old = d[key],
            max = j.max(d, a);
          if (toff) {
            attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
            if (h.margin) {
              attr[key] -= parseInt(targ.css('margin' + b)) || 0;
              attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0
            }
            attr[key] += e[pos] || 0;
            if (h.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * h.over[pos]
          } else {
            var c = targ[pos];
            attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c
          }
          if (h.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
          if (!i && h.queue) {
            if (old != attr[key]) animate(h.onAfterFirst);
            delete attr[key]
          }
        });
        animate(h.onAfter);

        function animate(a) {
          $elem.animate(attr, g, h.easing, a && function() {
            a.call(this, targ, h)
          })
        }
      }).end()
    };
    j.max = function(a, b) {
      var c = b == 'x' ? 'Width' : 'Height',
        scroll = 'scroll' + c;
      if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()]();
      var d = 'client' + c,
        html = a.ownerDocument.documentElement,
        body = a.ownerDocument.body;
      return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d])
    };

    function both(a) {
      return $.isFunction(a) || typeof a == 'object' ? a : {
        top: a,
        left: a
      }
    }
    return j
  })
}(typeof define === 'function' && define.amd ? define : function(a, b) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = b(require('jquery'))
  } else {
    b(jQuery)
  }
}));;
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.3.5
 */
;
(function(a) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], a)
  } else {
    a(jQuery)
  }
}(function($) {
  var g = location.href.replace(/#.*/, '');
  var h = $.localScroll = function(a) {
    $('body').localScroll(a)
  };
  h.defaults = {
    duration: 1000,
    axis: 'y',
    event: 'click',
    stop: true,
    target: window
  };
  $.fn.localScroll = function(a) {
    a = $.extend({}, h.defaults, a);
    if (a.hash && location.hash) {
      if (a.target) window.scrollTo(0, 0);
      scroll(0, location, a)
    }
    return a.lazy ? this.on(a.event, 'a,area', function(e) {
      if (filter.call(this)) {
        scroll(e, this, a)
      }
    }) : this.find('a,area').filter(filter).bind(a.event, function(e) {
      scroll(e, this, a)
    }).end().end();

    function filter() {
      return !!this.href && !!this.hash && this.href.replace(this.hash, '') == g && (!a.filter || $(this).is(a.filter))
    }
  };
  h.hash = function() {};

  function scroll(e, a, b) {
    var c = a.hash.slice(1),
      elem = document.getElementById(c) || document.getElementsByName(c)[0];
    if (!elem) return;
    if (e) e.preventDefault();
    var d = $(b.target);
    if (b.lock && d.is(':animated') || b.onBefore && b.onBefore(e, elem, d) === false) return;
    if (b.stop) d._scrollable().stop(true);
    if (b.hash) {
      var f = elem.id === c ? 'id' : 'name',
        $a = $('<a> </a>').attr(f, c).css({
          position: 'absolute',
          top: $(window).scrollTop(),
          left: $(window).scrollLeft()
        });
      elem[f] = '';
      $('body').prepend($a);
      location.hash = a.hash;
      $a.remove();
      elem[f] = c
    }
    d.scrollTo(elem, b).trigger('notify.serialScroll', [elem])
  };
  return h
}));;

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.3.14
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

! function(a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
  "use strict";
  var b = window.Slick || {};
  b = function() {
    function c(c, d) {
      var f, g, e = this;
      if (e.defaults = {
          accessibility: !0,
          adaptiveHeight: !1,
          appendArrows: a(c),
          appendDots: a(c),
          arrows: !0,
          asNavFor: null,
          prevArrow: '<button type="button" data-role="none" class="slick-prev">Previous</button>',
          nextArrow: '<button type="button" data-role="none" class="slick-next">Next</button>',
          autoplay: !1,
          autoplaySpeed: 3e3,
          centerMode: !1,
          centerPadding: "50px",
          cssEase: "ease",
          customPaging: function(a, b) {
            return '<button type="button" data-role="none">' + (b + 1) + "</button>"
          },
          dots: !1,
          dotsClass: "slick-dots",
          draggable: !0,
          easing: "linear",
          fade: !1,
          focusOnSelect: !1,
          infinite: !0,
          initialSlide: 0,
          lazyLoad: "ondemand",
          onBeforeChange: null,
          onAfterChange: null,
          onInit: null,
          onReInit: null,
          onSetPosition: null,
          pauseOnHover: !0,
          pauseOnDotsHover: !1,
          respondTo: "window",
          responsive: null,
          rtl: !1,
          slide: "div",
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          swipe: !0,
          swipeToSlide: !1,
          touchMove: !0,
          touchThreshold: 5,
          useCSS: !0,
          variableWidth: !1,
          vertical: !1,
          waitForAnimate: !0
        }, e.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          $list: null,
          touchObject: {},
          transformsEnabled: !1
        }, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.paused = !1, e.positionProp = null, e.respondTo = null, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.windowWidth = 0, e.windowTimer = null, e.options = a.extend({}, e.defaults, d), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, f = e.options.responsive || null, f && f.length > -1) {
        e.respondTo = e.options.respondTo || "window";
        for (g in f) f.hasOwnProperty(g) && (e.breakpoints.push(f[g].breakpoint), e.breakpointSettings[f[g].breakpoint] = f[g].settings);
        e.breakpoints.sort(function(a, b) {
          return b - a
        })
      }
      e.autoPlay = a.proxy(e.autoPlay, e), e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), e.keyHandler = a.proxy(e.keyHandler, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.init(), e.checkResponsive()
    }
    var b = 0;
    return c
  }(), b.prototype.addSlide = function(b, c, d) {
    var e = this;
    if ("boolean" == typeof c) d = c, c = null;
    else if (0 > c || c >= e.slideCount) return !1;
    e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function(b, c) {
      a(c).attr("index", b)
    }), e.$slidesCache = e.$slides, e.reinit()
  }, b.prototype.animateSlide = function(b, c) {
    var d = {},
      e = this;
    if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
      var f = e.$slides.eq(e.currentSlide).outerHeight(!0);
      e.$list.animate({
        height: f
      }, e.options.speed)
    }
    e.options.rtl === !0 && e.options.vertical === !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({
      left: b
    }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({
      top: b
    }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? a({
      animStart: e.currentLeft
    }).animate({
      animStart: b
    }, {
      duration: e.options.speed,
      easing: e.options.easing,
      step: function(a) {
        e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d))
      },
      complete: function() {
        c && c.call()
      }
    }) : (e.applyTransition(), d[e.animType] = e.options.vertical === !1 ? "translate3d(" + b + "px, 0px, 0px)" : "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function() {
      e.disableTransition(), c.call()
    }, e.options.speed))
  }, b.prototype.asNavFor = function(b) {
    var c = this,
      d = null != c.options.asNavFor ? a(c.options.asNavFor).getSlick() : null;
    null != d && d.slideHandler(b, !0)
  }, b.prototype.applyTransition = function(a) {
    var b = this,
      c = {};
    c[b.transitionType] = b.options.fade === !1 ? b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
  }, b.prototype.autoPlay = function() {
    var a = this;
    a.autoPlayTimer && clearInterval(a.autoPlayTimer), a.slideCount > a.options.slidesToShow && a.paused !== !0 && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed))
  }, b.prototype.autoPlayClear = function() {
    var a = this;
    a.autoPlayTimer && clearInterval(a.autoPlayTimer)
  }, b.prototype.autoPlayIterator = function() {
    var a = this;
    a.options.infinite === !1 ? 1 === a.direction ? (a.currentSlide + 1 === a.slideCount - 1 && (a.direction = 0), a.slideHandler(a.currentSlide + a.options.slidesToScroll)) : (0 === a.currentSlide - 1 && (a.direction = 1), a.slideHandler(a.currentSlide - a.options.slidesToScroll)) : a.slideHandler(a.currentSlide + a.options.slidesToScroll)
  }, b.prototype.buildArrows = function() {
    var b = this;
    b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow = a(b.options.prevArrow), b.$nextArrow = a(b.options.nextArrow), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.appendTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled"))
  }, b.prototype.buildDots = function() {
    var c, d, b = this;
    if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
      for (d = '<ul class="' + b.options.dotsClass + '">', c = 0; c <= b.getDotCount(); c += 1) d += "<li>" + b.options.customPaging.call(this, b, c) + "</li>";
      d += "</ul>", b.$dots = a(d).appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active")
    }
  }, b.prototype.buildOut = function() {
    var b = this;
    b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b.slideCount = b.$slides.length, b.$slides.each(function(b, c) {
      a(c).attr("index", b)
    }), b.$slidesCache = b.$slides, b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), b.$list = b.$slideTrack.wrap('<div class="slick-list"/>').parent(), b.$slideTrack.css("opacity", 0), b.options.centerMode === !0 && (b.options.slidesToScroll = 1), a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), b.buildArrows(), b.buildDots(), b.updateDots(), b.options.accessibility === !0 && b.$list.prop("tabIndex", 0), b.setSlideClasses("number" == typeof this.currentSlide ? this.currentSlide : 0), b.options.draggable === !0 && b.$list.addClass("draggable")
  }, b.prototype.checkResponsive = function() {
    var c, d, e, b = this,
      f = b.$slider.width(),
      g = window.innerWidth || a(window).width();
    if ("window" === b.respondTo ? e = g : "slider" === b.respondTo ? e = f : "min" === b.respondTo && (e = Math.min(g, f)), b.originalSettings.responsive && b.originalSettings.responsive.length > -1 && null !== b.originalSettings.responsive) {
      d = null;
      for (c in b.breakpoints) b.breakpoints.hasOwnProperty(c) && e < b.breakpoints[c] && (d = b.breakpoints[c]);
      null !== d ? null !== b.activeBreakpoint ? d !== b.activeBreakpoint && (b.activeBreakpoint = d, b.options = a.extend({}, b.originalSettings, b.breakpointSettings[d]), b.refresh()) : (b.activeBreakpoint = d, b.options = a.extend({}, b.originalSettings, b.breakpointSettings[d]), b.refresh()) : null !== b.activeBreakpoint && (b.activeBreakpoint = null, b.options = b.originalSettings, b.refresh())
    }
  }, b.prototype.changeSlide = function(b, c) {
    var f, g, h, i, j, d = this,
      e = a(b.target);
    switch (e.is("a") && b.preventDefault(), h = 0 !== d.slideCount % d.options.slidesToScroll, f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) {
      case "previous":
        g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
        break;
      case "next":
        g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
        break;
      case "index":
        var k = 0 === b.data.index ? 0 : b.data.index || a(b.target).parent().index() * d.options.slidesToScroll;
        if (i = d.getNavigableIndexes(), j = 0, -1 === i.indexOf(k))
          if (k > i[i.length - 1]) k = i[i.length - 1];
          else
            for (var l in i) {
              if (k < i[l]) {
                k = j;
                break
              }
              j = i[l]
            }
        d.slideHandler(k, !1, c);
      default:
        return
    }
  }, b.prototype.clickHandler = function(a) {
    var b = this;
    b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault())
  }, b.prototype.destroy = function() {
    var b = this;
    b.autoPlayClear(), b.touchObject = {}, a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && "object" != typeof b.options.prevArrow && b.$prevArrow.remove(), b.$nextArrow && "object" != typeof b.options.nextArrow && b.$nextArrow.remove(), b.$slides.parent().hasClass("slick-track") && b.$slides.unwrap().unwrap(), b.$slides.removeClass("slick-slide slick-active slick-center slick-visible").removeAttr("index").css({
      position: "",
      left: "",
      top: "",
      zIndex: "",
      opacity: "",
      width: ""
    }), b.$slider.removeClass("slick-slider"), b.$slider.removeClass("slick-initialized"), b.$list.off(".slick"), a(window).off(".slick-" + b.instanceUid), a(document).off(".slick-" + b.instanceUid)
  }, b.prototype.disableTransition = function(a) {
    var b = this,
      c = {};
    c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
  }, b.prototype.fadeSlide = function(a, b, c) {
    var d = this;
    d.cssTransitions === !1 ? (d.$slides.eq(b).css({
      zIndex: 1e3
    }), d.$slides.eq(b).animate({
      opacity: 1
    }, d.options.speed, d.options.easing, c), d.$slides.eq(a).animate({
      opacity: 0
    }, d.options.speed, d.options.easing)) : (d.applyTransition(b), d.applyTransition(a), d.$slides.eq(b).css({
      opacity: 1,
      zIndex: 1e3
    }), d.$slides.eq(a).css({
      opacity: 0
    }), c && setTimeout(function() {
      d.disableTransition(b), d.disableTransition(a), c.call()
    }, d.options.speed))
  }, b.prototype.filterSlides = function(a) {
    var b = this;
    null !== a && (b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit())
  }, b.prototype.getCurrent = function() {
    var a = this;
    return a.currentSlide
  }, b.prototype.getDotCount = function() {
    var a = this,
      b = 0,
      c = 0,
      d = 0;
    if (a.options.infinite === !0) d = Math.ceil(a.slideCount / a.options.slidesToScroll);
    else
      for (; b < a.slideCount;) ++d, b = c + a.options.slidesToShow, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    return d - 1
  }, b.prototype.getLeft = function(a) {
    var c, d, g, b = this,
      e = 0;
    return b.slideOffset = 0, d = b.$slides.first().outerHeight(), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = -1 * b.slideWidth * b.options.slidesToShow, e = -1 * d * b.options.slidesToShow), 0 !== b.slideCount % b.options.slidesToScroll && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = -1 * (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth, e = -1 * (b.options.slidesToShow - (a - b.slideCount)) * d) : (b.slideOffset = -1 * b.slideCount % b.options.slidesToScroll * b.slideWidth, e = -1 * b.slideCount % b.options.slidesToScroll * d))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? -1 * a * b.slideWidth + b.slideOffset : -1 * a * d + e, b.options.variableWidth === !0 && (g = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = g[0] ? -1 * g[0].offsetLeft : 0, b.options.centerMode === !0 && (g = b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = g[0] ? -1 * g[0].offsetLeft : 0, c += (b.$list.width() - g.outerWidth()) / 2)), c
  }, b.prototype.getNavigableIndexes = function() {
    for (var a = this, b = 0, c = 0, d = []; b < a.slideCount;) d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    return d
  }, b.prototype.getSlideCount = function() {
    var c, b = this;
    if (b.options.swipeToSlide === !0) {
      var d = null;
      return b.$slideTrack.find(".slick-slide").each(function(c, e) {
        return e.offsetLeft + a(e).outerWidth() / 2 > -1 * b.swipeLeft ? (d = e, !1) : void 0
      }), c = Math.abs(a(d).attr("index") - b.currentSlide)
    }
    return b.options.slidesToScroll
  }, b.prototype.init = function() {
    var b = this;
    a(b.$slider).hasClass("slick-initialized") || (a(b.$slider).addClass("slick-initialized"), b.buildOut(), b.setProps(), b.startLoad(), b.loadSlider(), b.initializeEvents(), b.updateArrows(), b.updateDots()), null !== b.options.onInit && b.options.onInit.call(this, b)
  }, b.prototype.initArrowEvents = function() {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.on("click.slick", {
      message: "previous"
    }, a.changeSlide), a.$nextArrow.on("click.slick", {
      message: "next"
    }, a.changeSlide))
  }, b.prototype.initDotEvents = function() {
    var b = this;
    b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", {
      message: "index"
    }, b.changeSlide), b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).on("mouseenter.slick", function() {
      b.paused = !0, b.autoPlayClear()
    }).on("mouseleave.slick", function() {
      b.paused = !1, b.autoPlay()
    })
  }, b.prototype.initializeEvents = function() {
    var b = this;
    b.initArrowEvents(), b.initDotEvents(), b.$list.on("touchstart.slick mousedown.slick", {
      action: "start"
    }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", {
      action: "move"
    }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", {
      action: "end"
    }, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", {
      action: "end"
    }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), b.options.pauseOnHover === !0 && b.options.autoplay === !0 && (b.$list.on("mouseenter.slick", function() {
      b.paused = !0, b.autoPlayClear()
    }), b.$list.on("mouseleave.slick", function() {
      b.paused = !1, b.autoPlay()
    })), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.options.slide, b.$slideTrack).on("click.slick", b.selectHandler), a(window).on("orientationchange.slick.slick-" + b.instanceUid, function() {
      b.checkResponsive(), b.setPosition()
    }), a(window).on("resize.slick.slick-" + b.instanceUid, function() {
      a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function() {
        b.windowWidth = a(window).width(), b.checkResponsive(), b.setPosition()
      }, 50))
    }), a("*[draggable!=true]", b.$slideTrack).on("dragstart", function(a) {
      a.preventDefault()
    }), a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition)
  }, b.prototype.initUI = function() {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show(), a.options.autoplay === !0 && a.autoPlay()
  }, b.prototype.keyHandler = function(a) {
    var b = this;
    37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({
      data: {
        message: "previous"
      }
    }) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({
      data: {
        message: "next"
      }
    })
  }, b.prototype.lazyLoad = function() {
    function g(b) {
      a("img[data-lazy]", b).each(function() {
        var b = a(this),
          c = a(this).attr("data-lazy");
        b.load(function() {
          b.animate({
            opacity: 1
          }, 200)
        }).css({
          opacity: 0
        }).attr("src", c).removeAttr("data-lazy").removeClass("slick-loading")
      })
    }
    var c, d, e, f, b = this;
    b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, f = e + b.options.slidesToShow, b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), g(d))
  }, b.prototype.loadSlider = function() {
    var a = this;
    a.setPosition(), a.$slideTrack.css({
      opacity: 1
    }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad()
  }, b.prototype.postSlide = function(a) {
    var b = this;
    null !== b.options.onAfterChange && b.options.onAfterChange.call(this, b, a), b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay === !0 && b.paused === !1 && b.autoPlay()
  }, b.prototype.progressiveLazyLoad = function() {
    var c, d, b = this;
    c = a("img[data-lazy]", b.$slider).length, c > 0 && (d = a("img[data-lazy]", b.$slider).first(), d.attr("src", d.attr("data-lazy")).removeClass("slick-loading").load(function() {
      d.removeAttr("data-lazy"), b.progressiveLazyLoad()
    }).error(function() {
      d.removeAttr("data-lazy"), b.progressiveLazyLoad()
    }))
  }, b.prototype.refresh = function() {
    var b = this,
      c = b.currentSlide;
    b.destroy(), a.extend(b, b.initials), b.init(), b.changeSlide({
      data: {
        message: "index",
        index: c
      }
    }, !0)
  }, b.prototype.reinit = function() {
    var b = this;
    b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), b.buildDots(), b.updateDots(), b.initDotEvents(), b.options.focusOnSelect === !0 && a(b.options.slide, b.$slideTrack).on("click.slick", b.selectHandler), b.setSlideClasses(0), b.setPosition(), null !== b.options.onReInit && b.options.onReInit.call(this, b)
  }, b.prototype.removeSlide = function(a, b, c) {
    var d = this;
    return "boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, d.reinit(), void 0)
  }, b.prototype.setCSS = function(a) {
    var d, e, b = this,
      c = {};
    b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? a + "px" : "0px", e = "top" == b.positionProp ? a + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c)))
  }, b.prototype.setDimensions = function() {
    var b = this;
    if (b.options.vertical === !1 ? b.options.centerMode === !0 && b.$list.css({
        padding: "0px " + b.options.centerPadding
      }) : (b.$list.height(b.$slides.first().outerHeight(!0) * b.options.slidesToShow), b.options.centerMode === !0 && b.$list.css({
        padding: b.options.centerPadding + " 0px"
      })), b.listWidth = b.$list.width(), b.listHeight = b.$list.height(), b.options.vertical === !1 && b.options.variableWidth === !1) b.slideWidth = Math.ceil(b.listWidth / b.options.slidesToShow), b.$slideTrack.width(Math.ceil(b.slideWidth * b.$slideTrack.children(".slick-slide").length));
    else if (b.options.variableWidth === !0) {
      var c = 0;
      b.slideWidth = Math.ceil(b.listWidth / b.options.slidesToShow), b.$slideTrack.children(".slick-slide").each(function() {
        c += Math.ceil(a(this).outerWidth(!0))
      }), b.$slideTrack.width(Math.ceil(c) + 1)
    } else b.slideWidth = Math.ceil(b.listWidth), b.$slideTrack.height(Math.ceil(b.$slides.first().outerHeight(!0) * b.$slideTrack.children(".slick-slide").length));
    var d = b.$slides.first().outerWidth(!0) - b.$slides.first().width();
    b.options.variableWidth === !1 && b.$slideTrack.children(".slick-slide").width(b.slideWidth - d)
  }, b.prototype.setFade = function() {
    var c, b = this;
    b.$slides.each(function(d, e) {
      c = -1 * b.slideWidth * d, b.options.rtl === !0 ? a(e).css({
        position: "relative",
        right: c,
        top: 0,
        zIndex: 800,
        opacity: 0
      }) : a(e).css({
        position: "relative",
        left: c,
        top: 0,
        zIndex: 800,
        opacity: 0
      })
    }), b.$slides.eq(b.currentSlide).css({
      zIndex: 900,
      opacity: 1
    })
  }, b.prototype.setHeight = function() {
    var a = this;
    if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
      var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
      a.$list.css("height", b)
    }
  }, b.prototype.setPosition = function() {
    var a = this;
    a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), null !== a.options.onSetPosition && a.options.onSetPosition.call(this, a)
  }, b.prototype.setProps = function() {
    var a = this,
      b = document.body.style;
    a.positionProp = a.options.vertical === !0 ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = null !== a.animType && a.animType !== !1
  }, b.prototype.setSlideClasses = function(a) {
    var c, d, e, f, b = this;
    b.$slider.find(".slick-slide").removeClass("slick-active").removeClass("slick-center"), d = b.$slider.find(".slick-slide"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active") : (e = b.options.slidesToShow + a, d.slice(e - c + 1, e + c + 2).addClass("slick-active")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active") : d.length <= b.options.slidesToShow ? d.addClass("slick-active") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active")), "ondemand" === b.options.lazyLoad && b.lazyLoad()
  }, b.prototype.setupInfinite = function() {
    var c, d, e, b = this;
    if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) {
      for (e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1) d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
      for (c = 0; e > c; c += 1) d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
      b.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
        a(this).attr("id", "")
      })
    }
  }, b.prototype.selectHandler = function(b) {
    var c = this,
      d = parseInt(a(b.target).parents(".slick-slide").attr("index"));
    return d || (d = 0), c.slideCount <= c.options.slidesToShow ? (c.$slider.find(".slick-slide").removeClass("slick-active"), c.$slides.eq(d).addClass("slick-active"), c.options.centerMode === !0 && (c.$slider.find(".slick-slide").removeClass("slick-center"), c.$slides.eq(d).addClass("slick-center")), c.asNavFor(d), void 0) : (c.slideHandler(d), void 0)
  }, b.prototype.slideHandler = function(a, b, c) {
    var d, e, f, g, i = null,
      j = this;
    return b = b || !1, j.animating === !0 && j.options.waitForAnimate === !0 || j.options.fade === !0 && j.currentSlide === a || j.slideCount <= j.options.slidesToShow ? void 0 : (b === !1 && j.asNavFor(a), d = a, i = j.getLeft(d), g = j.getLeft(j.currentSlide), j.currentLeft = null === j.swipeLeft ? g : j.swipeLeft, j.options.infinite === !1 && j.options.centerMode === !1 && (0 > a || a > j.getDotCount() * j.options.slidesToScroll) ? (j.options.fade === !1 && (d = j.currentSlide, c !== !0 ? j.animateSlide(g, function() {
      j.postSlide(d)
    }) : j.postSlide(d)), void 0) : j.options.infinite === !1 && j.options.centerMode === !0 && (0 > a || a > j.slideCount - j.options.slidesToScroll) ? (j.options.fade === !1 && (d = j.currentSlide, c !== !0 ? j.animateSlide(g, function() {
      j.postSlide(d)
    }) : j.postSlide(d)), void 0) : (j.options.autoplay === !0 && clearInterval(j.autoPlayTimer), e = 0 > d ? 0 !== j.slideCount % j.options.slidesToScroll ? j.slideCount - j.slideCount % j.options.slidesToScroll : j.slideCount + d : d >= j.slideCount ? 0 !== j.slideCount % j.options.slidesToScroll ? 0 : d - j.slideCount : d, j.animating = !0, null !== j.options.onBeforeChange && a !== j.currentSlide && j.options.onBeforeChange.call(this, j, j.currentSlide, e), f = j.currentSlide, j.currentSlide = e, j.setSlideClasses(j.currentSlide), j.updateDots(), j.updateArrows(), j.options.fade === !0 ? (c !== !0 ? j.fadeSlide(f, e, function() {
      j.postSlide(e)
    }) : j.postSlide(e), void 0) : (c !== !0 ? j.animateSlide(i, function() {
      j.postSlide(e)
    }) : j.postSlide(e), void 0)))
  }, b.prototype.startLoad = function() {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading")
  }, b.prototype.swipeDirection = function() {
    var a, b, c, d, e = this;
    return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : "vertical"
  }, b.prototype.swipeEnd = function() {
    var b = this;
    if (b.dragging = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX) return !1;
    if (b.touchObject.swipeLength >= b.touchObject.minSwipe) switch (b.swipeDirection()) {
      case "left":
        b.slideHandler(b.currentSlide + b.getSlideCount()), b.currentDirection = 0, b.touchObject = {};
        break;
      case "right":
        b.slideHandler(b.currentSlide - b.getSlideCount()), b.currentDirection = 1, b.touchObject = {}
    } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {})
  }, b.prototype.swipeHandler = function(a) {
    var b = this;
    if (!(b.options.swipe === !1 || "ontouchend" in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse"))) switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, a.data.action) {
      case "start":
        b.swipeStart(a);
        break;
      case "move":
        b.swipeMove(a);
        break;
      case "end":
        b.swipeEnd(a)
    }
  }, b.prototype.swipeMove = function(a) {
    var c, d, e, f, b = this;
    return f = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || f && 1 !== f.length ? !1 : (c = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== f ? f[0].pageX : a.clientX, b.touchObject.curY = void 0 !== f ? f[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), d = b.swipeDirection(), "vertical" !== d ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), e = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), b.swipeLeft = b.options.vertical === !1 ? c + b.touchObject.swipeLength * e : c + b.touchObject.swipeLength * (b.$list.height() / b.listWidth) * e, b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : (b.setCSS(b.swipeLeft), void 0)) : void 0)
  }, b.prototype.swipeStart = function(a) {
    var c, b = this;
    return 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, b.dragging = !0, void 0)
  }, b.prototype.unfilterSlides = function() {
    var a = this;
    null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit())
  }, b.prototype.unload = function() {
    var b = this;
    a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && "object" != typeof b.options.prevArrow && b.$prevArrow.remove(), b.$nextArrow && "object" != typeof b.options.nextArrow && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible").css("width", "")
  }, b.prototype.updateArrows = function() {
    var b, a = this;
    b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.options.infinite !== !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.removeClass("slick-disabled"), a.$nextArrow.removeClass("slick-disabled"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled"), a.$nextArrow.removeClass("slick-disabled")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled"), a.$prevArrow.removeClass("slick-disabled")) : a.currentSlide > a.slideCount - a.options.slidesToShow + b && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled"), a.$prevArrow.removeClass("slick-disabled")))
  }, b.prototype.updateDots = function() {
    var a = this;
    null !== a.$dots && (a.$dots.find("li").removeClass("slick-active"), a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active"))
  }, a.fn.slick = function(a) {
    var c = this;
    return c.each(function(c, d) {
      d.slick = new b(d, a)
    })
  }, a.fn.slickAdd = function(a, b, c) {
    var d = this;
    return d.each(function(d, e) {
      e.slick.addSlide(a, b, c)
    })
  }, a.fn.slickCurrentSlide = function() {
    var a = this;
    return a.get(0).slick.getCurrent()
  }, a.fn.slickFilter = function(a) {
    var b = this;
    return b.each(function(b, c) {
      c.slick.filterSlides(a)
    })
  }, a.fn.slickGoTo = function(a, b) {
    var c = this;
    return c.each(function(c, d) {
      d.slick.changeSlide({
        data: {
          message: "index",
          index: parseInt(a)
        }
      }, b)
    })
  }, a.fn.slickNext = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.changeSlide({
        data: {
          message: "next"
        }
      })
    })
  }, a.fn.slickPause = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.autoPlayClear(), b.slick.paused = !0
    })
  }, a.fn.slickPlay = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.paused = !1, b.slick.autoPlay()
    })
  }, a.fn.slickPrev = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.changeSlide({
        data: {
          message: "previous"
        }
      })
    })
  }, a.fn.slickRemove = function(a, b) {
    var c = this;
    return c.each(function(c, d) {
      d.slick.removeSlide(a, b)
    })
  }, a.fn.slickRemoveAll = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.removeSlide(null, null, !0)
    })
  }, a.fn.slickGetOption = function(a) {
    var b = this;
    return b.get(0).slick.options[a]
  }, a.fn.slickSetOption = function(a, b, c) {
    var d = this;
    return d.each(function(d, e) {
      e.slick.options[a] = b, c === !0 && (e.slick.unload(), e.slick.reinit())
    })
  }, a.fn.slickUnfilter = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick.unfilterSlides()
    })
  }, a.fn.unslick = function() {
    var a = this;
    return a.each(function(a, b) {
      b.slick && b.slick.destroy()
    })
  }, a.fn.getSlick = function() {
    var a = null,
      b = this;
    return b.each(function(b, c) {
      a = c.slick
    }), a
  }
});;
! function(global) {
  "use strict";

  function keydown(e) {
    var id, k = e ? e.keyCode : event.keyCode;
    if (!held[k]) {
      held[k] = !0;
      for (id in sequences) sequences[id].keydown(k)
    }
  }

  function keyup(e) {
    var k = e ? e.keyCode : event.keyCode;
    held[k] = !1
  }

  function resetHeldKeys() {
    var k;
    for (k in held) held[k] = !1
  }

  function on(obj, type, fn) {
    obj.addEventListener ? obj.addEventListener(type, fn, !1) : obj.attachEvent && (obj["e" + type + fn] = fn, obj[type + fn] = function() {
      obj["e" + type + fn](window.event)
    }, obj.attachEvent("on" + type, obj[type + fn]))
  }
  var cheet, Sequence, sequences = {},
    keys = {
      backspace: 8,
      tab: 9,
      enter: 13,
      "return": 13,
      shift: 16,
      "⇧": 16,
      control: 17,
      ctrl: 17,
      "⌃": 17,
      alt: 18,
      option: 18,
      "⌥": 18,
      pause: 19,
      capslock: 20,
      esc: 27,
      space: 32,
      pageup: 33,
      pagedown: 34,
      end: 35,
      home: 36,
      left: 37,
      L: 37,
      "←": 37,
      up: 38,
      U: 38,
      "↑": 38,
      right: 39,
      R: 39,
      "→": 39,
      down: 40,
      D: 40,
      "↓": 40,
      insert: 45,
      "delete": 46,
      0: 48,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90,
      "⌘": 91,
      command: 91,
      kp_0: 96,
      kp_1: 97,
      kp_2: 98,
      kp_3: 99,
      kp_4: 100,
      kp_5: 101,
      kp_6: 102,
      kp_7: 103,
      kp_8: 104,
      kp_9: 105,
      kp_multiply: 106,
      kp_plus: 107,
      kp_minus: 109,
      kp_decimal: 110,
      kp_divide: 111,
      f1: 112,
      f2: 113,
      f3: 114,
      f4: 115,
      f5: 116,
      f6: 117,
      f7: 118,
      f8: 119,
      f9: 120,
      f10: 121,
      f11: 122,
      f12: 123,
      equal: 187,
      "=": 187,
      comma: 188,
      ",": 188,
      minus: 189,
      "-": 189,
      period: 190,
      ".": 190
    },
    NOOP = function() {},
    held = {};
  Sequence = function(str, next, fail, done) {
    var i;
    for (this.str = str, this.next = next ? next : NOOP, this.fail = fail ? fail : NOOP, this.done = done ? done : NOOP, this.seq = str.split(" "), this.keys = [], i = 0; i < this.seq.length; ++i) this.keys.push(keys[this.seq[i]]);
    this.idx = 0
  }, Sequence.prototype.keydown = function(keyCode) {
    var i = this.idx;
    return keyCode !== this.keys[i] ? void(i > 0 && (this.reset(), this.fail(this.str), cheet.__fail(this.str))) : (this.next(this.str, this.seq[i], i, this.seq), cheet.__next(this.str, this.seq[i], i, this.seq), void(++this.idx === this.keys.length && (this.done(this.str), cheet.__done(this.str), this.reset())))
  }, Sequence.prototype.reset = function() {
    this.idx = 0
  }, cheet = function(str, handlers) {
    var next, fail, done;
    "function" == typeof handlers ? done = handlers : null !== handlers && void 0 !== handlers && (next = handlers.next, fail = handlers.fail, done = handlers.done), sequences[str] = new Sequence(str, next, fail, done)
  }, cheet.disable = function(str) {
    delete sequences[str]
  }, on(window, "keydown", keydown), on(window, "keyup", keyup), on(window, "blur", resetHeldKeys), on(window, "focus", resetHeldKeys), cheet.__next = NOOP, cheet.next = function(fn) {
    cheet.__next = null === fn ? NOOP : fn
  }, cheet.__fail = NOOP, cheet.fail = function(fn) {
    cheet.__fail = null === fn ? NOOP : fn
  }, cheet.__done = NOOP, cheet.done = function(fn) {
    cheet.__done = null === fn ? NOOP : fn
  }, cheet.reset = function(id) {
    var seq = sequences[id];
    return seq instanceof Sequence ? void seq.reset() : void console.warn("cheet: Unknown sequence: " + id)
  }, global.cheet = cheet, "function" == typeof define && define.amd ? define([], function() {
    return cheet
  }) : "undefined" != typeof module && null !== module && (module.exports = cheet)
}(this);;
/**
 * include this file and it will make specific nav sticky
 * it attaches to elements with class .nav-sticky
 * and uses data attributes of this object:
 * data-sticky-extra="20" || data-sticky-extra-bottom="400"
 * int amount of extra pixels to add to top position before detaching to fixed position
 * data-sticky-top="#top-anchor" can be jquery selectors like:
 * #top-anchor || .top-anchor || [name=top-anchor] || "220px" || "220"
 * position of from where object needs to be detached to fixed position
 * data-sticky-bottom="#bottom-anchor" or data-sticky-disappear="#bottom-anchor"
 *
 * can be jquery selectors like:
 * #bottom-anchor || .bottom-anchor || [name=bottom-anchor] || "240px" || "240"
 *
 * stop following content at this position
 */
(function(window, document, $, Drupal) {
  "use strict";

  Drupal.behaviors.scroll_to_fixed = {
    attach: function() {
      var $win = $(window),
        $stickyObject = $(".nav-sticky"),
        animationEnabled = $stickyObject.hasClass('nav-animate'),
        extraTop = $stickyObject.data('sticky-extra') || 0,
        extraBottom = $stickyObject.data('sticky-extra-bottom') || 0;

      // if you are logged in and the admin bar is present
      if (Drupal.admin !== undefined) {
        extraTop += Drupal.admin.height();
        extraBottom += Drupal.admin.height();
      }

      var getPosition = function($obj, dataAttribute) {
        if ($obj.data(dataAttribute) === undefined) {
          return null;
        }
        if ($obj.data(dataAttribute).toString().indexOf('#') === 0 || $obj.data(dataAttribute).toString().indexOf('.') === 0 || $obj.data(dataAttribute).toString().indexOf('[') === 0) {
          return $($obj.data(dataAttribute)).offset().top;
        } else if ($obj.data(dataAttribute).toString().indexOf('px') !== -1) {
          return $obj.data(dataAttribute).replace('px', '');
        } else {
          return $obj.data(dataAttribute);
        }
      };

      var reachedPageBottom = function() {
        return ($win.height() + $win.scrollTop() == $(document).height());
      };

      var scrollCallback = function() {
        var topPosition = $(window).scrollTop() + 52,
          disappear = false,
          topPlaceholderPosition = getPosition($stickyObject, 'sticky-top'),
          bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-bottom');

        // do nothing if required attribute is missing
        if (!topPlaceholderPosition) {
          return;
        }

        if (bottomPlaceholderPosition === null) {
          bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-disappear');
          if (bottomPlaceholderPosition) {
            disappear = true;
          }
        }

        if (topPosition + extraTop > topPlaceholderPosition) {
          if (bottomPlaceholderPosition !== null &&
            topPosition > (bottomPlaceholderPosition - extraBottom)) {
            if (!disappear) {
              $stickyObject.css({
                position: "fixed",
                top: extraTop - (topPosition - bottomPlaceholderPosition + extraBottom) + "px"
              });
            } else {
              if (animationEnabled && reachedPageBottom()) {
                // disabling animation if we reached page bottom and animation was enabled
                $stickyObject.removeClass('nav-animate');
              } else if (animationEnabled && !reachedPageBottom()) {
                // re-enabling animation if it was enabled before
                $stickyObject.addClass('nav-animate');
              }

              $stickyObject.css({
                position: "fixed",
                top: "-100px"
              });
              $stickyObject.addClass('nav-animate-away');
            }
          } else {
            $stickyObject.css({
              position: "fixed",
              top: extraTop + "px"
            });
            $stickyObject.addClass('is-stuck').removeClass('nav-animate-away');
          }
        } else {
          $stickyObject.css({
            position: "absolute",
            top: ""
          });
          $stickyObject.removeClass('nav-animate-away').removeClass('is-stuck');
        }
      };
      $(window).scroll(scrollCallback);
      $(window).resize(scrollCallback);
      scrollCallback();
    }
  };
}(this, this.document, this.jQuery, this.Drupal));;
// --- set up OBJ Object
var GALLERY = GALLERY || {};

// --- set up keys available
GALLERY.Keys = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ESCAPE: 27,
  SPACE: 32,
  BACKSPACE: 8,
  DELETE: 46,
  END: 35,
  HOME: 36,
  PAGEDOWN: 34,
  PAGEUP: 33,
  RETURN: 13,
  TAB: 9
};

(function($) {
  $.fn.nextWrap = function() {
    var $next = this.next();
    return ($next.length === 0) ? this.siblings().first() : $next;
  };
  $.fn.prevWrap = function() {
    var $prev = this.prev();
    return ($prev.length === 0) ? this.siblings().last() : $prev;
  };

  // toggling the active slide
  function switchActiveSlide(slide, allSlides, slideType) {
    var dotNav = slide.parent().next().find('.gallery-navigation--dots');
    var thumbNav = slide.parent().next().find('.gallery-navigation--thumbs');

    // add `is-selected` class to the appropriate slide
    slide.addClass('is-selected').siblings("[class*='-slide']").removeClass('is-selected');
  }

  // Create dot navigation from slide count
  function createDotNavFromSlideCount(slides, isThumbnail, assetLocation) {
    var dotNavMarkup = '',
      cachebusterString = GALLERY.cachebustingString || '20170705';

    dotNavMarkup += '<ol class="nav-items">';

    // iterate over the slides to generate dot nav markup
    $.each(slides, function(index, value) {
      if (isThumbnail) {
        var thumbnailIndex = index + 1;
      }

      // which item in the array has the selected class?
      if ($(slides[index]).hasClass('is-selected')) {
        dotActiveClass = ' is-selected';
      } else {
        dotActiveClass = '';
      }
      dotNavMarkup += '<li class="nav-item' + dotActiveClass + '">';
      if (isThumbnail) {
        dotNavMarkup += '<img src="/tesla_theme/assets/img/' + assetLocation + '/gallery/thumbnail-' + thumbnailIndex + '.jpg?' + cachebusterString + '" class="nav-thumb">';
      }
      dotNavMarkup += '</li>';
    });

    dotNavMarkup += '</ol>';

    return dotNavMarkup;
  }

  // Autoplay currently only supported by .section gallery with or without Thumbnail navs.
  // Use data-gallery-autoplay="on" in Markup to enable.
  function autoplay(id) {
    var loopedNum = 0;

    var intID = setInterval(play, GALLERY.intervalDelay);

    function play() {
      var selectedSlide = $('#' + id).find('.is-selected');

      if (selectedSlide.next().length === 0) {
        selectedSlide.removeClass('is-selected').siblings().first().addClass('is-selected');
        loopedNum++;
      } else {
        selectedSlide.removeClass('is-selected').next().addClass('is-selected');
      }
      if (loopedNum >= GALLERY.loopMax) {
        clearInterval(intID);
      }
    }

    $('#' + id + ' .gallery-navigation--thumbs').on('click', '.nav-item', function(e) {
      clearInterval(intID);
    });

    $('#' + id + ' .gallery-navigation').on('click', '.arrow', function(e) {
      clearInterval(intID);
    });
  }

  $(document).ready(function() {
    var activeSlide = $('.gallery-container').find('.is-selected'),
      prevSlide = activeSlide.prevWrap(),
      nextSlide = activeSlide.nextWrap();

    $('.gallery-navigation').on('click', '.arrow', function(e) {
      var $this = $(this),
        slideDirection = $(this).data('slide'),
        navigationContainer = $this.closest('.gallery-navigation'),
        dotnav = $this.parent().siblings().find('.dot-nav, .nav-item'),
        slideContainer = navigationContainer.closest('.section-container').find('.slide-container'),
        selectedSlide = slideContainer.find('.is-selected'),
        displaySlide;

      if (slideDirection === 'next') {
        var $next = selectedSlide.next();

        if ($next.length === 0) {
          displaySlide = selectedSlide.siblings().first();
          dotnav.removeClass('is-selected').first().addClass('is-selected');
        } else {
          displaySlide = $next;
          $this.parent().siblings().find('.is-selected').removeClass('is-selected').next().addClass('is-selected');
        }
      } else if (slideDirection === 'prev') {
        var $prev = selectedSlide.prev();

        if ($prev.length === 0) {
          displaySlide = selectedSlide.siblings().last();
          dotnav.removeClass('is-selected').last().addClass('is-selected');
        } else {
          displaySlide = $prev;
          $this.parent().siblings().find('.is-selected').removeClass('is-selected').prev().addClass('is-selected');
        }
      }
      switchActiveSlide(displaySlide, activeSlide.siblings().andSelf());
    });

    $('.gallery-navigation--dots, .gallery-navigation--pill-nav, .gallery-navigation--thumbs').on('click', '.nav-item', function(e) {
      e.preventDefault();

      var $this = $(this),
        mySiblings = $this.siblings().andSelf(),
        slideToSelect = mySiblings.index($this),
        allSlides = $this.closest('.section-container').find('.slide-container').children();

      $this.addClass('is-selected').siblings().removeClass('is-selected');

      switchActiveSlide(allSlides.eq(slideToSelect), allSlides);
    });
  });

  $(window).on('load', function() {
    var parentContainer = $('.section-container'),
      pillNavGallery = $('.section-inside'),
      dotNavGallery = $('.section-testimonials'),
      dotNavCPOGallery = $('.section-compositor-grid'),
      thumbNavGallery = $('.section-gallery'),

      dotNavGallerySlideContainer = dotNavGallery.find('.slide-container'),
      dotNavCPOGallerySlideContainer = dotNavCPOGallery.find('.slide-container'),
      pillNavGallerySlideContainer = pillNavGallery.find('.slide-container'),
      thumbNavGallerySlideContainer = thumbNavGallery.find('.slide-container'),

      dotNavGallerySlides = dotNavGallerySlideContainer.children(),
      dotNavCPOGallerySlides = dotNavCPOGallerySlideContainer.children(),
      dotNavGalleryNavContainer = dotNavGallerySlideContainer.next('.gallery-navigation'),
      dotNavCPOGalleryNavContainer = dotNavCPOGallerySlideContainer.next('.gallery-navigation'),

      pillNavGallerySlides = pillNavGallerySlideContainer.children(),
      pillNavGalleryNavContainer = pillNavGallerySlideContainer.next('.gallery-navigation'),

      thumbNavGallerySlides = thumbNavGallerySlideContainer.children(),
      thumbNavGalleryNavContainer = thumbNavGallerySlideContainer.next('.gallery-navigation'),

      dotNav = dotNavGalleryNavContainer.children('.gallery-navigation--dots'),
      dotNavCPO = dotNavCPOGalleryNavContainer.children('.gallery-navigation--dots'),
      thumbnailNav = thumbNavGalleryNavContainer.children('.gallery-navigation--thumbs');

    $('.section-gallery .gallery-container').each(
      function(index) {
        isAutoplay = $(this).data('gallery-autoplay'); //currently only supported and tested on
        if (isAutoplay === "on") {
          autoplay($(this).parent().attr('id'));
        }
      });

    // if there are no slides, we don't need to show the left/right and we don't need to create the dot nav markup.
    if (pillNavGallerySlides.length > 1) {
      pillNavGalleryNavContainer.addClass('has-slides');
    }
    if (thumbNavGallerySlides.length > 1) {
      thumbNavGalleryNavContainer.addClass('has-slides');

      assetLocation = thumbNavGallery.data('assettype');

      // Let's create the dot nav based on how many slides there are
      if (typeof(assetLocation) != "undefined") {
        thumbnailNav.html(createDotNavFromSlideCount(thumbNavGallerySlides, true, assetLocation));
      }

    }
    if (dotNavGallerySlides.length > 1) {

      // Let's create the dot nav based on how many slides there are
      dotNav.html(createDotNavFromSlideCount(dotNavGallerySlides));

      dotNavGalleryNavContainer.addClass('has-slides');
    }
    if (dotNavCPOGallerySlides.length > 1) {

      // Let's create the dot nav based on how many slides there are
      dotNavCPO.html(createDotNavFromSlideCount(dotNavCPOGallerySlides));

      dotNavCPOGalleryNavContainer.addClass('has-slides');
    }
  });

})(jQuery);;
/*global window */
/*global $ */
/*global debug */
/*global getDockOverlayCookie */
/*global getDockOverlayCookieKeyValue */
/*global setDockOverlayCookieKeyValue */

/**
 * Show popup.
 *
 * @param object dockOverlayCookie Dock overlay cookie object.
 * @return boolean Show dock overlay.
 */
function showPopupForOneWeekWithModelX(dockOverlayCookie) {
  'use strict';

  var dockOverlaySubmitted,
    dockOverlayViewed;

  // Submitted corresponds to viewing campaign page.
  dockOverlaySubmitted = getDockOverlayCookieKeyValue('submitted', dockOverlayCookie);
  // View corresponds to seeing popup.
  dockOverlayViewed = getDockOverlayCookieKeyValue('viewed', dockOverlayCookie);
  // debug.log('Show cookie?: ' + JSON.stringify(dockOverlayCookie));

  return dockOverlaySubmitted === 0 && dockOverlayViewed === 0;
}

/**
 * Initialize popup (experiment).
 */
function initPopupForOneWeekWithModelX() {
  'use strict';

  // Define constants.
  var BREAKPOINT = 640;
  var DELAY = 30000;

  // Define popup.
  var $dockOverlay,
    $dockOverlayMobile,
    dockOverlayCookie;

  $dockOverlay = $('#one-week-w-mx-modal');
  $dockOverlayMobile = $('#one-week-w-mx-overlay');

  dockOverlayCookie = getDockOverlayCookie('lc_one_week_w_mx');

  // Only show popup if exists and doesn't have cookie.
  // debug.log('initPopupForOneWeekWithModelX - cookie:' + JSON.stringify(dockOverlayCookie));

  var hasDockOverlay = $dockOverlay.length > 0;
  var hasDockOverlayMobile = $dockOverlayMobile.length > 0;
  var showPopup = showPopupForOneWeekWithModelX(dockOverlayCookie);
  var isMobile = $(window).width() < BREAKPOINT;

  // Show popup modal on desktop if no cookie set.
  if (hasDockOverlay && showPopup && !isMobile) {
    // debug.log('initPopupForOneWeekWithModelX - is eligible to view popup');
    // Show popup after 30 seconds.
    setTimeout(function() {
      $dockOverlay.modal('show');

      // Bind popup close action
      $dockOverlay.on('hide.bs.modal', function() {
        setDockOverlayCookieKeyValue('closed', null, 'lc_one_week_w_mx');
      });

      setDockOverlayCookieKeyValue('viewed', dockOverlayCookie, 'lc_one_week_w_mx');
      // debug.log('initPopupForOneWeekWithModelX - popup shown');
    }, DELAY);
  }

  // Show popup overlay on mobile if no cookie set.
  if (hasDockOverlayMobile && showPopup && isMobile) {
    // debug.log('initPopupForOneWeekWithModelX - is eligible to view popup');
    // Show popup after 30 seconds.
    setTimeout(function() {
      // Show overlay on mobile and show modal on deskop
      $dockOverlayMobile.removeClass('hidden');

      // Trigger transition after overlay is unhidden
      setTimeout(function() {
        $dockOverlayMobile.addClass('overlay--enter');
      }, 0);

      // Bind popup close action
      $dockOverlayMobile.find('.btn-close').click(function() {
        $dockOverlayMobile.addClass('hidden');
        setDockOverlayCookieKeyValue('closed', null, 'lc_one_week_w_mx');
      });

      setDockOverlayCookieKeyValue('viewed', dockOverlayCookie, 'lc_one_week_w_mx');
      // debug.log('initPopupForOneWeekWithModelX - popup shown');
    }, DELAY);
  }
}

/**
 * Init
 */
// $(document).ready(function () {
//     'use strict';
//
//     // Initialize popup.
//     // Important: This is triggered via Google Optimize.
//     $.cookie('lc_one_week_w_mx', null);
//     initPopupForOneWeekWithModelX();
// });
;
(function($) {

  /**
   * A progressbar object. Initialized with the given id. Must be inserted into
   * the DOM afterwards through progressBar.element.
   *
   * method is the function which will perform the HTTP request to get the
   * progress bar state. Either "GET" or "POST".
   *
   * e.g. pb = new progressBar('myProgressBar');
   *      some_element.appendChild(pb.element);
   */
  Drupal.progressBar = function(id, updateCallback, method, errorCallback) {
    var pb = this;
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;

    // The WAI-ARIA setting aria-live="polite" will announce changes after users
    // have completed their current activity and not interrupt the screen reader.
    this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
    this.element.html('<div class="bar"><div class="filled"></div></div>' +
      '<div class="percentage"></div>' +
      '<div class="message">&nbsp;</div>');
  };

  /**
   * Set the percentage and status message for the progressbar.
   */
  Drupal.progressBar.prototype.setProgress = function(percentage, message) {
    if (percentage >= 0 && percentage <= 100) {
      $('div.filled', this.element).css('width', percentage + '%');
      $('div.percentage', this.element).html(percentage + '%');
    }
    $('div.message', this.element).html(message);
    if (this.updateCallback) {
      this.updateCallback(percentage, message, this);
    }
  };

  /**
   * Start monitoring progress via Ajax.
   */
  Drupal.progressBar.prototype.startMonitoring = function(uri, delay) {
    this.delay = delay;
    this.uri = uri;
    this.sendPing();
  };

  /**
   * Stop monitoring progress via Ajax.
   */
  Drupal.progressBar.prototype.stopMonitoring = function() {
    clearTimeout(this.timer);
    // This allows monitoring to be stopped from within the callback.
    this.uri = null;
  };

  /**
   * Request progress data from server.
   */
  Drupal.progressBar.prototype.sendPing = function() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.uri) {
      var pb = this;
      // When doing a post request, you need non-null data. Otherwise a
      // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
      $.ajax({
        type: this.method,
        url: this.uri,
        data: '',
        dataType: 'json',
        success: function(progress) {
          // Display errors.
          if (progress.status == 0) {
            pb.displayError(progress.data);
            return;
          }
          // Update display.
          pb.setProgress(progress.percentage, progress.message);
          // Schedule next timer.
          pb.timer = setTimeout(function() {
            pb.sendPing();
          }, pb.delay);
        },
        error: function(xmlhttp) {
          pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
        }
      });
    }
  };

  /**
   * Display errors on the page.
   */
  Drupal.progressBar.prototype.displayError = function(string) {
    var error = $('<div class="messages error"></div>').html(string);
    $(this.element).before(error).hide();

    if (this.errorCallback) {
      this.errorCallback(this);
    }
  };

})(jQuery);;
/**
 * In order to prevent form duplication on the same page, in cases where both a
 *   mobile and desktop version of the same form is required, we should only
 *   load the desktop form and move it in the DOM if the window is resize to
 *   mobile.
 */
(function(window, document, $, Drupal) {
  "use strict";
  $(function() {
    // Setup vars.
    var THRESHOLD,
      $altInlineForm,
      $stickyNavForm,
      $mobileForm,
      hasAltInlineForm,
      hasStickyNavForm,
      hasMobileForm,
      isPageHomepage,
      isPageModelS,
      isPageModelX,
      isPageModel3;

    // Page specific logic.
    isPageHomepage = $('#page-homepage').length > 0;
    isPageModelS = $('#page-models').length > 0;
    isPageModelX = $('#page-modelx').length > 0;
    isPageModel3 = $('#page-model3').length > 0;

    // On the homepage, remove the test drive form (used in AB test).
    // @todo Remove the whenever we end the Optimizely AB tests for the
    //   mobile form and remove test drive form from mobile.
    if (isPageHomepage) {
      $('.page-homepage').find('.test-drive-container').html("");
    }

    // Forms.
    $altInlineForm = $('#feature--newsletter-form');
    $stickyNavForm = $('.sticky-nav').find('#tesla-insider-form');
    $mobileForm = $('.insider-container').find('#tesla-insider-form');

    hasAltInlineForm = $altInlineForm.length > 0;
    hasStickyNavForm = $stickyNavForm.length > 0;
    hasMobileForm = $mobileForm.length > 0;

    // Moves the get updates form around the Model S, X and 3 page if
    //   there are multiple copies of the form within the DOM.
    if ((isPageHomepage || isPageModelS || isPageModelX || isPageModel3) && ((hasAltInlineForm || hasStickyNavForm) && hasMobileForm)) {
      // Remove the desktop form on mobile and vice versa.
      THRESHOLD = 640;
      if ($(window).width() > THRESHOLD) {
        if (hasMobileForm) {
          $mobileForm.remove();
        }
      } else {
        if (hasAltInlineForm) {
          $altInlineForm.remove();
        }
        if (hasStickyNavForm) {
          $stickyNavForm.remove();
        }
      }
      // Re-attach js bindings.
      Drupal.behaviors.tesla_insider_form.attach();
    }
  });
}(this, this.document, this.jQuery, this.Drupal));

;
/*!
 * Parsleyjs
 * Guillaume Potier - <guillaume@wisembly.com>
 * Version 2.2.0-rc1 - built Sun Aug 16 2015 14:04:07
 * MIT Licensed
 *
 */
! function(a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function(a) {
  function b(a, b) {
    return a.parsleyAdaptedCallback || (a.parsleyAdaptedCallback = function() {
      var c = Array.prototype.slice.call(arguments, 0);
      c.unshift(this), a.apply(b || x, c)
    }), a.parsleyAdaptedCallback
  }

  function c(a) {
    return 0 === a.lastIndexOf(z, 0) ? a.substr(z.length) : a
  }
  "undefined" == typeof a && "undefined" != typeof window.jQuery && (a = window.jQuery);
  var d = 1,
    e = {},
    f = {
      attr: function(a, b, c) {
        var d, e, f = new RegExp("^" + b, "i");
        if ("undefined" == typeof c) c = {};
        else
          for (var g in c) c.hasOwnProperty(g) && delete c[g];
        if ("undefined" == typeof a || "undefined" == typeof a[0]) return c;
        e = a[0].attributes;
        for (var g = e.length; g--;) d = e[g], d && d.specified && f.test(d.name) && (c[this.camelize(d.name.slice(b.length))] = this.deserializeValue(d.value));
        return c
      },
      checkAttr: function(a, b, c) {
        return a.is("[" + b + c + "]")
      },
      setAttr: function(a, b, c, d) {
        a[0].setAttribute(this.dasherize(b + c), String(d))
      },
      generateID: function() {
        return "" + d++
      },
      deserializeValue: function(b) {
        var c;
        try {
          return b ? "true" == b || ("false" == b ? !1 : "null" == b ? null : isNaN(c = Number(b)) ? /^[\[\{]/.test(b) ? a.parseJSON(b) : b : c) : b
        } catch (d) {
          return b
        }
      },
      camelize: function(a) {
        return a.replace(/-+(.)?/g, function(a, b) {
          return b ? b.toUpperCase() : ""
        })
      },
      dasherize: function(a) {
        return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
      },
      warn: function() {
        window.console && "function" == typeof window.console.warn && window.console.warn.apply(window.console, arguments)
      },
      warnOnce: function(a) {
        e[a] || (e[a] = !0, this.warn.apply(this, arguments))
      },
      _resetWarnings: function() {
        e = {}
      },
      trimString: function(a) {
        return a.replace(/^\s+|\s+$/g, "")
      },
      objectCreate: Object.create || function() {
        var a = function() {};
        return function(b) {
          if (arguments.length > 1) throw Error("Second argument not supported");
          if ("object" != typeof b) throw TypeError("Argument must be an object");
          a.prototype = b;
          var c = new a;
          return a.prototype = null, c
        }
      }()
    },
    g = {
      namespace: "data-parsley-",
      inputs: "input, textarea, select",
      excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden]",
      priorityEnabled: !0,
      multiple: null,
      group: null,
      uiEnabled: !0,
      validationThreshold: 3,
      focus: "first",
      trigger: !1,
      errorClass: "parsley-error",
      successClass: "parsley-success",
      classHandler: function() {},
      errorsContainer: function() {},
      errorsWrapper: '<ul class="parsley-errors-list"></ul>',
      errorTemplate: "<li></li>"
    },
    h = function() {};
  h.prototype = {
    asyncSupport: !0,
    actualizeOptions: function() {
      return f.attr(this.$element, this.options.namespace, this.domOptions), this.parent && this.parent.actualizeOptions && this.parent.actualizeOptions(), this
    },
    _resetOptions: function(a) {
      this.domOptions = f.objectCreate(this.parent.options), this.options = f.objectCreate(this.domOptions);
      for (var b in a) a.hasOwnProperty(b) && (this.options[b] = a[b]);
      this.actualizeOptions()
    },
    _listeners: null,
    on: function(a, b) {
      this._listeners = this._listeners || {};
      var c = this._listeners[a] = this._listeners[a] || [];
      return c.push(b), this
    },
    subscribe: function(b, c) {
      a.listenTo(this, b.toLowerCase(), c)
    },
    off: function(a, b) {
      var c = this._listeners && this._listeners[a];
      if (c)
        if (b)
          for (var d = c.length; d--;) c[d] === b && c.splice(d, 1);
        else delete this._listeners[a];
      return this
    },
    unsubscribe: function(b) {
      a.unsubscribeTo(this, b.toLowerCase())
    },
    trigger: function(a, b) {
      b = b || this;
      var c, d = this._listeners && this._listeners[a];
      if (d)
        for (var e = d.length; e--;)
          if (c = d[e].call(b, b), c === !1) return c;
      return this.parent ? this.parent.trigger(a, b) : !0
    },
    reset: function() {
      if ("ParsleyForm" !== this.__class__) return this._trigger("reset");
      for (var a = 0; a < this.fields.length; a++) this.fields[a]._trigger("reset");
      this._trigger("reset")
    },
    destroy: function() {
      if ("ParsleyForm" !== this.__class__) return this.$element.removeData("Parsley"), this.$element.removeData("ParsleyFieldMultiple"), void this._trigger("destroy");
      for (var a = 0; a < this.fields.length; a++) this.fields[a].destroy();
      this.$element.removeData("Parsley"), this._trigger("destroy")
    },
    asyncIsValid: function() {
      return f.warnOnce("asyncIsValid is deprecated; please use whenIsValid instead"), this.whenValid.apply(this, arguments)
    },
    _findRelatedMultiple: function() {
      return this.parent.$element.find("[" + this.options.namespace + 'multiple="' + this.options.multiple + '"]')
    }
  };
  var i = {
      string: function(a) {
        return a
      },
      integer: function(a) {
        if (isNaN(a)) throw 'Requirement is not an integer: "' + a + '"';
        return parseInt(a, 10)
      },
      number: function(a) {
        if (isNaN(a)) throw 'Requirement is not a number: "' + a + '"';
        return parseFloat(a)
      },
      reference: function(b) {
        var c = a(b);
        if (0 === c.length) throw 'No such reference: "' + b + '"';
        return c
      },
      "boolean": function(a) {
        return "false" !== a
      },
      object: function(a) {
        return f.deserializeValue(a)
      },
      regexp: function(a) {
        var b = "";
        return /^\/.*\/(?:[gimy]*)$/.test(a) && (b = a.replace(/.*\/([gimy]*)$/, "$1"), a = a.replace(new RegExp("^/(.*?)/" + b + "$"), "$1")), new RegExp(a, b)
      }
    },
    j = function(a, b) {
      var c = a.match(/^\s*\[(.*)\]\s*$/);
      if (!c) throw 'Requirement is not an array: "' + a + '"';
      var d = c[1].split(",").map(f.trimString);
      if (d.length !== b) throw "Requirement has " + d.length + " values when " + b + " are needed";
      return d
    },
    k = function(a, b) {
      var c = i[a || "string"];
      if (!c) throw 'Unknown requirement specification: "' + a + '"';
      return c(b)
    },
    l = function(a, b, c) {
      var d = null,
        e = {};
      for (var f in a)
        if (f) {
          var g = c(f);
          "string" == typeof g && (g = k(a[f], g)), e[f] = g
        } else d = k(a[f], b);
      return [d, e]
    },
    m = function(b) {
      a.extend(!0, this, b)
    };
  m.prototype = {
    validate: function(b, c) {
      if (this.fn) return arguments.length > 3 && (c = [].slice.call(arguments, 1, -1)), this.fn.call(this, b, c);
      if (a.isArray(b)) {
        if (!this.validateMultiple) throw "Validator `" + this.name + "` does not handle multiple values";
        return this.validateMultiple.apply(this, arguments)
      }
      if (this.validateNumber) return isNaN(b) ? !1 : (b = parseFloat(b), this.validateNumber.apply(this, arguments));
      if (this.validateString) return this.validateString.apply(this, arguments);
      throw "Validator `" + this.name + "` only handles multiple values"
    },
    parseRequirements: function(b, c) {
      if ("string" != typeof b) return a.isArray(b) ? b : [b];
      var d = this.requirementType;
      if (a.isArray(d)) {
        for (var e = j(b, d.length), f = 0; f < e.length; f++) e[f] = k(d[f], e[f]);
        return e
      }
      return a.isPlainObject(d) ? l(d, b, c) : [k(d, b)]
    },
    requirementType: "string",
    priority: 2
  };
  var n = function(a, b) {
      this.__class__ = "ParsleyValidatorRegistry", this.locale = "en", this.init(a || {}, b || {})
    },
    o = {
      email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
      number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
      integer: /^-?\d+$/,
      digits: /^\d+$/,
      alphanum: /^\w+$/i,
      url: new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$", "i")
    };
  o.range = o.number, n.prototype = {
    init: function(b, c) {
      this.catalog = c, this.validators = a.extend({}, this.validators);
      for (var d in b) this.addValidator(d, b[d].fn, b[d].priority);
      window.Parsley.trigger("parsley:validator:init")
    },
    setLocale: function(a) {
      if ("undefined" == typeof this.catalog[a]) throw new Error(a + " is not available in the catalog");
      return this.locale = a, this
    },
    addCatalog: function(a, b, c) {
      return "object" == typeof b && (this.catalog[a] = b), !0 === c ? this.setLocale(a) : this
    },
    addMessage: function(a, b, c) {
      return "undefined" == typeof this.catalog[a] && (this.catalog[a] = {}), this.catalog[a][b.toLowerCase()] = c, this
    },
    addValidator: function(a) {
      if (this.validators[a]) f.warn('Validator "' + a + '" is already defined.');
      else if (g.hasOwnProperty(a)) return void f.warn('"' + a + '" is a restricted keyword and is not a valid validator name.');
      return this._setValidator.apply(this, arguments)
    },
    updateValidator: function(a) {
      return this.validators[a] ? this._setValidator(this, arguments) : (f.warn('Validator "' + a + '" is not already defined.'), this.addValidator.apply(this, arguments))
    },
    removeValidator: function(a) {
      return this.validators[a] || f.warn('Validator "' + a + '" is not defined.'), delete this.validators[a], this
    },
    _setValidator: function(a, b, c) {
      "object" != typeof b && (b = {
        fn: b,
        priority: c
      }), b.validate || (b = new m(b)), this.validators[a] = b;
      for (var d in b.messages || {}) this.addMessage(d, a, b.messages[d]);
      return this
    },
    getErrorMessage: function(a) {
      var b;
      if ("type" === a.name) {
        var c = this.catalog[this.locale][a.name] || {};
        b = c[a.requirements]
      } else b = this.formatMessage(this.catalog[this.locale][a.name], a.requirements);
      return b || this.catalog[this.locale].defaultMessage || this.catalog.en.defaultMessage
    },
    formatMessage: function(a, b) {
      if ("object" == typeof b) {
        for (var c in b) a = this.formatMessage(a, b[c]);
        return a
      }
      return "string" == typeof a ? a.replace(new RegExp("%s", "i"), b) : ""
    },
    validators: {
      notblank: {
        validateString: function(a) {
          return /\S/.test(a)
        },
        priority: 2
      },
      required: {
        validateMultiple: function(a) {
          return a.length > 0
        },
        validateString: function(a) {
          return /\S/.test(a)
        },
        priority: 512
      },
      type: {
        validateString: function(a, b) {
          var c = o[b];
          if (!c) throw new Error("validator type `" + b + "` is not supported");
          return c.test(a)
        },
        priority: 256
      },
      pattern: {
        validateString: function(a, b) {
          return b.test(a)
        },
        requirementType: "regexp",
        priority: 64
      },
      minlength: {
        validateString: function(a, b) {
          return a.length >= b
        },
        requirementType: "integer",
        priority: 30
      },
      maxlength: {
        validateString: function(a, b) {
          return a.length <= b
        },
        requirementType: "integer",
        priority: 30
      },
      length: {
        validateString: function(a, b, c) {
          return a.length >= b && a.length <= c
        },
        requirementType: ["integer", "integer"],
        priority: 30
      },
      mincheck: {
        validateMultiple: function(a, b) {
          return a.length >= b
        },
        requirementType: "integer",
        priority: 30
      },
      maxcheck: {
        validateMultiple: function(a, b) {
          return a.length <= b
        },
        requirementType: "integer",
        priority: 30
      },
      check: {
        validateMultiple: function(a, b, c) {
          return a.length >= b && a.length <= c
        },
        requirementType: ["integer", "integer"],
        priority: 30
      },
      min: {
        validateNumber: function(a, b) {
          return a >= b
        },
        requirementType: "number",
        priority: 30
      },
      max: {
        validateNumber: function(a, b) {
          return b >= a
        },
        requirementType: "number",
        priority: 30
      },
      range: {
        validateNumber: function(a, b, c) {
          return a >= b && c >= a
        },
        requirementType: ["number", "number"],
        priority: 30
      },
      equalto: {
        validateString: function(b, c) {
          var d = a(c);
          return d.length ? b === d.val() : b === c
        },
        priority: 256
      }
    }
  };
  var p = function() {
    this.__class__ = "ParsleyUI"
  };
  p.prototype = {
    listen: function() {
      var a = this;
      return window.Parsley.on("form:init", function() {
        a.setupForm(this)
      }).on("field:init", function() {
        a.setupField(this)
      }).on("field:validated", function() {
        a.reflow(this)
      }).on("form:validated", function() {
        a.focus(this)
      }).on("field:reset", function() {
        a.reset(this)
      }).on("form:destroy", function() {
        a.destroy(this)
      }).on("field:destroy", function() {
        a.destroy(this)
      }), this
    },
    reflow: function(a) {
      if ("undefined" != typeof a._ui && !1 !== a._ui.active) {
        var b = this._diff(a.validationResult, a._ui.lastValidationResult);
        a._ui.lastValidationResult = a.validationResult, a._ui.validatedOnce = !0, this.manageStatusClass(a), this.manageErrorsMessages(a, b), this.actualizeTriggers(a), (b.kept.length || b.added.length) && !0 !== a._ui.failedOnce && this.manageFailingFieldTrigger(a)
      }
    },
    getErrorsMessages: function(a) {
      if (!0 === a.validationResult) return [];
      for (var b = [], c = 0; c < a.validationResult.length; c++) b.push(this._getErrorMessage(a, a.validationResult[c].assert));
      return b
    },
    manageStatusClass: function(a) {
      a.hasConstraints() && a.needsValidation() && !0 === a.validationResult ? this._successClass(a) : a.validationResult.length > 0 ? this._errorClass(a) : this._resetClass(a)
    },
    manageErrorsMessages: function(b, c) {
      if ("undefined" == typeof b.options.errorsMessagesDisabled) {
        if ("undefined" != typeof b.options.errorMessage) return c.added.length || c.kept.length ? (this._insertErrorWrapper(b), 0 === b._ui.$errorsWrapper.find(".parsley-custom-error-message").length && b._ui.$errorsWrapper.append(a(b.options.errorTemplate).addClass("parsley-custom-error-message")), b._ui.$errorsWrapper.addClass("filled").find(".parsley-custom-error-message").html(b.options.errorMessage)) : b._ui.$errorsWrapper.removeClass("filled").find(".parsley-custom-error-message").remove();
        for (var d = 0; d < c.removed.length; d++) this.removeError(b, c.removed[d].assert.name, !0);
        for (d = 0; d < c.added.length; d++) this.addError(b, c.added[d].assert.name, void 0, c.added[d].assert, !0);
        for (d = 0; d < c.kept.length; d++) this.updateError(b, c.kept[d].assert.name, void 0, c.kept[d].assert, !0)
      }
    },
    addError: function(b, c, d, e, f) {
      this._insertErrorWrapper(b), b._ui.$errorsWrapper.addClass("filled").append(a(b.options.errorTemplate).addClass("parsley-" + c).html(d || this._getErrorMessage(b, e))), !0 !== f && this._errorClass(b)
    },
    updateError: function(a, b, c, d, e) {
      a._ui.$errorsWrapper.addClass("filled").find(".parsley-" + b).html(c || this._getErrorMessage(a, d)), !0 !== e && this._errorClass(a)
    },
    removeError: function(a, b, c) {
      a._ui.$errorsWrapper.removeClass("filled").find(".parsley-" + b).remove(), !0 !== c && this.manageStatusClass(a)
    },
    focus: function(a) {
      if (a._focusedField = null, !0 === a.validationResult || "none" === a.options.focus) return null;
      for (var b = 0; b < a.fields.length; b++) {
        var c = a.fields[b];
        if (!0 !== c.validationResult && c.validationResult.length > 0 && "undefined" == typeof c.options.noFocus && (a._focusedField = c.$element, "first" === a.options.focus)) break
      }
      return null === a._focusedField ? null : a._focusedField.focus()
    },
    _getErrorMessage: function(a, b) {
      var c = b.name + "Message";
      return "undefined" != typeof a.options[c] ? window.Parsley.formatMessage(a.options[c], b.requirements) : window.Parsley.getErrorMessage(b)
    },
    _diff: function(a, b, c) {
      for (var d = [], e = [], f = 0; f < a.length; f++) {
        for (var g = !1, h = 0; h < b.length; h++)
          if (a[f].assert.name === b[h].assert.name) {
            g = !0;
            break
          }
        g ? e.push(a[f]) : d.push(a[f])
      }
      return {
        kept: e,
        added: d,
        removed: c ? [] : this._diff(b, a, !0).added
      }
    },
    setupForm: function(b) {
      b.$element.on("submit.Parsley", !1, a.proxy(b.onSubmitValidate, b)), !1 !== b.options.uiEnabled && b.$element.attr("novalidate", "")
    },
    setupField: function(b) {
      var c = {
        active: !1
      };
      !1 !== b.options.uiEnabled && (c.active = !0, b.$element.attr(b.options.namespace + "id", b.__id__), c.$errorClassHandler = this._manageClassHandler(b), c.errorsWrapperId = "parsley-id-" + (b.options.multiple ? "multiple-" + b.options.multiple : b.__id__), c.$errorsWrapper = a(b.options.errorsWrapper).attr("id", c.errorsWrapperId), c.lastValidationResult = [], c.validatedOnce = !1, c.validationInformationVisible = !1, b._ui = c, this.actualizeTriggers(b))
    },
    _manageClassHandler: function(b) {
      if ("string" == typeof b.options.classHandler && a(b.options.classHandler).length) return a(b.options.classHandler);
      var c = b.options.classHandler(b);
      return "undefined" != typeof c && c.length ? c : !b.options.multiple || b.$element.is("select") ? b.$element : b.$element.parent()
    },
    _insertErrorWrapper: function(b) {
      var c;
      if (0 !== b._ui.$errorsWrapper.parent().length) return b._ui.$errorsWrapper.parent();
      if ("string" == typeof b.options.errorsContainer) {
        if (a(b.options.errorsContainer).length) return a(b.options.errorsContainer).append(b._ui.$errorsWrapper);
        f.warn("The errors container `" + b.options.errorsContainer + "` does not exist in DOM")
      } else "function" == typeof b.options.errorsContainer && (c = b.options.errorsContainer(b));
      if ("undefined" != typeof c && c.length) return c.append(b._ui.$errorsWrapper);
      var d = b.$element;
      return b.options.multiple && (d = d.parent()), d.after(b._ui.$errorsWrapper)
    },
    actualizeTriggers: function(b) {
      var c = b.$element;
      if (b.options.multiple && (c = a("[" + b.options.namespace + 'multiple="' + b.options.multiple + '"]')), c.off(".Parsley"), !1 !== b.options.trigger) {
        var d = b.options.trigger.replace(/^\s+/g, "").replace(/\s+$/g, "");
        "" !== d && c.on(d.split(" ").join(".Parsley ") + ".Parsley", a.proxy("function" == typeof b.eventValidate ? b.eventValidate : this.eventValidate, b))
      }
    },
    eventValidate: function(a) {
      new RegExp("key").test(a.type) && !this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold || (this._ui.validatedOnce = !0, this.validate())
    },
    manageFailingFieldTrigger: function(b) {
      return b._ui.failedOnce = !0, b.options.multiple && a("[" + b.options.namespace + 'multiple="' + b.options.multiple + '"]').each(function() {
        return new RegExp("change", "i").test(a(this).parsley().options.trigger || "") ? void 0 : a(this).on("change.ParsleyFailedOnce", !1, a.proxy(b.validate, b))
      }), b.$element.is("select") && !new RegExp("change", "i").test(b.options.trigger || "") ? b.$element.on("change.ParsleyFailedOnce", !1, a.proxy(b.validate, b)) : new RegExp("keyup", "i").test(b.options.trigger || "") ? void 0 : b.$element.on("keyup.ParsleyFailedOnce", !1, a.proxy(b.validate, b))
    },
    reset: function(a) {
      this.actualizeTriggers(a), a.$element.off(".ParsleyFailedOnce"), "undefined" != typeof a._ui && "ParsleyForm" !== a.__class__ && (a._ui.$errorsWrapper.removeClass("filled").children().remove(), this._resetClass(a), a._ui.validatedOnce = !1, a._ui.lastValidationResult = [], a._ui.validationInformationVisible = !1, a._ui.failedOnce = !1)
    },
    destroy: function(a) {
      this.reset(a), "ParsleyForm" !== a.__class__ && ("undefined" != typeof a._ui && a._ui.$errorsWrapper.remove(), delete a._ui)
    },
    _successClass: function(a) {
      a._ui.validationInformationVisible = !0, a._ui.$errorClassHandler.removeClass(a.options.errorClass).addClass(a.options.successClass)
    },
    _errorClass: function(a) {
      a._ui.validationInformationVisible = !0, a._ui.$errorClassHandler.removeClass(a.options.successClass).addClass(a.options.errorClass)
    },
    _resetClass: function(a) {
      a._ui.$errorClassHandler.removeClass(a.options.successClass).removeClass(a.options.errorClass)
    }
  };
  var q = function(b, c, d) {
      this.__class__ = "ParsleyForm", this.__id__ = f.generateID(), this.$element = a(b), this.domOptions = c, this.options = d, this.parent = window.Parsley, this.fields = [], this.validationResult = null
    },
    r = {
      pending: null,
      resolved: !0,
      rejected: !1
    };
  q.prototype = {
    onSubmitValidate: function(a) {
      var b = this;
      if (!0 !== a.parsley) return a.stopImmediatePropagation(), a.preventDefault(), this.whenValidate(void 0, void 0, a).done(function() {
        b._submit()
      }).always(function() {
        b._submitSource = null
      }), this
    },
    _submit: function() {
      !1 !== this._trigger("submit") && (this.$element.find(".parsley_synthetic_submit_button").remove(), this._submitSource && a('<input class=".parsley_synthetic_submit_button" type="hidden">').attr("name", this._submitSource.name).attr("value", this._submitSource.value).appendTo(this.$element), this.$element.trigger(a.extend(a.Event("submit"), {
        parsley: !0
      })))
    },
    validate: function(a, b, c) {
      return r[this.whenValidate(a, b, c).state()]
    },
    whenValidate: function(b, c, d) {
      var e = this;
      this.submitEvent = d, this.validationResult = !0, this._trigger("validate"), this._refreshFields();
      var f = this._withoutReactualizingFormOptions(function() {
        return a.map(this.fields, function(a) {
          return !b || e._isFieldInGroup(a, b) ? a.whenValidate(c) : void 0
        })
      });
      return a.when.apply(a, f).done(function() {
        e._trigger("success")
      }).fail(function() {
        e.validationResult = !1, e._trigger("error")
      }).always(function() {
        e._trigger("validated")
      })
    },
    isValid: function(a, b) {
      return r[this.whenValid(a, b).state()]
    },
    whenValid: function(b, c) {
      var d = this;
      this._refreshFields();
      var e = this._withoutReactualizingFormOptions(function() {
        return a.map(this.fields, function(a) {
          return !b || d._isFieldInGroup(a, b) ? a.whenValid(c) : void 0
        })
      });
      return a.when.apply(a, e)
    },
    _isFieldInGroup: function(b, c) {
      return a.isArray(b.options.group) ? -1 !== a.inArray(c, b.options.group) : b.options.group === c
    },
    _refreshFields: function() {
      return this.actualizeOptions()._bindFields()
    },
    _bindFields: function() {
      var b = this,
        c = this.fields;
      return this.fields = [], this.fieldsMappedById = {}, this._withoutReactualizingFormOptions(function() {
        this.$element.find(this.options.inputs).not(this.options.excluded).each(function() {
          var a = new A.Factory(this, {}, b);
          "ParsleyField" !== a.__class__ && "ParsleyFieldMultiple" !== a.__class__ || !0 === a.options.excluded || "undefined" == typeof b.fieldsMappedById[a.__class__ + "-" + a.__id__] && (b.fieldsMappedById[a.__class__ + "-" + a.__id__] = a, b.fields.push(a))
        }), a(c).not(b.fields).each(function() {
          this._trigger("reset")
        })
      }), this
    },
    _withoutReactualizingFormOptions: function(a) {
      var b = this.actualizeOptions;
      this.actualizeOptions = function() {
        return this
      };
      var c = a.call(this);
      return this.actualizeOptions = b, c
    },
    _trigger: function(a) {
      return a = "form:" + a, this.trigger.apply(this, arguments)
    }
  };
  var s = function(b, c, d, e, f) {
      if (!new RegExp("ParsleyField").test(b.__class__)) throw new Error("ParsleyField or ParsleyFieldMultiple instance expected");
      var g = window.Parsley._validatorRegistry.validators[c],
        h = new m(g);
      a.extend(this, {
        validator: h,
        name: c,
        requirements: d,
        priority: e || b.options[c + "Priority"] || h.priority,
        isDomConstraint: !0 === f
      }), this._parseRequirements(b.options)
    },
    t = function(a) {
      var b = a[0].toUpperCase();
      return b + a.slice(1)
    };
  s.prototype = {
    validate: function(a, b) {
      var c = this.requirementList.slice(0);
      return c.unshift(a), c.push(b), this.validator.validate.apply(this.validator, c)
    },
    _parseRequirements: function(a) {
      var b = this;
      this.requirementList = this.validator.parseRequirements(this.requirements, function(c) {
        return a[b.name + t(c)]
      })
    }
  };
  var u = function(b, c, d, e) {
      this.__class__ = "ParsleyField", this.__id__ = f.generateID(), this.$element = a(b), "undefined" != typeof e && (this.parent = e), this.options = d, this.domOptions = c, this.constraints = [], this.constraintsByName = {}, this.validationResult = [], this._bindConstraints()
    },
    r = {
      pending: null,
      resolved: !0,
      rejected: !1
    };
  u.prototype = {
    validate: function(a) {
      var b = this.whenValidate(a);
      switch (b.state()) {
        case "pending":
          return null;
        case "resolved":
          return !0;
        case "rejected":
          return this.validationResult
      }
    },
    whenValidate: function(a) {
      var b = this;
      return this.value = this.getValue(), this._trigger("validate"), this.whenValid(a, this.value).done(function() {
        b._trigger("success")
      }).fail(function() {
        b._trigger("error")
      }).always(function() {
        b._trigger("validated")
      })
    },
    hasConstraints: function() {
      return 0 !== this.constraints.length
    },
    needsValidation: function(a) {
      return "undefined" == typeof a && (a = this.getValue()), a.length || this._isRequired() || "undefined" != typeof this.options.validateIfEmpty ? !0 : !1
    },
    isValid: function(a, b) {
      return r[this.whenValid(a, b).state()]
    },
    whenValid: function(b, c) {
      if (this.refreshConstraints(), this.validationResult = !0, !this.hasConstraints()) return a.when();
      if (("undefined" == typeof c || null === c) && (c = this.getValue()), !this.needsValidation(c) && !0 !== b) return a.when();
      var d = this._getGroupedConstraints(),
        e = [],
        f = this;
      return a.each(d, function(b, d) {
        var g = a.when.apply(a, a.map(d, a.proxy(f, "_validateConstraint", c)));
        return e.push(g), "rejected" === g.state() ? !1 : void 0
      }), a.when.apply(a, e)
    },
    _validateConstraint: function(b, c) {
      var d = this,
        e = c.validate(b, this);
      return !1 === e && (e = a.Deferred().reject()), a.when(e).fail(function() {
        !0 === d.validationResult && (d.validationResult = []), d.validationResult.push({
          assert: c
        })
      })
    },
    getValue: function() {
      var a;
      return a = "function" == typeof this.options.value ? this.options.value(this) : "undefined" != typeof this.options.value ? this.options.value : this.$element.val(), "undefined" == typeof a || null === a ? "" : this._handleWhitespace(a)
    },
    refreshConstraints: function() {
      return this.actualizeOptions()._bindConstraints()
    },
    addConstraint: function(a, b, c, d) {
      if (window.Parsley._validatorRegistry.validators[a]) {
        var e = new s(this, a, b, c, d);
        "undefined" !== this.constraintsByName[e.name] && this.removeConstraint(e.name), this.constraints.push(e), this.constraintsByName[e.name] = e
      }
      return this
    },
    removeConstraint: function(a) {
      for (var b = 0; b < this.constraints.length; b++)
        if (a === this.constraints[b].name) {
          this.constraints.splice(b, 1);
          break
        }
      return delete this.constraintsByName[a], this
    },
    updateConstraint: function(a, b, c) {
      return this.removeConstraint(a).addConstraint(a, b, c)
    },
    _bindConstraints: function() {
      for (var a = [], b = {}, c = 0; c < this.constraints.length; c++) !1 === this.constraints[c].isDomConstraint && (a.push(this.constraints[c]), b[this.constraints[c].name] = this.constraints[c]);
      this.constraints = a, this.constraintsByName = b;
      for (var d in this.options) this.addConstraint(d, this.options[d], void 0, !0);
      return this._bindHtml5Constraints()
    },
    _bindHtml5Constraints: function() {
      (this.$element.hasClass("required") || this.$element.attr("required")) && this.addConstraint("required", !0, void 0, !0), "string" == typeof this.$element.attr("pattern") && this.addConstraint("pattern", this.$element.attr("pattern"), void 0, !0), "undefined" != typeof this.$element.attr("min") && "undefined" != typeof this.$element.attr("max") ? this.addConstraint("range", [this.$element.attr("min"), this.$element.attr("max")], void 0, !0) : "undefined" != typeof this.$element.attr("min") ? this.addConstraint("min", this.$element.attr("min"), void 0, !0) : "undefined" != typeof this.$element.attr("max") && this.addConstraint("max", this.$element.attr("max"), void 0, !0), "undefined" != typeof this.$element.attr("minlength") && "undefined" != typeof this.$element.attr("maxlength") ? this.addConstraint("length", [this.$element.attr("minlength"), this.$element.attr("maxlength")], void 0, !0) : "undefined" != typeof this.$element.attr("minlength") ? this.addConstraint("minlength", this.$element.attr("minlength"), void 0, !0) : "undefined" != typeof this.$element.attr("maxlength") && this.addConstraint("maxlength", this.$element.attr("maxlength"), void 0, !0);
      var a = this.$element.attr("type");
      return "undefined" == typeof a ? this : "number" === a ? "undefined" == typeof this.$element.attr("step") || 0 === parseFloat(this.$element.attr("step")) % 1 ? this.addConstraint("type", "integer", void 0, !0) : this.addConstraint("type", "number", void 0, !0) : /^(email|url|range)$/i.test(a) ? this.addConstraint("type", a, void 0, !0) : this
    },
    _isRequired: function() {
      return "undefined" == typeof this.constraintsByName.required ? !1 : !1 !== this.constraintsByName.required.requirements
    },
    _trigger: function(a) {
      return a = "field:" + a, this.trigger.apply(this, arguments)
    },
    _handleWhitespace: function(a) {
      return !0 === this.options.trimValue && f.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'), "squish" === this.options.whitespace && (a = a.replace(/\s{2,}/g, " ")), ("trim" === this.options.whitespace || "squish" === this.options.whitespace || !0 === this.options.trimValue) && (a = f.trimString(a)), a
    },
    _getGroupedConstraints: function() {
      if (!1 === this.options.priorityEnabled) return [this.constraints];
      for (var a = [], b = {}, c = 0; c < this.constraints.length; c++) {
        var d = this.constraints[c].priority;
        b[d] || a.push(b[d] = []), b[d].push(this.constraints[c])
      }
      return a.sort(function(a, b) {
        return b[0].priority - a[0].priority
      }), a
    }
  };
  var v = function() {
    this.__class__ = "ParsleyFieldMultiple"
  };
  v.prototype = {
    addElement: function(a) {
      return this.$elements.push(a), this
    },
    refreshConstraints: function() {
      var b;
      if (this.constraints = [], this.$element.is("select")) return this.actualizeOptions()._bindConstraints(), this;
      for (var c = 0; c < this.$elements.length; c++)
        if (a("html").has(this.$elements[c]).length) {
          b = this.$elements[c].data("ParsleyFieldMultiple").refreshConstraints().constraints;
          for (var d = 0; d < b.length; d++) this.addConstraint(b[d].name, b[d].requirements, b[d].priority, b[d].isDomConstraint)
        } else this.$elements.splice(c, 1);
      return this
    },
    getValue: function() {
      if ("undefined" != typeof this.options.value) return this.options.value;
      if (this.$element.is("input[type=radio]")) return this._findRelatedMultiple().filter(":checked").val() || "";
      if (this.$element.is("input[type=checkbox]")) {
        var b = [];
        return this._findRelatedMultiple().filter(":checked").each(function() {
          b.push(a(this).val())
        }), b
      }
      return this.$element.is("select") && null === this.$element.val() ? [] : this.$element.val()
    },
    _init: function() {
      return this.$elements = [this.$element], this
    }
  };
  var w = function(b, c, d) {
    this.$element = a(b);
    var e = this.$element.data("Parsley");
    if (e) return "undefined" != typeof d && e.parent === window.Parsley && (e.parent = d, e._resetOptions(e.options)), e;
    if (!this.$element.length) throw new Error("You must bind Parsley on an existing element.");
    if ("undefined" != typeof d && "ParsleyForm" !== d.__class__) throw new Error("Parent instance must be a ParsleyForm instance");
    return this.parent = d || window.Parsley, this.init(c)
  };
  w.prototype = {
    init: function(a) {
      return this.__class__ = "Parsley", this.__version__ = "2.2.0-rc1", this.__id__ = f.generateID(), this._resetOptions(a), this.$element.is("form") || f.checkAttr(this.$element, this.options.namespace, "validate") && !this.$element.is(this.options.inputs) ? this.bind("parsleyForm") : this.isMultiple() ? this.handleMultiple() : this.bind("parsleyField")
    },
    isMultiple: function() {
      return this.$element.is("input[type=radio], input[type=checkbox]") || this.$element.is("select") && "undefined" != typeof this.$element.attr("multiple")
    },
    handleMultiple: function() {
      var b, c, d = this;
      if (this.options.multiple || ("undefined" != typeof this.$element.attr("name") && this.$element.attr("name").length ? this.options.multiple = b = this.$element.attr("name") : "undefined" != typeof this.$element.attr("id") && this.$element.attr("id").length && (this.options.multiple = this.$element.attr("id"))), this.$element.is("select") && "undefined" != typeof this.$element.attr("multiple")) return this.options.multiple = this.options.multiple || this.__id__, this.bind("parsleyFieldMultiple");
      if (!this.options.multiple) return f.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.", this.$element), this;
      this.options.multiple = this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, ""), "undefined" != typeof b && a('input[name="' + b + '"]').each(function() {
        a(this).is("input[type=radio], input[type=checkbox]") && a(this).attr(d.options.namespace + "multiple", d.options.multiple)
      });
      for (var e = this._findRelatedMultiple(), g = 0; g < e.length; g++)
        if (c = a(e.get(g)).data("Parsley"), "undefined" != typeof c) {
          this.$element.data("ParsleyFieldMultiple") || c.addElement(this.$element);
          break
        }
      return this.bind("parsleyField", !0), c || this.bind("parsleyFieldMultiple")
    },
    bind: function(b, c) {
      var d;
      switch (b) {
        case "parsleyForm":
          d = a.extend(new q(this.$element, this.domOptions, this.options), window.ParsleyExtend)._bindFields();
          break;
        case "parsleyField":
          d = a.extend(new u(this.$element, this.domOptions, this.options, this.parent), window.ParsleyExtend);
          break;
        case "parsleyFieldMultiple":
          d = a.extend(new u(this.$element, this.domOptions, this.options, this.parent), new v, window.ParsleyExtend)._init();
          break;
        default:
          throw new Error(b + "is not a supported Parsley type")
      }
      return this.options.multiple && f.setAttr(this.$element, this.options.namespace, "multiple", this.options.multiple), "undefined" != typeof c ? (this.$element.data("ParsleyFieldMultiple", d), d) : (this.$element.data("Parsley", d), d._trigger("init"), d)
    }
  };
  var x = a({}),
    y = function() {
      f.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")
    },
    z = "parsley:";
  a.listen = function(a, d) {
    var e;
    if (y(), "object" == typeof arguments[1] && "function" == typeof arguments[2] && (e = arguments[1], d = arguments[2]), "function" != typeof arguments[1]) throw new Error("Wrong parameters");
    window.Parsley.on(c(a), b(d, e))
  }, a.listenTo = function(a, d, e) {
    if (y(), !(a instanceof u || a instanceof q)) throw new Error("Must give Parsley instance");
    if ("string" != typeof d || "function" != typeof e) throw new Error("Wrong parameters");
    a.on(c(d), b(e))
  }, a.unsubscribe = function(a, b) {
    if (y(), "string" != typeof a || "function" != typeof b) throw new Error("Wrong arguments");
    window.Parsley.off(c(a), b.parsleyAdaptedCallback)
  }, a.unsubscribeTo = function(a, b) {
    if (y(), !(a instanceof u || a instanceof q)) throw new Error("Must give Parsley instance");
    a.off(c(b))
  }, a.unsubscribeAll = function(b) {
    y(), window.Parsley.off(c(b)), a("form,input,textarea,select").each(function() {
      var d = a(this).data("Parsley");
      d && d.off(c(b))
    })
  }, a.emit = function(a, b) {
    y();
    var d = b instanceof u || b instanceof q,
      e = Array.prototype.slice.call(arguments, d ? 2 : 1);
    e.unshift(c(a)), d || (b = window.Parsley), b.trigger.apply(b, e)
  }, window.ParsleyConfig = window.ParsleyConfig || {}, window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {}, window.ParsleyConfig.i18n.en = jQuery.extend(window.ParsleyConfig.i18n.en || {}, {
    defaultMessage: "This value seems to be invalid.",
    type: {
      email: "This value should be a valid email.",
      url: "This value should be a valid url.",
      number: "This value should be a valid number.",
      integer: "This value should be a valid integer.",
      digits: "This value should be digits.",
      alphanum: "This value should be alphanumeric."
    },
    notblank: "This value should not be blank.",
    required: "This value is required.",
    pattern: "This value seems to be invalid.",
    min: "This value should be greater than or equal to %s.",
    max: "This value should be lower than or equal to %s.",
    range: "This value should be between %s and %s.",
    minlength: "This value is too short. It should have %s characters or more.",
    maxlength: "This value is too long. It should have %s characters or fewer.",
    length: "This value length is invalid. It should be between %s and %s characters long.",
    mincheck: "You must select at least %s choices.",
    maxcheck: "You must select %s choices or fewer.",
    check: "You must select between %s and %s choices.",
    equalto: "This value should be the same."
  }), "undefined" != typeof window.ParsleyValidator && window.ParsleyValidator.addCatalog("en", window.ParsleyConfig.i18n.en, !0);
  var A = a.extend(new h, {
    $element: a(document),
    actualizeOptions: null,
    _resetOptions: null,
    Factory: w,
    version: "2.2.0-rc1"
  });
  a.extend(u.prototype, h.prototype), a.extend(q.prototype, h.prototype), a.extend(w.prototype, h.prototype), a.fn.parsley = a.fn.psly = function(b) {
    if (this.length > 1) {
      var c = [];
      return this.each(function() {
        c.push(a(this).parsley(b))
      }), c
    }
    return a(this).length ? new w(this, b) : void f.warn("You must bind Parsley on an existing element.")
  }, "undefined" == typeof window.ParsleyExtend && (window.ParsleyExtend = {}), A.options = a.extend(f.objectCreate(g), window.ParsleyConfig), window.ParsleyConfig = A.options, window.Parsley = window.psly = A, window.ParsleyUtils = f;
  var B = window.Parsley._validatorRegistry = new n(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
  return window.ParsleyValidator = {}, a.each("setLocale addCatalog addMessage getErrorMessage formatMessage addValidator updateValidator removeValidator".split(" "), function(b, c) {
    window.Parsley[c] = a.proxy(B, c), window.ParsleyValidator[c] = function() {
      return f.warnOnce("Accessing the method `" + c + "` through ParsleyValidator is deprecated. Simply call `window.Parsley." + c + "(...)`"), window.Parsley[c].apply(window.Parsley, arguments)
    }
  }), window.ParsleyUI = "function" == typeof window.ParsleyConfig.ParsleyUI ? (new window.ParsleyConfig.ParsleyUI).listen() : (new p).listen(), !1 !== window.ParsleyConfig.autoBind && a(function() {
    a("[data-parsley-validate]").length && a("[data-parsley-validate]").parsley()
  }), window.Parsley
});;
(function() {

  window.Parsley.addValidator(
      'notequalto',
      function(value, nbReference) {
        $reference = $('#' + nbReference).val();
        $net = value == $reference;
        return !$net;
      }, 32)
    .addMessage('en', 'notequalto', 'invalid duplicate entry');

})();;
/*global window */
/**
 * Parsley minint validator allows for a field to have a minimum number of
 *   digits in a given string, however is only applicable if the field is
 *   populated. A minint of 3 would accept:
 *   - 123
 *   - A123
 *   - 1A2B3
 *   - (empty)
 */
(function() {
  'use strict';
  window.Parsley.addValidator(
    'minint',
    function(value, minimum) {
      var hasValue,
        intValue,
        hasIntValue,
        hasMinimum;
      // Strip non numeric.
      intValue = value.replace(/\D/g, '');
      minimum = parseInt(minimum);
      // Ensure either is empty, or is not empty and has enough digits.
      hasValue = (value !== undefined && value !== null && value !== '');
      hasIntValue = (intValue !== undefined && intValue !== null && intValue !== '');
      hasMinimum = !hasValue || (hasIntValue && intValue.length >= minimum);
      return hasMinimum;
    },
    32
  ).addMessage('en', 'minint', 'minimum characters not met');
}());;
// Hack to make localizeDate() work.
if (typeof curCarInfo === 'undefined') {
  curCarInfo = {};
}

(function(window, document, $, Drupal) {
  "use strict";

  $(function() {
    var $form = $('#tesla-insider-form');
    // Initialize BrowserDetect object if it hasn't already been done.
    if (typeof BrowserDetect !== "undefined" && typeof BrowserDetect.summary === "undefined") {
      BrowserDetect.init();

      // WEB-24227:
      if (BrowserDetect.summary.browser == 'Explorer' && BrowserDetect.summary.version == 8) {
        $('input[name="post-submit"]').removeClass('hide-on-desk').addClass('hide-on-mobile');
        $('input[name="ajax-submit"]').removeClass('hide-on-mobile').addClass('hide-on-desk');
      }
    }
  });

  Drupal.behaviors.tesla_insider_form_prepopulate = {
    attach: function() {
      $(document).ready(function() {
        // Check if user is logged in. If so, populate email field.
        if (Drupal.behaviors.common.isLoggedIn()) {
          Drupal.behaviors.tesla_insider_form_prepopulate.populate();
        }
      });
    },
    populate: function() {
      // Retrieve the email field for the Tesla insider form.
      var $insiderForm = $('#tesla-insider-form');

      // If the email field is on the page, update it with the locally
      //   cached email address.
      var $insiderFormEmailV1 = $insiderForm.find('#edit-usermail');
      var $insiderFormEmailV2 = $insiderForm.find('#edit-usermail--2');

      if ($insiderFormEmailV1.length) {
        $insiderFormEmailV1.val(Drupal.behaviors.common.getEmailAddress());
      }

      if ($insiderFormEmailV2.length) {
        $insiderFormEmailV2.val(Drupal.behaviors.common.getEmailAddress());
      }
    }
  };

  Drupal.behaviors.tesla_insider_form = {
    attach: function() {

      var $form = $('#tesla-insider-form');
      $('#edit-submit-ti-ajax').on('click', function(e) {
        var reg = new RegExp("(^|&)bd=([^&]*)(&|$)", "i");
        var param = window.location.search.substr(1).match(reg);
        var $adword;
        if (param != null) $adword = unescape(param[2]);
        var cookie = $.cookie('bd');

        if ($adword != null) {
          $.cookie('bd', $adword, {
            expires: 30
          });
          $('input[name=ad_word_ti]').val($adword);
        } else {
          if (cookie != null && cookie != '') {
            $('input[name=ad_word_ti]').val(cookie);
          }
        }
      });

      var $zip_code = $('#edit-zipcode-ti');
      var $ajax_country = true;
      if ($form.length) {
        $form.parsley().destroy();
        $form.parsley();

        // Fire view-open on first input click (for embedded forms).
        $form.find('.form-item input, .form-item textarea').click(function() {
          TeslaAnalytics.NewsletterSignup.interactionViewOpen();
        });

        $('#tesla-insider-modal').on('show.bs.modal', function(event) {
          TeslaAnalytics.NewsletterSignup.interactionViewOpen();
        });

        $('#tesla-insider-modal').on('hide.bs.modal', function(event) {

          // var mymodal = $(this);
          if ($('#tesla-insider-modal .thanks').length) {

            // e.preventDefault();
            var country = (_.indexOf(['en_US', 'zh_CN'], Drupal.settings.tesla.locale) === -1) ? "/" + Drupal.settings.tesla.locale : '';
            $('.modal-body', '#tesla-insider-modal').load(country + "/drive/ajax", function() {
              Drupal.attachBehaviors();
            });
            $('#tesla-insider-modal .modal-title').html(Drupal.t('Tesla Insider'));

          }
        });

        $('.btn-ajax', '#tesla-insider-form').click(function(event) {
          event.preventDefault(); // Prevent default form submit.
          var valid = $form.parsley().validate();
          if (valid && $ajax_country) {
            $('#tesla-insider-modal .modal-throbber').removeClass('hidden');
            $(this).trigger('submit_form');
          }
        });

        // Add browser values to form.
        if (typeof(BrowserDetect) !== "undefined" && typeof(BrowserDetect.summary) === "undefined") {
          BrowserDetect.init();
        }
        $('#tesla-insider-form').append('<input type="hidden" name="browser_type" value="' + BrowserDetect.summary.browser + '">').
        append('<input type="hidden" name="browser_version" value="' + BrowserDetect.summary.version + '">').
        append('<input type="hidden" name="browser_os" value="' + BrowserDetect.summary.OS + '">');

        $('#tesla-insider-form input[type="text"]').keypress(function(e) {
          if (e.keyCode == 13) {
            e.stopPropagation();
            var btn1 = $('#edit-submit-ti-ajax');
            var btn2 = $('#edit-submit-ti-ajax--2');
            if (btn1) {
              btn1.click();
            } else if (btn2) {
              btn2.click();
            }
            return false;
          }
        });
        $('#edit-location').change();
      }
    }
  };

}(this, this.document, this.jQuery, this.Drupal));;
(function($) {
  "use strict";

  Drupal.behaviors.request_callback_form = {
    attach: function(context, settings) {
      var $form = $('#callback-form');
      var modelCode = $('input:hidden[name=model_code]').val();
      $('input:hidden[name=model_code_request_callback]').attr('value', (modelCode ? modelCode : 'ms'));
      $('input:hidden[name=is_preowned]').attr('value', ($("#order-form").hasClass("cpo") && $("#order-form").hasClass("used")));
      $('#edit-submit-request-callback').click(function(e) {
        var reg = new RegExp("(^|&)bd=([^&]*)(&|$)", "i");
        var param = window.location.search.substr(1).match(reg);
        var $adword;
        if (param != null) $adword = unescape(param[2]);
        var cookie = $.cookie('bd');

        if ($adword != null) {
          $.cookie('bd', $adword, {
            expires: 30
          });
          $('input[name=ad_word_request_callback]').val($adword);
        } else {
          if (cookie != null && cookie != '') {
            $('input[name=ad_word_request_callback]').val(cookie);
          }
        }
      });
      if ($form.length) {
        $form.parsley().destroy();
        $form.parsley();

        $('#request-callback-modal').once(
          function() {
            // do this once - start
            $('#request-callback-modal').on('show.bs.modal', function(event) {
              TeslaAnalytics.RequestCallback.interactionViewOpen();
            });
            // do this once - end
          }
        );

        //Stop the submit of the form if it is not valid
        $('#edit-submit-request-callback', '#callback-form').click(function(e) {
          e.preventDefault(); //prevent default form submit
          var valid = $form.parsley().validate();
          if (valid) {
            var $formModal = $('#request-quote-modal').length ? $('#request-quote-modal') : $('#request-callback-modal');
            $('#' + $formModal.attr('id') + ' .modal-throbber').removeClass('hidden');
            $(this).trigger('submit_form');
            if ($formModal.attr('id') == 'request-quote-modal') {
              $("html, body").animate({
                scrollTop: 0
              }, "slow");
            }
          }
        });

        //Regenerate the modal (form) on close AND when it is displaying the thank you page
        $('#request-callback-modal').on('hide.bs.modal', function(e) {
          //var mymodal = $(this);
          if ($('#request-callback-modal .thanks').length) {
            //e.preventDefault();
            var country = (_.indexOf(['en_US', 'zh_CN'], Drupal.settings.tesla.locale) === -1) ? "/" + Drupal.settings.tesla.locale : '';
            $('.modal-body', '#request-callback-modal').load(country + "/tesla_request_callback/regenerate", function() {
              $('#request-callback-modal input[name=current_path]').attr('value', window.location.pathname);
              Drupal.attachBehaviors();
              // wait until the form have been created
              //mymodal.modal('hide');
            });
          }
        });

        $('#trade-in-value-vin').on('click', function(e) {
          e.preventDefault ? e.preventDefault() : e.returnValue = false;
          var $rn = $('#edit-rn-tradein'),
            $mileage = $('#edit-mileage-tradein'),
            validateRN = $rn.parsley().validate(),
            validateMileage = $mileage.parsley().validate();

          if (validateRN === true && validateMileage === true) {
            var $valuation = $('#trade-in-valuation'),
              $valuationInput = $('input[name="tradein_valuation"]'),
              $description = $('#trade-in-description'),
              $descriptionInput = $('input[name="tradein_description"]'),
              $responseContainer = $('#tradein-calculation-response');

            var request = $.get(Drupal.settings.tesla.localePrefix + '/autotrader/valuation/' + $.trim($rn.val()) + '/' + $.trim($mileage.val()));
            $responseContainer.find('div').html('');
            $responseContainer.find('input').attr('value', '');
            $responseContainer.addClass('trade-in-spinner');
            request.done(function(response) {
              $responseContainer.removeClass('trade-in-spinner');
              $descriptionInput.attr('value', JSON.stringify(response.car_details));
              if (response.hasOwnProperty('Error')) {
                $description.html(response.Error);
                if (!response.hasOwnProperty('car_description')) {
                  $descriptionInput.attr('value', JSON.stringify({
                    error: response.Error,
                    registration_number: $rn.val(),
                    mileage: $mileage.val()
                  }));
                }
              } else {
                $description.html(response.car_description);
                $valuation.html(Drupal.t('Your estimated trade-in value is: @amount. Subject to inspection.', {
                  '@amount': Tesla.formatMoney(response.valuation, Drupal.settings.tesla.locale, 0)
                }));
                $valuationInput.attr('value', response.valuation);
              }
            }).fail(function() {
              $responseContainer.removeClass('trade-in-spinner');
              $description.html(Drupal.t('Car not found'));
              $descriptionInput.attr('value', JSON.stringify({
                error: Drupal.t('Car not Found'),
                registration_number: $rn.val(),
                mileage: $mileage.val()
              }));
            });
          }
        });
      }
    }
  };

})(jQuery);

/*
 * Helper function that will select a quote for the modal, this require that the link to the modal have a new attribute
 * onclick="multiple_choice( $('#name-of-the-quote-to-select')
 *
 * Possible values for the quotes are:
 *
 * edit-request-leasing-request-callback == Leasing
 * edit-request-financing-request-callback == Financing
 * edit-request-trade-in-request-callback == Trade In
 * edit-request-callback-request-callback == Request Callback (US only)
 * */
var multiple_choice = function(the_checkbox) {
  $('.sending-options').find(':checkbox').attr('checked', false);
  if (typeof the_checkbox !== 'undefined') {
    the_checkbox.attr('checked', true);
  }
};;
