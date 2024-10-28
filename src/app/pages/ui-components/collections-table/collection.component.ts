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
import { Collection } from 'src/app/interfaces/CollectionInterfaces';
import { CollectionService } from 'src/app/services/collection.service';

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
  templateUrl: './collection.component.html',
})
export class AppCollectionComponent implements OnInit {
  displayedCollectionColumns: string[] = [
    'id',
    'pointName',
    'address',
    'actions',
  ];
  collectionsList: Collection[] = [];
  myCCollection: Collection | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private collectionService: CollectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.collectionService.getCollectionsList().subscribe((collectionList) => {
      this.collectionsList = collectionList;
      this.cdr.detectChanges();
    });
  }

  openDialog() {
    this.dialog.open(CreateCollectionDialog, {
      width: '600px',
    });
  }

  updateCollection(collection: Collection) {
    this.dialog.open(EditCollectionDialog, {
      width: '600px',
      data: collection,
    });
  }

  deleteCollection(collectionId: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este punto de recolección?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.collectionService.deleteCollection(collectionId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El punto de recolección ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadCollectionsList();
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el punto de recolección.',
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

  reloadCollectionsList() {
    this.collectionService.getCollectionsList().subscribe((collectionList) => {
      this.collectionsList = collectionList;
    });
  }
}

@Component({
  selector: 'create-collection',
  templateUrl: 'create-collection.html',
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
export class CreateCollectionDialog implements OnInit {
  hide = true;
  maxDate: Date;
  collectionList: Collection[] = [];
  newCollectionPoint: Collection | null;

  constructor(
    private collectionService: CollectionService,
    public dialogRef: MatDialogRef<CreateCollectionDialog>
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
  }

  collectionForm = new FormGroup({
    collectionName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  submitCollection() {
    if (this.collectionForm.valid) {
      let newCollection: Collection = {
        collectionPoint_id: 0,
        pointName: this.collectionForm.controls['collectionName'].value ?? '',
        address: this.collectionForm.controls['address'].value ?? '',
        isDeleted: false,
      };
      this.collectionService.setCollection(newCollection).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Punto de recolección Creado!',
            text: 'La información del punto de recolección ha sido guardada correctamente.',
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
            text: 'Ocurrió un error al actualizar el Punto de recolección.',
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
  selector: 'edit-collection',
  templateUrl: 'edit-collection.html',
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
export class EditCollectionDialog implements OnInit {
  hide = true;
  maxDate: Date;
  collectionId: number = 0;
  collectionsList: Collection[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditCollectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Collection,
    private collectionService: CollectionService
  ) {}

  collectionForm = new FormGroup({
    collectionName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.collectionForm.patchValue({
      collectionName: this.data.pointName,
      address: this.data.address,
    });
  }

  submitCollectionUpdate() {
    if (this.collectionForm.valid) {
      this.collectionId = this.data.collectionPoint_id;

      let newCollectionPoint: Collection = {
        collectionPoint_id: this.data.collectionPoint_id,
        pointName: this.collectionForm.controls['collectionName'].value ?? '',
        address: this.collectionForm.controls['address'].value ?? '',
        isDeleted: false,
      };
      this.collectionService
        .updateCollection(newCollectionPoint, this.data.collectionPoint_id)
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Punto de recolección actualizado!',
              text: 'La información del Punto de recolección ha sido actualizada correctamente.',
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
}
