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
import { CollectionService } from 'src/app/services/collection.service';
import { Collection } from 'src/app/interfaces/CollectionInterfaces';
import { Bill, BillDetails } from 'src/app/interfaces/BillsInterface';
import { BillService } from 'src/app/services/bill.service';
import { BillDetailsService } from 'src/app/services/bill-details.service';
import { PaymentMethod } from 'src/app/interfaces/PaymentMethodInterface';
import { PaymentMethodService } from 'src/app/services/payment-method.service';
import { Router } from '@angular/router';
import { ProductsServiceService } from 'src/app/services/products-service.service';

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
  templateUrl: './bill.component.html',
})
export class AppBillComponent implements OnInit {
  displayedBillColumns: string[] = [
    'id',
    'product_name',
    'category_id',
    'category_name',
    'actions',
  ];
  billsList: Bill[] = [];
  billsDetailsList: BillDetails[] = [];
  myCBill: Bill | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private billService: BillService,
    private billDetailsService: BillDetailsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.billService.getBillsList().subscribe((billsList) => {
      this.billsList = billsList;
      this.cdr.detectChanges();
      console.log(this.billsList);
    });
    // this.billDetailsService.getProductsDetailsList().subscribe((productDetailList) => {
    //   this.productsDetailsList = productDetailList;
    //   console.log(this.productsDetailsList);
    //   this.cdr.detectChanges();
    // });
  }

  openDialog() {
    let dialogRef = this.dialog.open(CreateBillDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if ((!result?.completed && result?.createdBillId) || !result) {
        console.log('inside if');
        let billId = result?.createdBillId
          ? result.createdBillId
          : window.sessionStorage.getItem('billId');

        if (billId) {
          this.billService.deleteBill(billId).subscribe({
            next: () => console.log(`Bill ${billId} deleted successfully`),
            error: (err) => console.error('Error deleting bill:', err),
          });
        }

        window.sessionStorage.removeItem('billId');
      }
    });
  }

  updateBill(bill: Bill) {
    console.log(bill);

    this.dialog.open(EditBillDialog, {
      width: '600px',
      data: bill,
    });
  }

  deleteBill(billId: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta factura?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.billService.deleteBill(billId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'La factura ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar esta factura.',
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

  reloadBillsList() {
    this.billService.getBillsList().subscribe((billsList) => {
      this.billsList = billsList;
      console.log('Lista actualizada de billsList:', this.billsList);
    });
  }
}

@Component({
  selector: 'create-bill',
  templateUrl: 'create-bill.html',
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
export class CreateBillDialog implements OnInit {
  hide = true;
  maxDate: Date;
  billsList: Bill[] = [];
  myCBill: Bill | null;
  public createdBillId: number = 0;
  paymentMethodList: PaymentMethod[];
  userId: number;
  productsList: Product[];

  constructor(
    private billService: BillService,
    private billsDetailsService: BillDetailsService,
    private paymentMethodService: PaymentMethodService,
    private productsService: ProductsServiceService,
    public dialogRef: MatDialogRef<CreateBillDialog>,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();

    this.getPaymentMethodsList();

    if (!window.localStorage.getItem('user')) {
      this.router.navigate(['/authentication/login']);
    } else {
      this.userId = parseInt(window.localStorage.getItem('user') ?? '');
    }

    this.getProductsList();
  }

  billForm = new FormGroup({
    methodId: new FormControl('', [Validators.required]),
  });

  billDetailsForm = new FormGroup({
    product: new FormControl('', [Validators.required]),
  });

  submitBill() {
    if (this.billForm.valid) {
      let newBill: Bill = {
        bill_id: 0,
        user_id: this.userId,
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
        method_id: parseInt(this.billForm.controls['methodId'].value ?? ''),
        paymentMethods: {
          method_id: 0,
          method_name: 'string',
          isDeleted: false,
        },
        purchase_date: new Date(),
        isDeleted: false,
      };

      this.billService.setBill(newBill).subscribe({
        next: (response) => {
          this.createdBillId = (response as Bill).bill_id;
          this.changeDetector.detectChanges();
          window.sessionStorage.setItem(
            'billId',
            this.createdBillId.toString()
          );
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

  submitBillsDetails() {
    if (this.billDetailsForm.valid) {
      let newBillDetails: BillDetails = {
        billDeta_id: 0,
        bill_id: this.createdBillId,
        bills: {
          bill_id: 0,
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
          method_id: 0,
          paymentMethods: {
            method_id: 0,
            method_name: 'string',
            isDeleted: false,
          },
          purchase_date: new Date(),
          isDeleted: false,
        },
        product_id: parseInt(
          this.billDetailsForm.controls['product'].value ?? ''
        ),
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
        isDeleted: false,
      };
      this.billsDetailsService.setBillsDetails(newBillDetails).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire({
            title: '¡Factura Creada!',
            text: 'La información de la factura ha sido guardada correctamente.',
            icon: 'success',
          }).then(() => {
            this.dialogRef.close({
              completed: true,
              createdBillId: this.createdBillId,
            });
            this.changeDetector.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error de validación:', error.error.errors);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar esta factura.',
            icon: 'error',
          });
        },
      });
    } else {
      this.dialogRef.close({
        completed: false,
        createdBillId: this.createdBillId,
      });
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

  getPaymentMethodsList() {
    this.paymentMethodService
      .getPaymentMethodsList()
      .subscribe((paymentList) => {
        this.paymentMethodList = paymentList;
        console.log(
          'Lista actualizada de paymentMethodList:',
          this.paymentMethodList
        );
      });
  }

  getProductsList() {
    this.productsService.getProductsList().subscribe((products) => {
      this.productsList = products;
      console.log('Lista actualizada de productsList:', this.productsList);
    });
  }
}

@Component({
  selector: 'edit-bill',
  templateUrl: 'edit-bill.html',
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
export class EditBillDialog implements OnInit {
  hide = true;
  maxDate: Date;
  billsList: Bill[] = [];
  Bill: Bill[] = [];
  paymentMethodList: PaymentMethod[];
  userId : number;

  constructor(
    public dialogRef: MatDialogRef<EditBillDialog>,
    private paymentMethodService: PaymentMethodService,
    @Inject(MAT_DIALOG_DATA) public data: Bill,
    private billsService: BillService,
    private router: Router
  ) {}

  billsForm = new FormGroup({
    paymentMethod: new FormControl<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - 18,
      new Date().getMonth(),
      new Date().getDate()
    );

    this.getProductsCategories();
    this.getPaymentMethodsList();

    this.billsForm.patchValue({
      paymentMethod: this.data.bill_id,
    });

    if (!window.localStorage.getItem('user')) {
      this.router.navigate(['/authentication/login']);
    } else {
      this.userId = parseInt(window.localStorage.getItem('user') ?? '');
    }
  }

  submitBillUpdate() {
    if (this.billsForm.valid) {
      
      let newBill: Bill = {
        bill_id: this.data.bill_id,
        user_id: this.userId,
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
        method_id: this.billsForm.controls['paymentMethod'].value ?? 0,
        paymentMethods: {
          method_id: 0,
          method_name: 'string',
          isDeleted: false,
        },
        purchase_date: this.data.purchase_date,
        isDeleted: false,
      };
      this.billsService.updateBill(newBill, this.data.bill_id).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Factura actualizada!',
            text: 'La información de la factura ha sido actualizada correctamente.',
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
            text: 'Ocurrió un error al actualizar La factura.',
            icon: 'error',
          });
        },
      });
    } else {
      console.error('Formulario no es válido');
    }
  }

  getProductsCategories() {
    this.billsService.getBillsList().subscribe((list) => {
      this.billsList = list;
      console.log('ProductCategories', this.billsList);
    });
  }

  getPaymentMethodsList() {
    this.paymentMethodService
      .getPaymentMethodsList()
      .subscribe((paymentList) => {
        this.paymentMethodList = paymentList;
        console.log(
          'Lista actualizada de paymentMethodList:',
          this.paymentMethodList
        );
      });
  }
}
