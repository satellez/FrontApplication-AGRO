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
import { UserType } from 'src/app/interfaces/UsersInterfaces';
import { UsersTypesService } from 'src/app/services/users-types.service';

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
  templateUrl: './users-types-table.component.html',
})
export class AppUserTypesComponent implements OnInit {
  displayedUserTypeColumns: string[] = [
    'id',
    'userTypeName',
    'actions',
  ];
  userTypesList: UserType[] = [];
  myCUserType: UserType | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private userTypeService: UsersTypesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userTypeService.getUsersTypesList().subscribe((userType) => {
      this.userTypesList = userType;
      this.cdr.detectChanges();
    });
  }

  openDialog() {
    this.dialog.open(CreateUserTypeDialog, {
      width: '600px',
    });
  }

  updateUserType(userType: UserType) {
    this.dialog.open(EditUsersTypeDialog, {
      width: '600px',
      data: userType,
    });
  }

  deleteUserType(docTypeId: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este Tipo de Usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userTypeService.deleteUsersType(docTypeId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El tipo de Usuario ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadUserTypesList();
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el tipo de usuario.',
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

  reloadUserTypesList() {
    this.userTypeService.getUsersTypesList().subscribe((userType) => {
      this.userTypesList = userType;
    });
  }
}

@Component({
  selector: 'create-users-types',
  templateUrl: 'create-users-types.html',
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
export class CreateUserTypeDialog implements OnInit {
  hide = true;
  userTypeList: UserType[] = [];
  newUserType: UserType | null;

  constructor(
    private userTypeServices: UsersTypesService,
    public dialogRef: MatDialogRef<CreateUserTypeDialog>
  ) {}

  ngOnInit(): void {  }

  userTypeForm = new FormGroup({
    userTypeName: new FormControl('', [Validators.required]),
  });

  submitUserType() {
    if (this.userTypeForm.valid) {
      let newUserType: UserType = {
        UserType_id: 0,
        UserType_name: this.userTypeForm.controls['userTypeName'].value ?? '',
        isDeleted: false,
      };
      this.userTypeServices.setUsersType(newUserType).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Tipo de Usuario Creado!',
            text: 'La información del Tipo de Usuario ha sido guardada correctamente.',
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
            text: 'Ocurrió un error al crear el Tipo de Usuario.',
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
  selector: 'edit-users-types',
  templateUrl: 'edit-users-types.html',
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
export class EditUsersTypeDialog implements OnInit {
  hide = true;
  userTypeId: number = 0;
  userTypeList: UserType[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditUsersTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserType,
    private userTypeService: UsersTypesService
  ) {}

  userTypeForm = new FormGroup({
    userTypeName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    console.log(this.data);
    
    this.userTypeForm.patchValue({
      userTypeName: this.data.UserType_name,
    });
  }

  submitUserTypeUpdate() {
    console.log("Hola");
    console.log(this.userTypeForm.valid);
    
    
    if (this.userTypeForm.valid) {
      this.userTypeId = this.data.UserType_id;

      let userTypeUpdated: UserType = {
        UserType_id: this.data.UserType_id,
        UserType_name: this.userTypeForm.controls['userTypeName'].value ?? '',
        isDeleted: false,
      };

      console.log(userTypeUpdated);
      
      this.userTypeService
        .updateUsersType(userTypeUpdated, this.data.UserType_id)
        .subscribe({
          next: (response) => {
            console.log(response);
            
            Swal.fire({
              title: '¡Tipo de Usuario actualizado!',
              text: 'La información del Tipo de Usuario ha sido actualizada correctamente.',
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
              text: 'Ocurrió un error al actualizar el Tipo de Usuario.',
              icon: 'error',
            });
          },
        });
    } else {
      console.error('Formulario no es válido');
    }
  }
}
