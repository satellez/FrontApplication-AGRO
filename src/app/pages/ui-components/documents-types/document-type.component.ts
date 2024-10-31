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
import { DocumentsTypes } from 'src/app/interfaces/DocumentsTypesInterface';
import { DocumentTypesService } from 'src/app/services/document-types.service';

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
  templateUrl: './document-types-table.component.html',
})
export class AppDocumentsTypesComponent implements OnInit {
  displayedDocumentTypeColumns: string[] = [
    'id',
    'docName',
    'actions',
  ];
  documentsTypesList: DocumentsTypes[] = [];
  myCDocumentType: DocumentsTypes | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private documentTypeService: DocumentTypesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.documentTypeService.getDocumentsList().subscribe((docType) => {
      this.documentsTypesList = docType;
      this.cdr.detectChanges();
    });
  }

  openDialog() {
    this.dialog.open(CreateDocumentTypeDialog, {
      width: '600px',
    });
  }

  updateDocumentType(docType: DocumentType) {
    this.dialog.open(EditDocumentTypeDialog, {
      width: '600px',
      data: docType,
    });
  }

  deleteDocumentType(docTypeId: number) {
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
        this.documentTypeService.deleteDocumentType(docTypeId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El medio de pago ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadDocumentTypesList();
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

  reloadDocumentTypesList() {
    this.documentTypeService.getDocumentsList().subscribe((docType) => {
      this.documentsTypesList = docType;
    });
  }
}

@Component({
  selector: 'create-document-type',
  templateUrl: 'create-document-type.html',
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
export class CreateDocumentTypeDialog implements OnInit {
  hide = true;
  documentTypeList: DocumentsTypes[] = [];
  newDocumentType: DocumentsTypes | null;

  constructor(
    private documentTypeService: DocumentTypesService,
    public dialogRef: MatDialogRef<CreateDocumentTypeDialog>
  ) {}

  ngOnInit(): void {  }

  documentType = new FormGroup({
    docName: new FormControl('', [Validators.required]),
  });

  submitDocumentType() {
    if (this.documentType.valid) {
      let newDocType: DocumentsTypes = {
        document_id: 0,
        document_name: this.documentType.controls['docName'].value ?? '',
        isDeleted: false,
      };
      this.documentTypeService.setDocumentType(newDocType).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Tipo de Documento Creado!',
            text: 'La información del Tipo de Documento ha sido guardada correctamente.',
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
            text: 'Ocurrió un error al crear el Tipo de Documento.',
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
  selector: 'edit-document-type',
  templateUrl: 'edit-document-type.html',
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
export class EditDocumentTypeDialog implements OnInit {
  hide = true;
  docTypeId: number = 0;
  documentTypeList: DocumentsTypes[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditDocumentTypeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentsTypes,
    private documentTypeService: DocumentTypesService
  ) {}

  documentTypeForm = new FormGroup({
    docName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.documentTypeForm.patchValue({
      docName: this.data.document_name,
    });
  }

  submitDocumentTypeUpdate() {
    if (this.documentTypeForm.valid) {
      this.docTypeId = this.data.document_id;

      let documentTypeUpdated: DocumentsTypes = {
        document_id: this.data.document_id,
        document_name: this.documentTypeForm.controls['docName'].value ?? '',
        isDeleted: false,
      };
      this.documentTypeService
        .updateDocumentType(documentTypeUpdated, this.data.document_id)
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Tipo de Documento actualizado!',
              text: 'La información del Tipo de Documento ha sido actualizada correctamente.',
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
              text: 'Ocurrió un error al actualizar el Tipo de Documento.',
              icon: 'error',
            });
          },
        });
    } else {
      console.error('Formulario no es válido');
    }
  }
}
