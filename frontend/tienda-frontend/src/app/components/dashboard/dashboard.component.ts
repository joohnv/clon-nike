import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild('productForm', { static: false }) productForm: NgForm | undefined;
  isEditing: boolean = false;
  editedProductId: string | undefined = '';
  product: Product = {
    name: '',
    desc: '',
    price: 0,
    stock: 0,
  };
  image?: File;
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  //Cargar los productos
  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  //Crear un producto
  addProduct(product: Product, image?: File) {
    const formData = new FormData();

    // Verificar que el campo 'desc' esté en el objeto product
    console.log('Producto antes de enviar:', product);

    // Agregar propiedades al FormData
    Object.keys(product).forEach((key) => {
      formData.append(key as keyof Product, (product as any)[key]);
    });

    // Si hay imagen, agregarla
    if (image) {
      formData.append('image', image);
    }

    // Llamar al servicio para agregar el producto
    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Producto creado con éxito');
        this.loadProducts(); // Recargar productos
      },
      error: (err) => {
        console.error('Error al crear el producto', err);
      },
    });

    // Limpiar el formulario
    if (this.productForm) {
      this.productForm.reset(); 
    }

    // Limpiar el objeto product
    this.product = {
      name: '',
      desc: '',
      price: 0,
      stock: 0,
      image: '',
    };
  }

  //Editar un producto
  updateProduct(id: string | undefined, product: Product, image?: File) {
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, (product as any)[key]);
    });

    if (image) {
      formData.append('image', image);
    }

    this.productService.updateProduct(id, formData).subscribe(() => {
      this.loadProducts();
    });
  }

  //Eliminar un producto
  deleteProduct(id: string | undefined) {
    console.log("ID a eliminar: ", id);
    if (!id) {
      console.error('ID is undefined or null');
      return;
    }
    this.productService.deleteProduct(id).subscribe(
      (response) => {
        console.log('Producto eliminado con éxito');
        this.loadProducts();
      },
      (error) => {
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.image = file;
    }
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.editedProductId = product._id;
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedProductId = '';
    this.product = { name: '', desc: '', price: 0, stock: 0 };
    this.image = undefined;
  }
}
