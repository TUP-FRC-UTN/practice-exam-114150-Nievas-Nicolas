import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Product, ProductForm } from '../models/interfaces';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{
  private restService = inject(RestService);
  private router = inject(Router);

  availableProducts: ProductForm[] = [];

  orderForm: FormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    products: new FormArray([]),
  });

  // Getters de formArray
  get products(){
    return this.orderForm.controls['products'] as FormArray;
  }

  addProduct() {
    const product = new FormGroup({
      productId: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
      price: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      stock: new FormControl({ value: 0, disabled: true }, [Validators.required]),
    });
    this.products.push(product);
  }

  deleteProduct(index: number) {
    this.products.removeAt(index);
  }

  ngOnInit(): void {
    this.getProducts(); 
  }

  getProducts() {
    this.restService.getProducts().subscribe(products => {
      this.availableProducts = products;
    });
  }

  //Seleccionar producto y actualizar precio y stock en FormArray
  onProductSelect(index: number) {
    const productControl = this.products.at(index);
    const selectedProductId = productControl.get('productId')?.value;
    const selectedProduct = this.availableProducts.find(p => p.id === selectedProductId);

    if (selectedProduct) {
      productControl.patchValue({
        price: selectedProduct.price,
        stock: selectedProduct.stock
      });
    }
  }

  selectedProduct() {
    return this.products.controls.map(control => {
      const productId = control.get('productId')?.value;
      const product = this.availableProducts.find(p => p.id === productId);
      return {
        name: product?.name,
        quantity: control.get('quantity')?.value,
        price: control.get('price')?.value,
        stock: control.get('stock')?.value
      };
    });
  }

  calculateTotal(){
    const subtotal = this.products.controls.reduce((total, control) => {
      const price = control.get('price')?.value;
      const quantity = control.get('quantity')?.value;
      return total + (price * quantity);
    }, 0);

    return this.hasDiscount() ? subtotal * 0.9 : subtotal;
  }

  hasDiscount(){
    const subtotal = this.products.controls.reduce((total, control) => {
      const price = control.get('price')?.value || 0;
      const quantity = control.get('quantity')?.value || 0;
      return total + (price * quantity);
    }, 0);
    return subtotal > 1000;
  }

  //Se puede asi o con una linea de codigo en el onSubmit
  generateOrderCode(): string {
    const customerName = this.orderForm.get('customerName')?.value || '';
    const email = this.orderForm.get('email')?.value || '';
    const firstLetter = customerName[0]?.toUpperCase() || '';
    const emailSuffix = email.slice(-4);
    const timestamp = Date.now().toString();
    
    return `${firstLetter}${emailSuffix}${timestamp}`;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = {
        ...this.orderForm.value,
        total: this.calculateTotal(),
        timestamp: new Date().toISOString(),
        orderCode: this.generateOrderCode(),
        //orderCode: ${this.orderForm.get('customerName')?.value[0].toUpperCase()}.com${Date.now()}
      };
      
      this.restService.postOrder(orderData).subscribe(order => {
        console.log('Order submitted:', order);
        this.router.navigate(['/orders/list']);
      });
    }
  }
}
