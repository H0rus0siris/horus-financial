import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { LocalStorageService } from "./localstorage.service";

@Injectable({providedIn: 'root'})

export class AuthService {

  apiURL = environment.apiURL + 'user'
  private isAuth = false

  constructor(private http: HttpClient, private messageService: MessageService, private localStorageService: LocalStorageService, private router: Router) {}

  login(username: string, password: string) {
    this.http.post<{user: User, token: string}>(`${this.apiURL}/login`, {username, password}).subscribe(data => {
      this.localStorageService.setToken(data.token)
      this.isAuth = true
      this.messageService.add({severity: 'success', summary: 'Welcome Horus'})
      this.router.navigateByUrl('')
    }, (error) => {
      console.log(error)
      this.messageService.add({severity: 'error', summary: 'Error', detail: error.error})
    })
  }

  getIsAuth() {
    return this.isAuth
  }

}
