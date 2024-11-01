import { Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
    {path: 'orders/form', component: FormComponent},
    {path: 'orders/list', component: ListadoComponent},
    {path: '', redirectTo: '/orders/form', pathMatch: 'full'}
];
