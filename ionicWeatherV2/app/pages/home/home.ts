import {Component,ViewChild,Slides} from '@angular/core';
import {WeatherService} from '../../providers/weather-service/weather-service';
import {GeocodeService} from '../../providers/geocode-service/geocode-service';
import {Alert, NavController} from 'ionic-angular';

@Component({
	providers: [WeatherService,GeocodeService],
	templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

	public weather:Object = {temperture:''};
	public locations:Array<Object>;
	@ViewChild('mySlides') slider: Slides;

	/*
	I store a related array of weather reports so that when we add a city, we don't lose the existing
	data. Probably a better way of doing this.
	*/
	public weatherData:Array<Object>;

	constructor(public weatherService:WeatherService, public geocodeService:GeocodeService, public nav:NavController) {

		this.locations = this.getLocations();
		this.weatherData = [];

		if(this.locations.length) {
			this.locations.forEach((loc,idx) => {
				console.log('get weather for '+JSON.stringify(loc));
				this.weatherService.load(loc.location.latitude, loc.location.longitude).then(weatherRes => {
					//console.log('got a result of '+JSON.stringify(weatherRes));
					this.weatherData[idx] = this.formatWeather(weatherRes);
				});
			});
		}

	}

	/*
	A utility func that takes the raw data from the weather service and prepares it for
	use in the view.
	*/
	formatWeather(data) {
		let tempData:any = data.currently;
		tempData.tomorrow = data.daily.data[1];
		//do a bit of manip on tomorrow.summary
		tempData.tomorrow.summary = tempData.tomorrow.summary.toLowerCase().substr(0,tempData.tomorrow.summary.length-1);
		return tempData;
	}

	addLocation(location:Object) {
		let currentLocations = this.getLocations();
		currentLocations.push(location);
		let index = currentLocations.length-1;
		this.weatherService.load(location.location.latitude, location.location.longitude).then(weatherRes => {
			this.weatherData[index] = this.formatWeather(weatherRes);
			console.log('set weather for '+index);
			console.log(this.weatherData);
		});

		this.locations = currentLocations;
		localStorage.locations = JSON.stringify(currentLocations);
	}

	getLocations() {
		if(localStorage.locations) return JSON.parse(localStorage.locations);
		return [];
	}

	onSlideChanged() {
		let currentIndex = this.slider.getActiveIndex();
		//do we have weather for it?
		/* no longer necessary
		if(!this.weatherData[currentIndex]) {
			console.log('loading weather info for this one', this.locations[currentIndex]);
			this.weatherService.load(this.locations[currentIndex].location.latitude, this.locations[currentIndex].location.longitude).then(weatherRes => {
				this.weatherData[currentIndex] = weatherRes.currently;
			});
			
		}
		*/
	}

	doAdd() {
		let prompt = Alert.create({
			title:'Add Location',
			message:'Enter the new location (name or zip).',
			inputs:[
				{
					name:'location',
					placeholder:'Location'
				}
			],
			buttons:[
				{
					text:'Cancel',
					handler: data => {
					}
				},
				{
					text:'Add',
					handler:data => {
						if(data.location == '') return true;
						this.geocodeService.locate(data.location).then(result => {
							this.addLocation(result);
							this.nav.pop();
						});
						return false;
					}
				}
			]
		});
		this.nav.present(prompt);
	}

}
