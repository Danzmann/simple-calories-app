import { SweetAlertOptions } from 'sweetalert2'

export const getSuccessToastSwal = (text: string): SweetAlertOptions => ({
  text,
  icon: 'success',
  toast: true,
  timer: 3000,
  position: 'bottom-end',
  showConfirmButton: false,
  showCancelButton: false,
})

export const getErrorSwal = (text: string): SweetAlertOptions => ({
  icon: 'error',
  title: 'Error',
  text,
})