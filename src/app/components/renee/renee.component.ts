import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';
import { TokenComponent } from '../token/token.component';
import { LoadingModalComponent } from 'src/app/shared/loading-modal/loading-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-renee',
  templateUrl: './renee.component.html',
  styleUrls: ['./renee.component.css']
})
export class ReneeComponent {
  items!: any[];
  activeItems!: any[];
  inactiveItems!: any[];
  listActive: boolean | undefined = true;
  open = true;
  emailToPhysiotherapist: any;
  autorization = { 'Authorization': 'Bearer key5fJDD8QhJcYtU1' };
  ascendingOrder: boolean = true;
  descendingOrder: boolean = false;
  dialogLoad: any;
  displayedColumns: string[] = ['name', 'data', 'active', 'dialogAction'];
  table = 'Renee';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private db: AngularFireDatabase,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getItemsFromAirtable();
    this.sortItems();
  }

  sortItems() {
    if (this.items && this.items.length > 0) {
      return this.items.sort((a, b) => a.data.localeCompare(b.data));
    } else {
      return [];
    }
  }

  getItemsFromAirtable() {
    this.loadingModal();
    const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Renee`;
    const headers = this.autorization;
    const params = {
      fields: ['name', 'surname', 'data', 'number', 'active', 'procedimento', 'idHash']
    };

    this.http.get(url, { headers, params }).subscribe((data: any) => {
      this.items = data.records.map((record: any) => record.fields);
      this.activeItems = this.items.filter(item => item.active === true);
      this.inactiveItems = this.items.filter(item => item.active === undefined);
      if (this.listActive === true) {
        this.showActive();
      } else if (this.listActive === false) {
        this.showInactive();
      }
    });
  }

  onInputChange(value: string) {
    if (value === '') {
      if (this.listActive === true) {
        this.showActive();
      } else if (this.listActive === false) {
        this.showInactive();
      }
    }
  }


  filter(name: string) {
    const lowercaseName = name.toLowerCase();
    const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Renee?filterByFormula=OR(FIND('${lowercaseName}', LOWER({Name})), FIND('${lowercaseName}', LOWER({Surname})))`;
    const headers = this.autorization
    const params = {
      fields: ['name', 'surname', 'data', 'number', 'active', 'procedimento', 'idHash']
    };
    this.http.get(url, { headers, params }).subscribe(
      (data: any) => {
        if (data.records.length > 0) {
          this.items = data.records.map((record: any) => record.fields);
        } else if (name === '') {
          this.getItemsFromAirtable();
        } else {
          this.getItemsFromAirtable();
          const noFindUser = Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuário não encontrado ou Inativo',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    );
  }

  showActive() {
    this.items = this.activeItems;
  }

  showInactive() {
    this.items = this.inactiveItems;
  }


  openModal(item: any){
    const dialogRef = this.dialog.open(TokenComponent);
    dialogRef.componentInstance.idHash = item.idHash;
    dialogRef.componentInstance.nameTable = this.table;
  }

  loadingModal() {
    this.dialogLoad = this.dialog.open(LoadingModalComponent);
    this.dialogLoad.close();
  }
}
