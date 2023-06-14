import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
})
export class SchedulingComponent {
  active = true
  today: Date = new Date();
  dataAtual: Date = new Date();
  diasCalendario: Date[] = [];
  diaSelecionado: Date | null = null;
  nameFromTable: any;
  formUser!: FormGroup;
  formData: any;
  combinedFormGroup: any;
  autorization = { 'Authorization': 'Bearer key5fJDD8QhJcYtU1' };
  selectedOption: any;
  disabled: boolean = false;
  selectedProcedures: string[] = [];
  selectedProfessional: string = '';
  procedureProfessionals: { [key: string]: string[] } = {
    Epilação: ['Renee'],
    'Plastica dos Pés': ['Renee'],
    Sobrancelha: ['Renee', 'Camille'],
    Dermaplaning: ['Camille'],
    'Lash Lifting': ['Camille'],
    'Extensão de cílios': ['Camille']
  };
  selectedProfessionalValue: any;
  camilleLimited: any;
  selectedProcedure: any;

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.construirCalendario();
    this.formUser = new FormGroup({
      data: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      professional: new FormControl('', [Validators.required]),
      process: new FormControl('', [Validators.required]),
    });
    this.formUser.controls['process'].valueChanges.subscribe((value) => {
      if (value === 'Dermaplaning' || value === 'Lash Lifting' || value === 'Sobrancelha' || value === 'Extensão de cílios') {
        this.formUser.controls['professional'].setValue('Camille');
      } else {
        this.formUser.controls['professional'].setValue('Renee');
      }
    });
  }

  onProfessionalChange() {
    this.selectedProfessional = this.formUser.get('professional')?.value;
  }

  adicionarProcedimentoProfissional() {
    if (this.formUser.value.professional === 'Camille') {
      const limite = 4;

      if (this.selectedProcedures.length < limite) {
        const newProcedureControl = new FormControl('', [Validators.required]);
        this.formUser.addControl(`procedure${this.selectedProcedures.length}`, newProcedureControl);
        this.selectedProcedures.push(`procedure${this.selectedProcedures.length}`);
        this.formUser.addControl(`professional${this.selectedProcedures.length}`, new FormControl('', [Validators.required]));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Limite máximo de procedimentos atingido!',
          timer: 1500
        });
      }
    } else if (this.formUser.value.professional === 'Renee') {
      const limite = 2;

      if (this.selectedProcedures.length < limite) {
        const newProcedureControl = new FormControl('', [Validators.required]);
        this.formUser.addControl(`procedure${this.selectedProcedures.length}`, newProcedureControl);
        this.selectedProcedures.push(`procedure${this.selectedProcedures.length}`);
        this.formUser.addControl(`professional${this.selectedProcedures.length}`, new FormControl('', [Validators.required]));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Limite máximo de procedimentos atingido!',
          timer: 1500
        });
      }
    }
  }

  removerProcedimentoProfissional(index: number) {
    this.formUser.removeControl(`procedure${index}`);
    this.formUser.removeControl(`professional${index}`);
    this.selectedProcedures.splice(index, 1);
  }

  getAvailableProfessionals(procedure?: string): string[] {
    if (procedure) {
      return this.procedureProfessionals[procedure] || [];
    } else {
      this.selectedProcedure = this.formUser.get('process')?.value;
      return this.procedureProfessionals[this.selectedProcedure] || [];
    }
  }

  selecionarDia(dia: Date) {
    const mesAtual = this.dataAtual.getMonth();
    const anoAtual = this.dataAtual.getFullYear();
    const mesSelecionado = dia.getMonth();
    const anoSelecionado = dia.getFullYear();

    if (anoSelecionado > anoAtual || (anoSelecionado === anoAtual && mesSelecionado >= mesAtual)) {
      this.diaSelecionado = dia;
    }
  }

  createDataUser(data: any) {
    this.formData = this.combinedFormGroup = Object.assign({}, this.formUser.value, { active: this.active });

    if (this.formData.invalid) {
      alert('Error: Invalid form data');
      return;
    }

    const selectedProcedureValues = this.selectedProcedures.map((procedure) => this.formUser.get(procedure)?.value);
    this.selectedProfessionalValue = this.formUser.get('professional')?.value;

    const formattedProcedureValues = selectedProcedureValues.join(', ');

    const newUser = {
      fields: {
        data: data,
        name: this.formUser.value.name,
        surname: this.formUser.value.surname,
        number: this.formUser.value.number,
        procedimento: '"' + this.formUser.value.process + '", ' + JSON.stringify(formattedProcedureValues),
        active: this.active
      },
    };

    if (this.formUser.value.professional === 'Camille') {
      const headers = this.autorization;
      this.http.post('https://api.airtable.com/v0/app5qbSshO2ZFVei1/Camille', newUser, { headers })
        .subscribe(response => {
          console.log(response);
        }, error => {
          console.error(error);
        });
    } else if (this.formUser.value.professional === 'Renee') {
      const headers = this.autorization;
      this.http.post('https://api.airtable.com/v0/app5qbSshO2ZFVei1/Renee', newUser, { headers })
        .subscribe(response => {
          console.log(response);
        }, error => {
          console.error(error);
        });
    }
  }

  isInputEmpty(): boolean {
    return this.formUser.get('name')?.value
      && this.formUser.get('surname')?.value
      && this.formUser.get(['number'])?.value
      && this.formUser.get('process')?.value === '';
  }

  send(data: any, professionalName: any) {
    this.nameFromTable = professionalName;
    this.combinedFormGroup = Object.assign({}, this.formUser.value, { active: this.active });
    if (this.combinedFormGroup.invalid) {
      alert("Error: Invalid form data");
      return;
    } else {
      this.createDataUser(data);
      Swal.fire({
        icon: 'success',
        title: 'Agendamento realizado com sucesso!',
        text: 'Entraremos em contato em breve, para marcamos o seu horário!',
        timer: 5000
      })
    }
  }



  construirCalendario() {
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();

    const primeiroDiaDaSemana = 0;
    const ultimoDiaDaSemana = 6;

    const dataInicial = new Date(ano, mes, 1);
    while (dataInicial.getDay() !== primeiroDiaDaSemana) {
      dataInicial.setDate(dataInicial.getDate() - 1);
    }

    const dataFinal = new Date(ano, mes + 1, 0);
    while (dataFinal.getDay() !== ultimoDiaDaSemana) {
      dataFinal.setDate(dataFinal.getDate() + 1);
    }

    this.diasCalendario = [];
    for (
      let data = new Date(dataInicial.getTime());
      data <= dataFinal;
      data.setDate(data.getDate() + 1)
    ) {
      this.diasCalendario.push(new Date(data.getTime()));
    }
  }

  alterarMes(offsetMes: number) {
    this.dataAtual.setMonth(this.dataAtual.getMonth() + offsetMes);
    this.dataAtual = new Date(this.dataAtual.getTime());
    this.construirCalendario();
  }
}
