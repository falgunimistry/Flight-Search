import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { DatePipe } from '@angular/common';
import { Options } from 'ng5-slider';
import { DatePicker } from 'angular2-datetimepicker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})


export class HomeComponent implements OnInit {
  public flightListData;
  public type;
  public departureDate: Date = new Date();
  public returnDate: Date = new Date();
  public settings = {
      bigBanner: false,
      timePicker: false,
      format: 'dd MMM y',
      defaultOpen: false
  }
  minValue: number = 2000;
  maxValue: number = 20000;
  public options: Options = {
    floor: 2000,
    ceil: 20000,
    step: 10
  };
  public FilterData: any;
  public FilterDataRound: any;
  public originCityName: string;
  public destinationCityName: string;
  public departureDateSelected;
  public passanger;
  public returnDateSelected;
  public searchResult;


  constructor(public http: HttpClient,public _datePipe: DatePipe) {
    this.getFlightList().subscribe(data => {
      this.flightListData = data.flights;
    });
  }

  public getFlightList(): Observable<any> {
    return this.http.get("./assets/data/flight-data.json");
  }

  ngOnInit() {
  }

  flightSearch(type, origin, destination, departurDate, returnDate, passanger) {
    this.minValue = 2000;
    this.maxValue = 20000;
    this.searchResult = this.flightListData.filter(
      flights => {
      if (origin && flights.origin.toLowerCase().indexOf(origin.toLowerCase()) === -1){
          return false;
      }
      if (destination && flights.destination.toLowerCase().indexOf(destination.toLowerCase()) === -1){
          return false;
      }
      if (type=='oneway' && departurDate && flights.departureDateAirport.indexOf(departurDate) === -1){
          return false;
      }
      if (type=='roundtrip' && returnDate && flights.departureDateAirport.indexOf(returnDate) === -1){
          return false;
      }
      return true;
    });
    return this.searchResult;    
  }

  onewaysearch(onewaysearchForm:NgForm) { 
    this.type = 'oneway';
    this.originCityName = onewaysearchForm.value.originCity;
    this.destinationCityName = onewaysearchForm.value.destinationCity;
    this.departureDateSelected = this._datePipe.transform(onewaysearchForm.value.departureDate, 'y MMM dd');
    this.passanger = onewaysearchForm.value.passangers;

    this.FilterData = this.flightSearch(this.type, this.originCityName, this.destinationCityName, this.departureDateSelected, '', this.passanger);
    console.log(this.FilterData);
  }

  roundtripsearch(roundtripsearchForm:NgForm) { 
    this.type = 'roundtrip';
    this.originCityName = roundtripsearchForm.value.originCity;
    this.destinationCityName = roundtripsearchForm.value.destinationCity;
    this.departureDateSelected = this._datePipe.transform(roundtripsearchForm.value.departureDateR, 'y MMM dd');
    this.returnDateSelected = this._datePipe.transform(roundtripsearchForm.value.returnDateR, 'y MMM dd');
    this.passanger = roundtripsearchForm.value.passangers;

    this.FilterData = this.flightSearch(this.type, this.originCityName, this.destinationCityName, this.departureDateSelected, '', this.passanger);

    this.FilterDataRound = this.flightSearch(this.type, this.destinationCityName, this.originCityName, '', this.returnDateSelected, this.passanger);
  }

  DateChange(event){
    this.departureDate = event;
    this.returnDate = event;
  }

  pricefilter(){
    console.log(this.minValue);
    console.log(this.maxValue);
    let minprice = this.minValue;
    let maxprice = this.maxValue;
    let onewayResult = this.flightSearch(this.type, this.originCityName, this.destinationCityName, this.departureDateSelected, '', this.passanger);
    let onewayPrice = onewayResult.filter(
      flight => {        
        if(flight.price >= minprice && flight.price <= maxprice) {//if (maxprice && flights.price <= maxprice){
          console.log(flight.price)
          return true;
        }
      return false;
    });
    this.FilterData = onewayPrice;

    if(this.type == 'roundtrip'){
      let rountTripResult = this.flightSearch(this.type, this.destinationCityName, this.originCityName, '', this.returnDateSelected, this.passanger);
      let rountTripPrice = rountTripResult.filter(
        flight => {        
          if(flight.price >= minprice && flight.price <= maxprice) {//if (maxprice && flights.price <= maxprice){
            console.log(flight.price)
            return true;
          }
        return false;
      });
      this.FilterDataRound = rountTripPrice;
    }
    /* let roundTripPrice = this.FilterDataRound.filter(
      flights => {
      if (minprice && flights.price >= minprice && maxprice && flights.price<= maxprice){
          return false;
      }
      return true;
    });
    this.FilterDataRound = roundTripPrice; */
  }

}
