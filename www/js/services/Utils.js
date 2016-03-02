starter.service('Utils', function($q, $http) {
    var self = this;

    self.getWeather = function(lat, lng){
    	return $http.get("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=metric&appid=208ee7e43c22b88e8f0c0e6b68d407d0");
    };
    
});