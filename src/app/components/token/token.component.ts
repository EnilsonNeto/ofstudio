import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent {

  autorization = { 'Authorization': 'Bearer key5fJDD8QhJcYtU1' };
  items!: any[];
  displayedColumns: string[] = ['name', 'surname', 'data', 'number', 'active', 'procedimento', 'idHash'];
  listActive: boolean | undefined = true;
  name: any;
  surname: any;
  data: any;
  number: any;
  procedimento: any;
  idHash: any;
  active: any;
  id: any;
  
  constructor(public http: HttpClient){

  }

  ngOnInit(){
    this.getItemsFromAirtable()
  }
  
  getItemsFromAirtable() {
    const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille`;
    const headers = this.autorization;
    const params = {
      filterByFormula: `idHash='${this.idHash}'`,
      fields: ['name', 'surname', 'data', 'number', 'active', 'procedimento', 'idHash']
    };
  
    this.http.get(url, { headers, params }).subscribe((data: any) => {
      this.items = data.records.map((record: any) => record.fields);
      this.name = this.items[0].name;
      this.surname = this.items[0].surname;
      this.data = this.items[0].data;
      this.number = this.items[0].number;
      this.procedimento = this.items[0].procedimento; 
      this.active = this.items[0].active; 
      this.active = this.items[0].active; 
      this.id = this.items[0].idHash; 
    });
  }

  disableUser() {
    Swal.fire({
      title: 'Deseja Concluir o atendimento de ' + this.name + '?',
      showCancelButton: true,
      confirmButtonText: 'Concluir',
      confirmButtonColor: '#0d9f00',
      cancelButtonColor: '#d20000'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille/${this.id}`;
        const headers = this.autorization
        const body = {
          fields: {
            active: false
          }
        };

        this.http.patch(url, body, { headers }).subscribe(() => {
          this.active = false;
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    })
  }

  enableUser() {
    Swal.fire({
      title: 'Deseja Retornar ' + this.name + ' para lista de atendimentos?',
      showCancelButton: true,
      confirmButtonText: 'Retornar',
      confirmButtonColor: '#0d9f00',
      cancelButtonColor: '#d20000'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille/${this.id}`;
        const headers = this.autorization
        const body = {
          fields: {
            active: true
          }
        };

        this.http.patch(url, body, { headers }).subscribe(() => {
          this.active = true;
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
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
}
