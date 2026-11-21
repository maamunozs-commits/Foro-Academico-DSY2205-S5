import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const conTexto: ValidatorFn = campo =>
  typeof campo.value === 'string' && campo.value.trim() ? null : { required: true };

export const correoValido = [Validators.required, Validators.email, Validators.maxLength(150)];
export const nombreValido = [conTexto, Validators.maxLength(100)];
export const claveValida = [
  Validators.required, Validators.minLength(10), Validators.maxLength(64),
  Validators.pattern(/^(?=.*\p{L})(?=.*[0-9])(?=.*[^\p{L}0-9\s]).+$/u),
];

export function maximoBytes(limite: number): ValidatorFn {
  return campo => new TextEncoder().encode(campo.value ?? '').length <= limite ? null : { maximoBytes: true };
}

export function coinciden(clave: string, confirmacion: string): ValidatorFn {
  return grupo => {
    const original = grupo.get(clave)?.value;
    const repetida = grupo.get(confirmacion)?.value;
    return original === repetida ? null : { noCoincide: true };
  };
}

export function error(campo: AbstractControl, nombre: string): string {
  const errores: ValidationErrors | null = campo.errors;
  if ((!campo.touched && !campo.dirty) || !errores) return '';
  if (errores['required']) return 'Este campo es obligatorio.';
  if (errores['email']) return 'Ingresa un correo válido.';
  if (errores['minlength']) return 'Usa al menos 10 caracteres.';
  if (errores['maxlength']) return nombre + ' admite hasta ' + errores['maxlength'].requiredLength + ' caracteres.';
  if (errores['maximoBytes']) return 'Reduce el texto para que se pueda guardar.';
  if (errores['pattern']) return 'Incluye una letra, un número y un carácter especial.';
  return 'Revisa este valor.';
}
