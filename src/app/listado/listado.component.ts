import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { Order } from '../models/interfaces';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css',
  providers: [RestService]
})
export class ListadoComponent implements OnInit{
  ordersList: Order[] = [];
  searchOrders = new FormControl('');

  private restService = inject(RestService);
  private router = inject(Router);

  ngOnInit() {
    this.getOrders();
    //this.setupSearchSubscription();
  }

  getOrders() {
    this.searchOrders.valueChanges.subscribe( data => {
      if (data === null || data === ''){
        this.getOrders();
      }
      this.ordersList = this.ordersList.filter(
        x => x.customerName.toLowerCase().includes(data!.toLowerCase()) || 
             x.email.toUpperCase().includes(data!.toUpperCase()) ||
             x.orderCode.toLowerCase().includes(data!.toLowerCase()) 
      )
    })
    this.restService.getOrders().subscribe(orders => {
      this.ordersList = orders;
    });
  }

  navigateToForm() {
    this.router.navigate(['/orders/form']);
  }
}
