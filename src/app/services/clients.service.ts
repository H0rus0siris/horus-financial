import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Client } from "../models/client.model";

@Injectable({providedIn: 'root'})

export class ClientService {

  apiURL = environment.apiURL + 'clients'
  clients: Client[] = []
  private clientListener = new Subject<Client[]>()


  constructor(private http: HttpClient, private messageService: MessageService) {}


  getClients() {
    this.http.get<{clients: Client[]}>(`${this.apiURL}`).subscribe(data => {
      this.clients = data.clients
      this.clientListener.next([...this.clients])
    })
    return this.clients
  }

  getClient(clientId: string) {
    return this.http.get<{client: Client}>(`${this.apiURL}/${clientId}`)
  }

  getClientListener() {
    return this.clientListener.asObservable()
  }

  getTotalNumber() {
    return this.http.get<{totalNumber: number}>(`${this.apiURL}/total`)
  }


  createClient(formData: FormData) {
    this.http.post<{client: Client}>(`${this.apiURL}`, formData).subscribe(data => {
      this.clients.push(data.client)
      this.clientListener.next([...this.clients])
      this.messageService.add({severity: 'success', summary: 'Success', detail: `Created ${data.client.name}`})
    }, (err) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: `An Error Occurred`})

    })
  }

  saveClientData(data: any) {
    return this.http.put(`${this.apiURL}/${data.id}`, data)
  }

  removeDates(id: string) {
    this.http.put(`${this.apiURL}/${id}/deleteDates`, {}).subscribe(data => {
      console.log(data)
    })
  }

  deleteClient(clientId: string) {
    this.http.delete<{message: string}>(`${this.apiURL}/${clientId}`).subscribe(data => {
      const filteredCLients = this.clients.filter(client => client._id !== clientId)
      this.clientListener.next(filteredCLients)
      this.messageService.add({severity: 'success', summary: 'Success', detail: `${data.message}`})
    })
  }

  clearAll() {
    return this.http.put<{clients: Client[]}>(`${this.apiURL}/clear-all`, {})
  }
}
