import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WeatherService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherService {
  key: string = 'e4564fca8b58ae55866491bf6ceec485';

  constructor(public http: Http) {
    this.http = http;
  }

  load(latitude:String,longitude:String) {

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      /*
      var latitude:String = '30.2238889';
      var longitude:String = '-92.0197222';
      */

      console.log('about to get weather','https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude); 

      
      this.http.get('https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude+'?exclude=alerts,minutely,hourly')
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          resolve(data);
        });
        
        /*
        this.data = JSON.parse('{"latitude":30.2238889,"longitude":-92.0197222,"timezone":"America/Chicago","offset":-5,"currently":{"time":1465951268,"summary":"Partly Cloudy","icon":"partly-cloudy-day","nearestStormDistance":35,"nearestStormBearing":50,"precipIntensity":0,"precipProbability":0,"temperature":84.44,"apparentTemperature":93.62,"dewPoint":76.02,"humidity":0.76,"windSpeed":8.47,"windBearing":197,"visibility":9.77,"cloudCover":0.41,"pressure":1012.23,"ozone":294.49},"daily":{"summary":"Light rain today through Monday, with temperatures peaking at 95°F on Friday.","icon":"rain","data":[{"time":1465880400,"summary":"Rain until evening.","icon":"rain","sunriseTime":1465902442,"sunsetTime":1465953137,"moonPhase":0.32,"precipIntensity":0.0213,"precipIntensityMax":0.1009,"precipIntensityMaxTime":1465938000,"precipProbability":0.7,"precipType":"rain","temperatureMin":76.15,"temperatureMinTime":1465902000,"temperatureMax":89.47,"temperatureMaxTime":1465930800,"apparentTemperatureMin":76.15,"apparentTemperatureMinTime":1465902000,"apparentTemperatureMax":101.74,"apparentTemperatureMaxTime":1465930800,"dewPoint":75.75,"humidity":0.81,"windSpeed":6.14,"windBearing":207,"visibility":9.03,"cloudCover":0.5,"pressure":1013.14,"ozone":299.38},{"time":1465966800,"summary":"Partly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1465988847,"sunsetTime":1466039556,"moonPhase":0.35,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":76.99,"temperatureMinTime":1465981200,"temperatureMax":92.42,"temperatureMaxTime":1466024400,"apparentTemperatureMin":76.99,"apparentTemperatureMinTime":1465981200,"apparentTemperatureMax":106.22,"apparentTemperatureMaxTime":1466024400,"dewPoint":76.37,"humidity":0.8,"windSpeed":8.01,"windBearing":216,"visibility":9.41,"cloudCover":0.52,"pressure":1014.77,"ozone":287.12},{"time":1466053200,"summary":"Foggy in the morning.","icon":"fog","sunriseTime":1466075253,"sunsetTime":1466125974,"moonPhase":0.38,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":76.49,"temperatureMinTime":1466071200,"temperatureMax":93.73,"temperatureMaxTime":1466110800,"apparentTemperatureMin":76.49,"apparentTemperatureMinTime":1466071200,"apparentTemperatureMax":104.78,"apparentTemperatureMaxTime":1466110800,"dewPoint":75.85,"humidity":0.81,"windSpeed":5.92,"windBearing":238,"visibility":7.58,"cloudCover":0.37,"pressure":1015.46,"ozone":290.72},{"time":1466139600,"summary":"Partly cloudy in the morning.","icon":"partly-cloudy-day","sunriseTime":1466161660,"sunsetTime":1466212391,"moonPhase":0.41,"precipIntensity":0.0003,"precipIntensityMax":0.0015,"precipIntensityMaxTime":1466164800,"precipProbability":0.03,"precipType":"rain","temperatureMin":75.05,"temperatureMinTime":1466161200,"temperatureMax":94.58,"temperatureMaxTime":1466197200,"apparentTemperatureMin":75.05,"apparentTemperatureMinTime":1466161200,"apparentTemperatureMax":106.61,"apparentTemperatureMaxTime":1466197200,"dewPoint":75.22,"humidity":0.78,"windSpeed":5.43,"windBearing":259,"visibility":10,"cloudCover":0.18,"pressure":1014.14,"ozone":296.6},{"time":1466226000,"summary":"Light rain overnight.","icon":"rain","sunriseTime":1466248069,"sunsetTime":1466298807,"moonPhase":0.44,"precipIntensity":0.0017,"precipIntensityMax":0.0121,"precipIntensityMaxTime":1466308800,"precipProbability":0.47,"precipType":"rain","temperatureMin":78.37,"temperatureMinTime":1466247600,"temperatureMax":94.03,"temperatureMaxTime":1466283600,"apparentTemperatureMin":78.37,"apparentTemperatureMinTime":1466247600,"apparentTemperatureMax":100.98,"apparentTemperatureMaxTime":1466283600,"dewPoint":73.47,"humidity":0.69,"windSpeed":6.11,"windBearing":297,"cloudCover":0.08,"pressure":1013.57,"ozone":299.7},{"time":1466312400,"summary":"Light rain until evening.","icon":"rain","sunriseTime":1466334479,"sunsetTime":1466385221,"moonPhase":0.47,"precipIntensity":0.0113,"precipIntensityMax":0.0308,"precipIntensityMaxTime":1466316000,"precipProbability":0.58,"precipType":"rain","temperatureMin":77.49,"temperatureMinTime":1466337600,"temperatureMax":83.39,"temperatureMaxTime":1466359200,"apparentTemperatureMin":77.49,"apparentTemperatureMinTime":1466337600,"apparentTemperatureMax":88.59,"apparentTemperatureMaxTime":1466359200,"dewPoint":72.99,"humidity":0.78,"windSpeed":6.22,"windBearing":108,"cloudCover":0.94,"pressure":1016.48,"ozone":299.07},{"time":1466398800,"summary":"Light rain starting in the afternoon, continuing until evening.","icon":"rain","sunriseTime":1466420890,"sunsetTime":1466471635,"moonPhase":0.51,"precipIntensity":0.0046,"precipIntensityMax":0.0144,"precipIntensityMaxTime":1466456400,"precipProbability":0.49,"precipType":"rain","temperatureMin":74.9,"temperatureMinTime":1466420400,"temperatureMax":87.26,"temperatureMaxTime":1466456400,"apparentTemperatureMin":74.9,"apparentTemperatureMinTime":1466420400,"apparentTemperatureMax":90.7,"apparentTemperatureMaxTime":1466456400,"dewPoint":70.51,"humidity":0.73,"windSpeed":5.03,"windBearing":102,"cloudCover":0.74,"pressure":1018.36,"ozone":300.63},{"time":1466485200,"summary":"Partly cloudy starting in the afternoon, continuing until evening.","icon":"partly-cloudy-day","sunriseTime":1466507302,"sunsetTime":1466558047,"moonPhase":0.54,"precipIntensity":0.0013,"precipIntensityMax":0.0026,"precipIntensityMaxTime":1466542800,"precipProbability":0.07,"precipType":"rain","temperatureMin":75.6,"temperatureMinTime":1466503200,"temperatureMax":89.58,"temperatureMaxTime":1466546400,"apparentTemperatureMin":75.6,"apparentTemperatureMinTime":1466503200,"apparentTemperatureMax":93.33,"apparentTemperatureMaxTime":1466546400,"dewPoint":70.39,"humidity":0.69,"windSpeed":1.37,"windBearing":297,"cloudCover":0.23,"pressure":1016.43,"ozone":294.57}]},"flags":{"sources":["darksky","lamp","gfs","cmc","nam","rap","rtma","sref","fnmoc","isd","madis","nearest-precip"],"darksky-stations":["KLCH"],"lamp-stations":["KARA","KLFT"],"isd-stations":["722314-03934","722314-53915","722314-99999","722405-13976","999999-53960"],"madis-stations":["AR587","C1478","C2220","CADL1","D1389","D1426","D4071","E4555","KARA","KIYA","KLFT","KOPL","UP172","UP213","UP875","UP880"],"units":"us"}}');
        resolve(this.data);
        */
    });
  }
}

