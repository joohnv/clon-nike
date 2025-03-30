import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [HttpClient]  
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  carrito: any[] = []; 
  mensajeStock: string = '';

  constructor(private http: HttpClient, private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.loadProducts();
  }

  //Cargar los productos
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addProduct(product: Product, cantidad: number){
    // this.productService.checkProductStock(product, cantidad).subscribe(stock => {
    //   if(stock){
    //     this.carrito.push({product, cantidad});
    //     this.mensajeStock = '';
    //   }else{
    //     this.mensajeStock = "No hay suficiente stock disponible";
    //   }
    // })
    this.cartService.addToCart(product);
    alert('Producto añadido al carrito');
  }
}
