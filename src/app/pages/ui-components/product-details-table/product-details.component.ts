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

@Component({
  selector: 'app-product-details',
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
  templateUrl: './product-details.component.html',
})
export class AppProductDetailsComponent implements OnInit {
  displayedProductDetailsColumns: string[] = [
    'id',
    'product_name',
    'category_name',
    'quantityStock',
    'weigthPoundsPack',
    'startingPrice',
    'minimunQuantity',
    'pointName',
    'harvestDate',
    'actions',
  ];

  productsDetailsList: ProductDetails[] = [];
  productsCatgories: ProductCategory[] = [];
  myCProduct: Product | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private productService: ProductsServiceService,
    private productDetailService: ProductDetailsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productDetailService
      .getProductsDetailsList()
      .subscribe((productDetailList) => {
        this.productsDetailsList = productDetailList;
        this.cdr.detectChanges();
      });

    this.getProductsCategories();
  }

  openDialog() {
    this.dialog.open(CreateProductDetailsDialog, {
      width: '600px',
    });
  }

  updateProductDetails(product: ProductDetails) {
    this.dialog.open(EditProductDetailDialog, {
      width: '600px',
      data: product,
    });
  }

  deleteProductDetails(productId: number) {
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
        this.productDetailService.deleteProductDetail(productId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El producto ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadProductsDetailsList();
              this.cdr.detectChanges();
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

  reloadProductsDetailsList() {
    this.productDetailService
      .getProductsDetailsList()
      .subscribe((productsList) => {
        this.productsDetailsList = productsList;
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
  selector: 'create-product-details',
  templateUrl: 'create-product-details.html',
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
export class CreateProductDetailsDialog implements OnInit {
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
    public dialogRef: MatDialogRef<CreateProductDetailsDialog>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.getProductsCategories();
    this.getCollectionsList();
    this.productService.getProductsList().subscribe((productDetailList) => {
      this.productsList = productDetailList;
      this.changeDetector.detectChanges();
    });
  }

  productForm = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
  });

  productDetailsForm = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    weigthPoundsPack: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [Validators.required]),
    minimunQuantity: new FormControl('', [Validators.required]),
    collectionPoint: new FormControl('', [Validators.required]),
    harvestDate: new FormControl('', [Validators.required]),
  });

  submitProductDetails() {
    if (this.productDetailsForm.valid) {
      let harvestFormatDate = new Date(
        this.productDetailsForm.controls['harvestDate'].value ?? this.maxDate
      );
      let unformattedPrice = this.removeCurrencyFormatting(
        this.productDetailsForm.get('startingPrice')?.value ?? '0'
      );
      let newProductDetails: ProductDetails = {
        prodDeta_id: 0,
        product_id: this.productDetailsForm.controls['productId'].value
          ? parseInt(this.productDetailsForm.controls['productId'].value)
          : 0,
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
        startingPrice: unformattedPrice,
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
          userType_id: 0,
          userTypes: {
            userType_id: 0,
            userType_name: 'string',
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
      console.log(newProductDetails);

      this.productService.setProductDetails(newProductDetails).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire({
            title: '¡Usuario Creado!',
            text: 'La información del usuario ha sido guardada correctamente.',
            icon: 'success',
          }).then(() => {
            this.dialogRef.close(true);
            window.location.reload()
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

    // Si el valor no está vacío, aplicamos el formato de moneda
    if (value) {
      // Convertir el valor a entero
      const numericValue = parseInt(value, 10);

      // Aplicar formato de moneda sin decimales
      value = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }

    // Asignar el valor formateado al campo
    event.target.value = value;
  }

  removeCurrencyFormatting(value: string): Number {
    console.log('value', value);

    console.log('formatting', Number(value.replace(/[^\d-]/g, '')));

    return Number(value.replace(/[^\d-]/g, ''));
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
  selector: 'edit-product-details',
  templateUrl: 'edit-product-details.html',
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
export class EditProductDetailDialog implements OnInit {
  hide = true;
  maxDate: Date;
  productId: number = 0;
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];
  collectionsList: Collection[];

  constructor(
    public dialogRef: MatDialogRef<EditProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDetails,
    private productService: ProductsServiceService,
    private collectionsService: CollectionService,
    private productDetailService: ProductDetailsService,
    private cdr: ChangeDetectorRef
  ) {}

  productDetailsForm = new FormGroup({
    stock: new FormControl('', [Validators.required]),
    weigthPoundsPack: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [Validators.required]),
    minimunQuantity: new FormControl('', [Validators.required]),
    collectionPoint: new FormControl<number | null>(null, [
      Validators.required,
    ]),
    harvestDate: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.maxDate = new Date();

    this.getProductsCategories();

    this.productDetailsForm.patchValue({
      stock: this.data.quantityStock.toString(),
      weigthPoundsPack: this.data.weigthPoundsPack.toString(),
      startingPrice: this.data.startingPrice.toString(),
      minimunQuantity: this.data.minimunQuantity.toString(),
      collectionPoint: this.data.collectionPoint_id,
      harvestDate: this.data.harvestDate.toString(),
    });

    this.getCollectionsList();
    this.productService.getProductsList().subscribe((productDetailList) => {
      this.productsList = productDetailList;
      console.log(this.productsList);
      this.cdr.detectChanges();
    });
  }

  submitProductDetails() {
    console.log(this.productDetailsForm.value);

    if (this.productDetailsForm.valid) {
      this.productId = this.data.product_id;

      let harvestFormatDate = new Date(
        this.productDetailsForm.controls['harvestDate'].value ?? this.maxDate
      );
      let unformattedPrice = this.removeCurrencyFormatting(
        this.productDetailsForm.get('startingPrice')?.value ?? '0'
      );
      let newProductDetails: ProductDetails = {
        prodDeta_id: this.data.prodDeta_id,
        product_id: this.data.product_id,
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
        startingPrice: unformattedPrice,
        minimunQuantity: this.productDetailsForm.controls['minimunQuantity']
          .value
          ? parseInt(this.productDetailsForm.controls['minimunQuantity'].value)
          : 0,
        user_id: this.data.user_id,
        users: {
          user_id: 0,
          names: 'string',
          last_names: 'string',
          email: 'string',
          document_number: 'string',
          username: 'string',
          password: 'string',
          born_date: '2024-10-27T19:38:47.562Z',
          userType_id: 0,
          userTypes: {
            userType_id: 0,
            userType_name: 'string',
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
        collectionPoint_id:
          this.productDetailsForm.controls['collectionPoint'].value ?? 0,
        collections: {
          collectionPoint_id: 0,
          pointName: 'string',
          address: 'string',
          isDeleted: false,
        },
        harvestDate: harvestFormatDate,
        isDeleted: false,
      };
      this.productDetailService
        .updateProductDetails(newProductDetails, this.data.prodDeta_id)
        .subscribe({
          next: (response) => {
            console.log(response);

            Swal.fire({
              title: '¡Producto actualizado!',
              text: 'La información del Producto ha sido actualizada correctamente.',
              icon: 'success',
            }).then(() => {
              this.dialogRef.close(true);
              this.cdr.detectChanges();
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

  getCollectionsList() {
    this.collectionsService.getCollectionsList().subscribe((collectionList) => {
      this.collectionsList = collectionList;
      console.log(
        'Lista actualizada de collectionsList:',
        this.collectionsList
      );
    });
  }

  formatCurrencyInput(event: any) {
    let value = event.target.value;

    // Eliminar todos los caracteres no numéricos
    value = value.replace(/\D/g, '');

    // Si el valor no está vacío, aplicamos el formato de moneda
    if (value) {
      // Convertir el valor a entero
      const numericValue = parseInt(value, 10);

      // Aplicar formato de moneda sin decimales
      value = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }

    // Asignar el valor formateado al campo
    event.target.value = value;
  }

  removeCurrencyFormatting(value: string): Number {
    console.log(Number(value.replace(/[^\d-]/g, '')));

    return Number(value.replace(/[^\d-]/g, ''));
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
