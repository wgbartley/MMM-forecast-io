Module.register("MM-forecast-io", {

  defaults: {
    apikey: "",
    updateInterval: 10 * 60 * 1000, // every 10 minutes
    animationSpeed: 1000,
    initialLoadDelay: 0, // 0 seconds delay
    retryDelay: 2500,

    iconTable: {
      'clear-day':           'wi-day-sunny',
      'clear-night':         'wi-night-clear',
      'rain':                'wi-rain',
      'snow':                'wi-snow',
      'sleet':               'wi-rain-mix',
      'wind':                'wi-cloudy-gusts',
      'fog':                 'wi-fog',
      'cloudy':              'wi-cloudy',
      'partly-cloudy-day':   'wi-day-cloudy',
      'partly-cloudy-night': 'wi-night-cloudy',
      'hail':                'wi-hail',
      'thunderstorm':        'wi-thunderstorm',
      'tornado':             'wi-tornado'
    }
  },

  getTranslations: function() {
    return false;
  },

  getScripts: function() {
    return ['jsonp.js'];
  },

  getStyles: function() {
    return ["weather-icons.css", "MM-forecast-io.css"];
  },

  start: function() {
    Log.info("Starting module: " + this.name);

    if (localStorage.forecast) {
      this.loaded = true
      this.weatherData = JSON.parse(localStorage.forecast);
      // this.updateDom(this.config.animationSpeed);
      return;
    }

    this.scheduleUpdate(this.config.initialLoadDelay);
  },

  updateWeather: function() {
    var self = this;
    var retry = true;
    var url = 'https://api.forecast.io/forecast/'+this.config.apikey+'/'+this.config.latitude+','+this.config.longitude;
    getJSONP(url, this.processWeather.bind(this));
  },

  processWeather: function (data) {
    console.log('process', data);
    this.loaded = true;
    this.weatherData = data;
    this.updateDom(this.config.animationSpeed);
  },

  renderWeather: function () {
    var temp = Math.round(currentWeather.temperature);

    var iconClass = iconTable[currentWeather.icon];
    var icon = $('<span/>').addClass('icon dimmed wi').addClass(iconClass);
    $('.temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

    if (wind > 0) {
      var bearingIcon = '';
      var bearing = currentWeather.windBearing;
      if (bearing !== undefined) {
        bearing = (bearing + 22.5) % 360;
        var bearingIndex = Math.floor(bearing / 45);
        bearingIcon = $('<span/>').addClass('xdimmed wi').addClass(bearingIcons[bearingIndex]);
      }

      var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + ' ' + bearingIcon.outerHTML();
      $('.wind').updateWithText(windString, 1000);
    } else {
      $('.wind').updateWithText('', 1000);
    }

    // remove ending '.' for consistancy
    var summary = minuteWeather.summary.replace(/\.$/, '');
    $('.weather-summary').updateWithText(summary, 1000);
  },

  getDom: function() {
    var wrapper = document.createElement("div");

    if (this.config.apikey === "") {
      wrapper.innerHTML = "Please set the correct forcast.io <i>apikey</i> in the config for module: " + this.name + ".";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (this.config.latitude === "" || this.config.longitude === "") {
      wrapper.innerHTML = "Please set the forcast.io <i>latitude</i> and <i>longitude</i> in the config for module: " + this.name + ".";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = this.translate('LOADING');
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    var currentWeather = this.weatherData.currently;
    var iconClass = this.config.iconTable[currentWeather.icon];
    var icon = document.createElement("span");

    var temp = document.createElement("div");
    var tempValue = Math.round(currentWeather.temperature);
    icon.className = 'wi weathericon ' + iconClass;
    temp.appendChild(icon);
    // temp.appendText(tempValue + '&deg;');

    wrapper.appendChild(temp);

    // var summary  = document.createElement("div");
    // var forecast = document.createElement("div");

    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setTimeout(function() {
      self.updateWeather();
    }, nextLoad);
  },

});