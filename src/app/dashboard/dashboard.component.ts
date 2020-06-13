import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../shared/service/weather.service';
import { SnackBarService } from '../shared/toaster/snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchPlace = '';
  stateChangeval = 'Current';
  WeatherData:any={
    temp_celcius:'',
    isDay:'',
    temp_min:'',
    temp_max: '',
    temp_feels_like:'',
    main:{humidity:''},
    weatherDes:''
  };
  WeatherSavedData:any={
    temp_celcius:'',
    isDay:'',
    temp_min:'',
    temp_max: '',
    temp_feels_like:'',
    main:{humidity:''},
    weatherDes:''
  };
  constructor(private weather:WeatherService,
    private toaster:SnackBarService) { }

  ngOnInit(): void {
    let savedDetails = this.getLocalData();
    if(savedDetails){
      this.searchWeather(savedDetails,'old');
    }
  }
  // Get user saved place weather
  getLocalData(){
    return JSON.parse(window.localStorage.getItem('saved'));
  }
  // Change weather state like current or houly
  stateChange(sate){
    // console.log(sate.tab.textLabel);
    this.stateChangeval = sate.tab.textLabel;
  }
  // Call weather API to get weathwe details
  async searchWeather(place, state) {
    let req;
    if (state === 'new'){
      req = {
        name: place,
        state: this.stateChangeval,
        cnt:''
      }
    } 
    if(state === 'old'){
      req = {
        name: place.name,
        state: place.state,
        cnt:''
      }
    }
      
      this.weather.getWeatherDetails(req).subscribe((res: any) => {
        if(state === 'new'){
         this.WeatherData = this.setWeatherData(res);
        } else {
          this.WeatherSavedData = this.setWeatherData(res);
        }
        console.log(this.WeatherSavedData);
      },
      err => {
        console.log('searchWeather:',err);
        this.toaster.openSnackBar("incorrect location",'Ok');
      });
  }
// formatting the weather details common function
  setWeatherData(data){
    let details = data;
    let sunsetTime = new Date(details.sys.sunset * 1000);
    details.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    details.isDay = (currentDate.getTime() < sunsetTime.getTime());
    details.temp_celcius = (details.main.temp - 273.15).toFixed(0);
    details.temp_min = (details.main.temp_min - 273.15).toFixed(0);
    details.temp_max = (details.main.temp_max - 273.15).toFixed(0);
    details.temp_feels_like = (details.main.feels_like - 273.15).toFixed(0);
    details.weatherIcon = this.setIcons(details.weather[0].main);
    details.weatherDes = details.weather[0].description
    return details;
  }
  setIcons(icon){
    switch(icon){
      case 'Clouds':
        return 'cloud'
      break;
      case 'Sunny':
        return 'wb_sunny'
      break;
      default:
        return 'wb_sunny'
    }
  }
  // store the user marked place weather
  addCity(){
    let details = this.WeatherData;
    details.state = this.stateChangeval;
    let str = JSON.stringify(details);
    window.localStorage.setItem("saved",str);
    setTimeout(()=>{
      this.changeSavedDetail();
    },1000);
  }
  // change the saved weather details after click the mark
  changeSavedDetail(){
    let savedDetails = this.getLocalData();
    if(savedDetails){
      this.WeatherSavedData = this.setWeatherData(savedDetails);
    }
  }
}
