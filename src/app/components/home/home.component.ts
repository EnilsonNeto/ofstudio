import { Component, OnInit } from '@angular/core';
import { SchedulingComponent } from '../scheduling/scheduling.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  autorization = { 'Authorization': 'Bearer key5fJDD8QhJcYtU1' };
  items!: any[];
  image1: any;
  image2: any;
  image3: any;

  constructor(
    public dialog: MatDialog,
    public http: HttpClient) { }

  ngOnInit() {
      this.getImages();
    }

    getImages(){
      const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Carrousel`;
      const headers = this.autorization;
      const params = {
        fields: ['carousel1', 'carousel2', 'carousel3']
      };
  
      this.http.get(url, { headers, params }).subscribe((data: any) => {
        this.items = data.records.map((record: any) => record.fields);
        this.image1 = this.items[0].carousel1;
        this.image2 = this.items[0].carousel2;
        this.image3 = this.items[0].carousel3;
      });
    }


  openDialogRecord() {
    const dialogRef = this.dialog.open(SchedulingComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
