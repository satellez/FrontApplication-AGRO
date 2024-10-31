import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  Inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

import { UsersListService } from 'src/app/services/users-list.service';
import { User } from 'src/app/interfaces/UsersInterfaces';
import Swal from 'sweetalert2';
import {
  Product,
  ProductCategory,
  ProductDetails,
} from 'src/app/interfaces/ProductsInterfaces';
import { ProductsServiceService } from 'src/app/services/products-service.service';
import { CollectionService } from 'src/app/services/collection.service';
import { Collection } from 'src/app/interfaces/CollectionInterfaces';
import { ProductDetailsService } from 'src/app/services/product-details.service';

// table 1
export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  budget: number;
  priority: string;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
})
export class AppProductComponent implements OnInit {
  displayedProductColumns: string[] = [
    'id',
    'product_name',
    'category_id',
    'category_name',
    'actions',
  ];
  productsList: Product[] = [];
  productsDetailsList: ProductDetails[] = [];
  productsCatgories: ProductCategory[] = [];
  myCProduct: Product | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private productService: ProductsServiceService,
    private productDetailService : ProductDetailsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProductsList().subscribe((productsList) => {
      this.productsList = productsList;
      this.cdr.detectChanges();
    });
    this.productDetailService.getProductsDetailsList().subscribe((productDetailList) => {
      this.productsDetailsList = productDetailList;
      console.log(this.productsDetailsList);
      this.cdr.detectChanges();
    });
    
    this.getProductsCategories();
  }

  openDialog() {
    this.dialog.open(CreateProductDialog, {
      width: '600px',
    });
  }

  updateProduct(product: Product) {
    console.log(product);

    this.dialog.open(EditProductDialog, {
      width: '600px',
      data: product,
    });
  }

  deleteProduct(productId: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El producto ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadProductsList();
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el producto.',
              icon: 'error',
            });

            if (error.error.errors) {
              for (const key in error.error.errors) {
                if (error.error.errors.hasOwnProperty(key)) {
                  console.log(
                    `Error en el campo ${key}:`,
                    error.error.errors[key]
                  );
                }
              }
            }
          },
        });
      }
    });
  }

  reloadProductsList() {
    this.productService.getProductsList().subscribe((productsList) => {
      this.productsList = productsList;
      console.log('Lista actualizada de productsList:', this.productsList);
    });
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
      });
  }
}

