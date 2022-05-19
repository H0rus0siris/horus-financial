import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import {AccordionModule} from 'primeng/accordion';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ConfirmationService} from 'primeng/api';
import {InputNumberModule} from 'primeng/inputnumber';
import {TooltipModule} from 'primeng/tooltip';
import {DividerModule} from 'primeng/divider';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import {PasswordModule} from 'primeng/password';
import { AuthGuard } from './services/auth.guard';
import { JWTInterceptor } from './services/jwt.interceptor';

const routes: Routes = [
  {path: '', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  {path: '**', redirectTo: ''}
]



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    AccordionModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    TableModule,
    ConfirmPopupModule,
    InputNumberModule,
    TooltipModule,
    DividerModule,
    ConfirmDialogModule,
    PasswordModule
  ],
  providers: [MessageService, ConfirmationService, { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
