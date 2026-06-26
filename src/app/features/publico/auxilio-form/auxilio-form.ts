import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuxilioService } from '../../../core/services/auxilio.service';
import {
  NIVELES_EMERGENCIA,
  MOTIVOS_AYUDA,
  NivelEmergencia,
  MotivoAyuda,
} from '../../../core/models/auxilio.model';

@Component({
  selector: 'app-auxilio-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './auxilio-form.html',
  styleUrl: './auxilio-form.scss',
})
export class AuxilioForm {
  private readonly fb = inject(FormBuilder);
  private readonly auxilioService = inject(AuxilioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<AuxilioForm>);

  readonly enviando = signal(false);
  readonly enviado = signal(false);

  readonly niveles = NIVELES_EMERGENCIA;
  readonly motivos = MOTIVOS_AYUDA;

  readonly form = this.fb.nonNullable.group({
    contacto_nombre: ['', [Validators.required, Validators.maxLength(120)]],
    contacto_telefono: ['', [Validators.required, Validators.maxLength(30)]],
    contacto_email: ['', [Validators.email]],
    ciudad: [''],
    nivel_emergencia: ['', [Validators.required]],
    motivo: [''],
    descripcion: [''],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.enviando.set(true);
    this.auxilioService
      .crear({
        contacto_nombre: v.contacto_nombre,
        contacto_telefono: v.contacto_telefono,
        contacto_email: v.contacto_email || null,
        ciudad: v.ciudad || null,
        nivel_emergencia: v.nivel_emergencia as NivelEmergencia,
        motivo: (v.motivo as MotivoAyuda) || null,
        descripcion: v.descripcion || null,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.enviado.set(true);
          this.snackBar.open('Petición de ayuda registrada', 'Cerrar', { duration: 3500 });
        },
        error: () => this.enviando.set(false),
      });
  }

  cerrar(): void {
    this.dialogRef.close(this.enviado());
  }
}
