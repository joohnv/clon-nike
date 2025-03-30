import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //url de la api
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  // Función para obtener los encabezados de autorización
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Recupera el token del localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`); 
  }

  //Metodo GET
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  //Obtener solo por el ID
  getProductByID(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${id}`);
  }

  //Metodo POST
  addProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  //Metodo UPDATE/PUT
  updateProduct(
    id: string | undefined,
    formData: FormData
  ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  //Metodo DELETE
  deleteProduct(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  //verificar el stock del producto
  checkProductStock(product: Product, quantity: number): Observable<boolean> {
    if (product.stock >= quantity) {
      const stockOriginal = product.stock;
      product.stock -= quantity;

      //actulizar product
      return this.http
        .put(
          `${this.apiUrl}/${product._id}/update-stock`,
          this.productToFormData(product),
          { headers: this.getAuthHeaders() }
        )
        .pipe(
          map(() => {
            setTimeout(() => {
              this.revertStock(product, stockOriginal);
            }, 15000);
            return true;
          })
        );
    } else {
      return of(false);
    }
  }

  //revertir stock si no se compra en 15 seg
  revertStock(product: Product, stockOriginal: number) {
    product.stock = stockOriginal;
    this.http
      .put(
        `${this.apiUrl}/${product._id}/update-stock`,
        this.productToFormData(product),
        { headers: this.getAuthHeaders() }
      )
      .subscribe(() => {
        console.log('Stock revertido');
      });
  }

  //funcion para convertir un producto a formdata
  private productToFormData(product: Product): FormData {
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      formData.append(key, (product as any)[key]);
    });
    return formData;
  }
}
