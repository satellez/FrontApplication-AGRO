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
import { PaymentMethodService } from 'src/app/services/payment-method.service';
import { PaymentMethod } from 'src/app/interfaces/PaymentMethodInterface';

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
  templateUrl: './payment-methods.component.html',
})
export class AppPaymentMethodComponent implements OnInit {
  displayedPaymentMethodsColumns: string[] = [
    'id',
    'methodName',
    'actions',
  ];
  paymentMethodsList: PaymentMethod[] = [];
  myCPaymentMethod: PaymentMethod | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private paymentMethodService: PaymentMethodService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paymentMethodService.getPaymentMethodsList().subscribe((payments) => {
      this.paymentMethodsList = payments;
      this.cdr.detectChanges();
    });
  }

  openDialog() {
    this.dialog.open(CreatePaymentMethodDialog, {
      width: '600px',
    });
  }

  updatePaymentMethod(payment: PaymentMethod) {
    this.dialog.open(EditPaymentMethodDialog, {
      width: '600px',
      data: payment,
    });
  }

  deletePaymentMethod(paymentM: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este medio de pago?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentMethodService.deletePaymentMethod(paymentM).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El medio de pago ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadPaymentMethodsList();
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el medio de pago.',
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

  reloadPaymentMethodsList() {
    this.paymentMethodService.getPaymentMethodsList().subscribe((payment) => {
      this.paymentMethodsList = payment;
    });
  }
}

@Component({
  selector: 'create-payment-method',
  templateUrl: 'create-payment-method.html',
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
export class CreatePaymentMethodDialog implements OnInit {
  hide = true;
  maxDate: Date;
  paymentMethodList: PaymentMethod[] = [];
  newPaymentMethodPoint: PaymentMethod | null;

  constructor(
    private paymentMethodService: PaymentMethodService,
    public dialogRef: MatDialogRef<CreatePaymentMethodDialog>
  ) {}

  ngOnInit(): void {  }

  paymentMethodForm = new FormGroup({
    paymentName: new FormControl('', [Validators.required]),
  });

  submitPaymentMethod() {
    if (this.paymentMethodForm.valid) {
      let newPayment: PaymentMethod = {
        method_id: 0,
        method_name: this.paymentMethodForm.controls['paymentName'].value ?? '',
        isDeleted: false,
      };
      this.paymentMethodService.setPaymentMethod(newPayment).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Medio de pago Creado!',
            text: 'La información del medio de pago ha sido guardada correctamente.',
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
            text: 'Ocurrió un error al crear el Medio de Pago.',
            icon: 'error',
          });
        },
      });
    } else {
      console.error('Formulario no es válido');
    }
  }
}

@Component({
  selector: 'edit-payment-method',
  templateUrl: 'edit-payment-method.html',
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
export class EditPaymentMethodDialog implements OnInit {
  hide = true;
  maxDate: Date;
  paymentId: number = 0;
  paymentMethodList: PaymentMethod[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditPaymentMethodDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentMethod,
    private paymentMethodService: PaymentMethodService
  ) {}

  paymentMethodForm = new FormGroup({
    paymentName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.paymentMethodForm.patchValue({
      paymentName: this.data.method_name,
    });
  }

  submitPaymentMethodUpdate() {
    if (this.paymentMethodForm.valid) {
      this.paymentId = this.data.method_id;

      let paymentMethodUpdated: PaymentMethod = {
        method_id: this.data.method_id,
        method_name: this.paymentMethodForm.controls['paymentName'].value ?? '',
        isDeleted: false,
      };
      this.paymentMethodService
        .updatePaymentMethod(paymentMethodUpdated, this.data.method_id)
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Medio de pago actualizado!',
              text: 'La información del Medio de pago ha sido actualizada correctamente.',
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
              text: 'Ocurrió un error al actualizar el Medio de pago.',
              icon: 'error',
            });
          },
        });
    } else {
      console.error('Formulario no es válido');
    }
  }
}
