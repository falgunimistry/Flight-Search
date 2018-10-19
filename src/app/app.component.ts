import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    public loading = false;
    constructor() {
      setTimeout(() => {
        this.loading = true;
      }, 5000);
    }

    ngOnInit(){
    }
}
