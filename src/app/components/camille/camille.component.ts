import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import Swal from 'sweetalert2';
import { LoadingModalComponent } from 'src/app/shared/loading-modal/loading-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-camille',
  templateUrl: './camille.component.html',
  styleUrls: ['./camille.component.css']
})
export class CamilleComponent {
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


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public authService: AuthService,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private db: AngularFireDatabase,
    ) {
  }

  ngOnInit(): void {
    this.getItemsFromAirtable();
  }

  openWhatsApp(number: string) {
    const phoneNumber = number.replace(/\s/g, '');
    const countryCode = '+55';
    const formattedNumber = phoneNumber.startsWith(countryCode)
      ? phoneNumber
      : countryCode + phoneNumber;
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  }

  openCallApp(number: string) {
    const phoneNumber = number.replace(/\s/g, '');
    const formattedNumber = `tel:${phoneNumber}`;
    window.open(formattedNumber, '_blank');
  }

  getItemsFromAirtable() {
    this.loadingModal();
    const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille`;
    const headers = this.autorization;
    const params = {
      fields: ['name', 'surname', 'data', 'number', 'active', 'procedimento', 'idHash']
    };
  
    this.http.get(url, { headers, params }).subscribe((data: any) => {
      this.items = data.records.map((record: any) => record.fields);
      this.sortClients();
    });
  }

  toggleOrder() {
    this.ascendingOrder = !this.ascendingOrder;
    this.descendingOrder = !this.descendingOrder;
    this.sortClients();
  }

  sortClients() {
    if (this.items && this.items.length > 0) {
      if (this.ascendingOrder) {
        this.items.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.descendingOrder) {
        this.items.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
  }

  onInputChange(value: string) {
    if (value === '') {
      this.filter('');
      this.getItemsFromAirtable();
    }
  }

  filter(name: string) {
    const lowercaseName = name.toLowerCase();
    const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille?filterByFormula=OR(FIND('${lowercaseName}', LOWER({Name})), FIND('${lowercaseName}', LOWER({Surname})))`;
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
    this.listActive = true
    this.getItemsFromAirtable();
  }

  showInactive() {
    this.items = this.inactiveItems;
    this.listActive = undefined
    this.getItemsFromAirtable();
  }

  disableUser(item: any) {
    Swal.fire({
      title: 'Deseja Concluir o atendimento de ' + item.name + '?',
      showCancelButton: true,
      confirmButtonText: 'Concluir',
      confirmButtonColor: '#0d9f00',
      cancelButtonColor: '#d20000'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille/${item.idHash}`;
        const headers = this.autorization
        const body = {
          fields: {
            active: false
          }
        };

        this.http.patch(url, body, { headers }).subscribe(() => {
          item.active = false;
        });
      }
    })
  }

  enableUser(item: any) {
    Swal.fire({
      title: 'Deseja Retornar ' + item.name + ' para lista de atendimentos?',
      showCancelButton: true,
      confirmButtonText: 'Retornar',
      confirmButtonColor: '#0d9f00',
      cancelButtonColor: '#d20000'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille/${item.idHash}`;
        const headers = this.autorization
        const body = {
          fields: {
            active: true
          }
        };

        this.http.patch(url, body, { headers }).subscribe(() => {
          item.active = true;
        });
      }
    });
  }

  loadingModal() {

    this.dialogLoad = this.dialog.open(LoadingModalComponent);

    this.dialogLoad.close();

  }
}