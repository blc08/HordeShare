import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Szolgáltatások
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
  ]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  usernameAvailable = true;
  usernameCheckInProgress = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { 
      validators: this.passwordMatchValidator 
    });

    // Felhasználónév egyediségének ellenőrzése, amikor változik
    this.signupForm.get('username')?.valueChanges.subscribe(username => {
      if (username && username.length >= 3) {
        this.checkUsernameAvailability(username);
      } else {
        this.usernameAvailable = true;
      }
    });
  }

  async checkUsernameAvailability(username: string) {
    this.usernameCheckInProgress = true;
    try {
      const isAvailable = await this.userService.isUsernameAvailable(username);
      this.usernameAvailable = isAvailable;
      
      if (!isAvailable) {
        this.signupForm.get('username')?.setErrors({ notAvailable: true });
      }
    } catch (error) {
      console.error('Hiba a felhasználónév ellenőrzésekor:', error);
    } finally {
      this.usernameCheckInProgress = false;
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      try {
        const { email, password, firstName, lastName, username } = this.signupForm.value;
        const displayName = `${firstName} ${lastName}`;
        
        // 1. Felhasználó létrehozása Firebase Auth-ban
        const userCredential = await this.authService.signUp(email, password);
        
        // 2. Profil frissítése a teljes névvel
        await this.authService.updateUserProfile(displayName);
        
        // 3. Felhasználói adatok létrehozása a Firestore-ban
        await this.userService.createNewUser(
          userCredential.user.uid,
          username,
          email
        );
        
        // 4. Bejelentkezés állapot frissítése
        this.authService.updateLoginStatus(true);
        
        // 5. Sikeres regisztráció üzenet
        this.snackBar.open('Sikeres regisztráció! Átirányítás a bejelentkezéshez...', 'Bezár', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        
        // 6. Átirányítás a bejelentkezéshez
        void this.router.navigate(['/login']);
      } catch (error: any) {
        console.error('Hiba a regisztráció során:', error);
        
        let errorMessage = 'Hiba történt a regisztráció során. Kérjük, próbálja újra.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Ez az e-mail cím már használatban van.';
        }
        
        this.snackBar.open(errorMessage, 'Bezár', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      } finally {
        this.isLoading = false;
      }
    } else {
      this.validateAllFormFields(this.signupForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Ez a mező kötelező';
    }
    
    if (controlName === 'email' && control?.hasError('email')) {
      return 'Kérjük, adjon meg egy érvényes e-mail címet';
    }
    
    if (controlName === 'username') {
      if (control?.hasError('minlength')) {
        return 'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie';
      }
      if (control?.hasError('notAvailable')) {
        return 'Ez a felhasználónév már foglalt';
      }
    }
    
    if (controlName === 'password') {
      if (control?.hasError('minlength')) {
        return 'A jelszónak legalább 8 karakter hosszúnak kell lennie';
      }
      if (control?.hasError('pattern')) {
        return 'A jelszónak tartalmaznia kell nagybetűt, kisbetűt, számot és speciális karaktert';
      }
    }
    
    if (controlName === 'confirmPassword' && control?.hasError('passwordMismatch')) {
      return 'A jelszavak nem egyeznek';
    }
    
    return '';
  }
}