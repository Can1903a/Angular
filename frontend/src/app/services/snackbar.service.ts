import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
import { MESSAGES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, duration: number = 3000) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message },
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
  openProfileFailSnackBar(profileFailMessage:string,duration: number =3000)
  {
    this.snackBar.openFromComponent(SnackbarComponent,{
      data:{profileFailMessage: MESSAGES.profileFetchError},
      duration:duration,
      verticalPosition:'bottom',
      horizontalPosition:'center'
    });
  }
  openProductAdded(productAddedMessage:string,duration: number =3000)
  {
    this.snackBar.openFromComponent(SnackbarComponent,{
      data:{profileFailMessage: MESSAGES.productAdded},
      duration:duration,
      verticalPosition:'bottom',
      horizontalPosition:'center'
    });
  }
  openPorductFail(productFailMessage:string,duration: number =3000)
  {
    this.snackBar.openFromComponent(SnackbarComponent,{
      data:{profileFailMessage: MESSAGES.productNotAdded},
      duration:duration,
      verticalPosition:'bottom',
      horizontalPosition:'center'
    });
  }

}
