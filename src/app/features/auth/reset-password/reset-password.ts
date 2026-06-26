import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  readonly cargando = signal(false);
  readonly ocultarPassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    // El token llega por query param (enlace del correo); editable como respaldo.
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    const { token, password } = this.form.getRawValue();
    this.auth.resetPassword(token, password).subscribe({
      next: () => {
        this.snackBar.open('Contrasena actualizada. Inicia sesion.', 'Cerrar', {
          duration: 4000,
        });
        this.router.navigate(['/login']);
      },
      error: () => this.cargando.set(false),
    });
  }
}