@Component({
  selector: 'create-product',
  templateUrl: 'create-product.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductDialog implements OnInit {
  hide = true;
  maxDate: Date;
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];
  myCProduct: Product | null;
  public createdProductId: number = 0;
  collectionsList: Collection[];

  constructor(
    private productService: ProductsServiceService,
    private collectionsService: CollectionService,
    public dialogRef: MatDialogRef<CreateProductDialog>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.getProductsCategories();
    this.getCollectionsList();
  }

  productForm = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
  });

  productDetailsForm = new FormGroup({
    stock: new FormControl('', [Validators.required]),
    weigthPoundsPack: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [Validators.required]),
    minimunQuantity: new FormControl('', [Validators.required]),
    collectionPoint: new FormControl('', [Validators.required]),
    harvestDate: new FormControl('', [Validators.required]),
  });

  submitProduct() {
    if (this.productForm.valid) {
      let newProduct: Product = {
        product_id: 0,
        product_name: this.productForm.controls['productName'].value ?? '',
        category_id: this.productForm.controls['categoryId'].value
          ? parseInt(this.productForm.controls['categoryId'].value)
          : 0,
        productCategories: {
          category_id: 0,
          category_name: '',
          isDeleted: false,
        },
        isDeleted: false,
      };
      this.productService.setProduct(newProduct).subscribe({
        next: (response) => {
          console.log(response);
          this.createdProductId = (response as Product).product_id;
          console.log(this.createdProductId);
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error('Error de validación:', error.error.errors);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el producto.',
            icon: 'error',
          });
        },
      });
    } else {
      console.error('Formulario no es válido');
    }
  }

  submitProductDetails() {
    console.log(this.productDetailsForm);

    if (this.productDetailsForm.valid) {
      let harvestFormatDate = new Date(
        this.productDetailsForm.controls['harvestDate'].value ?? this.maxDate
      );
      let unformattedPrice = this.removeCurrencyFormatting(
        this.productForm.get('startingPrice')?.value ?? '0'
      );
      let newProductDetails: ProductDetails = {
        prodDeta_id: 0,
        product_id: this.createdProductId,
        products: {
          product_id: 0,
          product_name: 'string',
          category_id: 0,
          productCategories: {
            category_id: 0,
            category_name: 'string',
            isDeleted: false,
          },
          isDeleted: false,
        },
        quantityStock: this.productDetailsForm.controls['stock'].value
          ? parseInt(this.productDetailsForm.controls['stock'].value)
          : 0,
        weigthPoundsPack: this.productDetailsForm.controls['weigthPoundsPack']
          .value
          ? parseInt(this.productDetailsForm.controls['weigthPoundsPack'].value)
          : 0,
        startingPrice: parseInt(unformattedPrice),
        minimunQuantity: this.productDetailsForm.controls['minimunQuantity']
          .value
          ? parseInt(this.productDetailsForm.controls['minimunQuantity'].value)
          : 0,
        user_id: 1,
        users: {
          user_id: 0,
          names: 'string',
          last_names: 'string',
          email: 'string',
          document_number: 'string',
          username: 'string',
          password: 'string',
          born_date: '2024-10-27T19:38:47.562Z',
          UserType_id: 0,
          userTypes: {
            UserType_id: 0,
            UserType_name: 'string',
            isDeleted: true,
          },
          document_id: 0,
          documents: {
            document_id: 0,
            document_name: 'string',
            isDeleted: true,
          },
          date: new Date(),
          modified: new Date(),
          modifiedBy: 'string',
          isDeleted: false,
        },
        collectionPoint_id: this.productDetailsForm.controls['collectionPoint']
          .value
          ? parseInt(this.productDetailsForm.controls['collectionPoint'].value)
          : 0,
        collections: {
          collectionPoint_id: 0,
          pointName: 'string',
          address: 'string',
          isDeleted: false,
        },
        harvestDate: harvestFormatDate,
        isDeleted: false,
      };
      this.productService.setProductDetails(newProductDetails).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire({
            title: '¡Usuario Creado!',
            text: 'La información del usuario ha sido guardada correctamente.',
            icon: 'success',
          }).then(() => {
            this.dialogRef.close(true);
            this.changeDetector.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error de validación:', error.error.errors);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el producto.',
            icon: 'error',
          });
        },
      });
    } else {
      console.error('Formulario no es válido');
    }
  }

  formatCurrencyInput(event: any) {
    let value = event.target.value;

    // Eliminar todos los caracteres no numéricos
    value = value.replace(/\D/g, '');

    // Si el campo está vacío, no formatear
    if (value) {
      // Aplicar formato de moneda sin decimales
      value = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseInt(value));
    }

    // Asignar el valor formateado al campo
    event.target.value = value;
  }

  removeCurrencyFormatting(value: string): string {
    return value.replace(/[^\d.-]/g, '');
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
        console.log('ProductCategories', this.productsCatgories);
      });
  }

  getCollectionsList() {
    this.collectionsService.getCollectionsList().subscribe((collectionList) => {
      this.collectionsList = collectionList;
      console.log(
        'Lista actualizada de collectionsList:',
        this.collectionsList
      );
    });
  }
}

@Component({
  selector: 'edit-product',
  templateUrl: 'edit-product.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductDialog implements OnInit {
  hide = true;
  maxDate: Date;
  productId: number = 0;
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productService: ProductsServiceService
  ) {}

  productForm = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    categoryId: new FormControl<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - 18,
      new Date().getMonth(),
      new Date().getDate()
    );

    this.getProductsCategories();

    this.productForm.patchValue({
      productName: this.data.product_name,
      categoryId: this.data.category_id,
    });
  }

  submitProductUpdate() {
    if (this.productForm.valid) {
      this.productId = this.data.product_id;

      let newProduct: Product = {
        product_id: this.data.product_id,
        product_name: this.productForm.controls['productName'].value ?? '',
        category_id: this.productForm.controls['categoryId'].value
          ? this.productForm.controls['categoryId'].value
          : 0,
        productCategories: {
          category_id: 0,
          category_name: '',
          isDeleted: false,
        },
        isDeleted: false,
      };
      this.productService
        .updateProduct(newProduct, this.data.product_id)
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Producto actualizado!',
              text: 'La información del Producto ha sido actualizada correctamente.',
              icon: 'success',
            }).then(() => {
              this.dialogRef.close(true);
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al actualizar el Producto.',
              icon: 'error',
            });
          },
        });
    } else {
      console.error('Formulario no es válido');
    }
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
        console.log('ProductCategories', this.productsCatgories);
      });
  }
}
