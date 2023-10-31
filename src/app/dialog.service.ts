import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  message: string = ""
  continueOption: string = ""
  closeOption: string = ""

  setMessage(mess: string, contOpt: string, closeOpt: string)
  {
    this.message = mess
    this.continueOption = contOpt
    this.closeOption = closeOpt
  }
}
