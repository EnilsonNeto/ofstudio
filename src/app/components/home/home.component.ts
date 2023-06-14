import { Component, OnInit } from '@angular/core';
import { SchedulingComponent } from '../scheduling/scheduling.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{


  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialogRecord() {
    const dialogRef = this.dialog.open(SchedulingComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
