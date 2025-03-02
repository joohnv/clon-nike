import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Necesario para el template

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Importar HttpClientModule aquí
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  productForm: FormGroup;
  selectedImage: File | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
      ]],
      desc: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.invalid || !this.selectedImage) {
      console.error('Formulario inválido o imagen no seleccionada');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('desc', this.productForm.get('desc')?.value);
    formData.append('type', this.productForm.get('type')?.value);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    this.http.post('http://localhost:3000/products', formData).subscribe(
      (response) => {
        console.log('Producto subido con éxito:', response);
        this.productForm.reset();
        this.selectedImage = undefined;
      },
      (error) => {
        console.error('Error al subir el producto:', error);
      }
    );
  }
}
