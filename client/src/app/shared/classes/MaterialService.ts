import {ElementRef} from "@angular/core";

declare var M: any

export interface MaterialInterface {
  open?(): void
  close?(): void
  destroy?(): void
}

export interface MaterialDatePicker extends MaterialInterface{
  date?: Date
}

export class MaterialService {
  static toast(message: any) {
    M.toast({html: message})
  }



  //id from html is in "ref.nativeElement"
  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initDatePicker(ref: ElementRef, onClose: () => void) {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd. mm. yyyy',
      showClearBtn: true,
      onClose
    })
  }

  static initModal(ref: ElementRef): MaterialInterface {
    return  M.Modal.init(ref.nativeElement)
  }

  static initToolTip(ref: ElementRef): MaterialInterface {
    return M.Tooltip.init(ref.nativeElement)
  }

  static initTapTarget(ref: ElementRef): MaterialInterface{
    return M.TapTarget.init(ref.nativeElement)
  }
}
