import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { ClientService } from '../services/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = []
  form!: FormGroup
  showCreateDialog!: boolean;
  showHistoryDialog!: boolean
  imageDisplay!: string | ArrayBuffer | null
  totalNumber!: number
  fetchedClient!: Client
  remotlyDate!: Date | undefined
  livePrivateDate!: Date | undefined
  spotPrivateDate!: Date | undefined
  liveBootcampDate!: Date | undefined
  spotBootcampDate!: Date | undefined
  $endSubs = new Subject<void>()




  constructor (private clientService: ClientService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {}


  ngOnInit(): void {
    this.clients = this.clientService.getClients()
    this.clientService.getClientListener().pipe(takeUntil(this.$endSubs)).subscribe(clients => {
      this.clients = clients
    })
    this._getTotal()
    this._initCreateForm()

  }

  onChangeNumber(event: any, client: Client, type: string) {

    client.showSaveBtn = true
    if(type === 'remotly'){
      this.remotlyDate = new Date()
      client.remotly.number = event.value
    }

    if(type === 'liveP') {
      client.livePrivate.number = event.value
      this.livePrivateDate = new Date()
    }

    if(type ==='spotP') {
      client.spotPrivate.number = event.value
      this.spotPrivateDate = new Date()
    }

    if(type === 'liveB') {
      client.liveBootcamp.number = event.value
      this.liveBootcampDate = new Date()
    }

    if(type === 'spotB') {
      client.spotBootcamp.number = event.value
      this.spotBootcampDate = new Date()
    }

    client.total = client.remotly.number * 100 + client.livePrivate.number * 200 + client.spotPrivate.number * 300 + client.liveBootcamp.number * 100 + client.spotBootcamp.number * 200
  }


  onShowHistory(client: Client) {
    this.showHistoryDialog = true
    this.clientService.getClient(client._id).pipe(takeUntil(this.$endSubs)).subscribe(data => {
      this.fetchedClient = data.client
    })
  }

  removeAllDates(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to delete all dates?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.removeDates(this.fetchedClient._id)
        this.showHistoryDialog = false
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Dates Deleted'})
      },
      reject: () => {
          //reject action
      }
  });
  }

  showDialog() {
    this.showCreateDialog = true
  }

  onImageUpload(event: any) {
    const file = event.target.files[0]
    if(file) {
      this.form.patchValue({image: file})
      this.form.get('image')?.updateValueAndValidity()
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file)
    }
  }

  onSave(client: Client) {
    const data = {
      id: client._id,
      remotly: {number: client.remotly.number, remotlyDate: this.remotlyDate},
      livePrivate: {number: client.livePrivate.number, livePrivateDate: this.livePrivateDate},
      spotPrivate: {number: client.spotPrivate.number, spotPrivateDate: this.spotPrivateDate},
      liveBootcamp: {number: client.liveBootcamp.number, liveBootcampDate: this.liveBootcampDate},
      spotBootcamp: {number: client.spotBootcamp.number, spotBootcampDate: this.spotBootcampDate},
      total: client.total
    }
    this.clientService.saveClientData(data).pipe(takeUntil(this.$endSubs)).subscribe(
      data => console.log(data),
      err => console.log(err))
    setTimeout(() => {
      this._getTotal()
    }, 300)
    client.showSaveBtn = false
    this.remotlyDate = undefined
    this.spotBootcampDate = undefined
    this.liveBootcampDate = undefined
    this.spotPrivateDate = undefined
    this.livePrivateDate = undefined
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Data Saved'})
  }



  onCreate() {
    if(this.form.invalid) {
      return;
    }
    this.showCreateDialog = false
    const formData = new FormData()
    formData.append('name', this.form.controls['name'].value)
    formData.append('image', this.form.controls['image'].value)
    this._createClient(formData)
    this.form.reset()
    this.imageDisplay = null
  }

  onDeleteClient(event: any, clientId: string) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteClient(clientId)
      },
      reject: () => {
          //reject action
      }
  });
  }

  clearAll() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.clearAll().pipe(takeUntil(this.$endSubs)).subscribe(data => {
          this.clients = data.clients
          this.messageService.add({severity:'success', summary:'Success', detail:'Cleared All'});
        })
        setTimeout(() => {
          this._getTotal()
        }, 300)
      },
      reject: () => {

      }
  });
  }


  private _getTotal() {
    this.clientService.getTotalNumber().pipe(takeUntil(this.$endSubs)).subscribe(data => {
      this.totalNumber = data.totalNumber
    })
  }

  private _initCreateForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  private _createClient(formData: FormData) {
    this.clientService.createClient(formData)
  }

  ngOnDestroy(): void {
    this.$endSubs.next()
    this.$endSubs.complete()
  }

}
