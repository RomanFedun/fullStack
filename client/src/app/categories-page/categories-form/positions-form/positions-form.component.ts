import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInterface, MaterialService} from "../../../shared/classes/MaterialService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {response} from "express";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string | any
  @ViewChild('modal') modalRef: ElementRef | any
  positions: Position[] = []
  modalName: string | any
  positionId: any = null
  loading: boolean = false
  modal: MaterialInterface | any
  form: FormGroup | any

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      cost: new  FormControl(1, [
        Validators.min(1), Validators.required
      ])
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
     this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.modalName = 'Edit'
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.modalName = 'Add'
    this.positionId = null
    this.form.reset({name: null, cost: 1})
    this.modal.open()
    MaterialService.updateTextInputs()
  }


  onClose() {
    this.modal.close()
  }

  OnSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          let idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('position has updated')
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('position has created')
          this.positions.push(position)
        },
        error => {
          this.form.enable()
          MaterialService.toast('error')
        },
        completed
      )
    }
  }


  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`do you want to delete position ${position.name}`)
    if (decision) {
      this.positionsService.delete(position).subscribe(
        response => {
          let idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => {
          MaterialService.toast(error.error.message)
        }
      )
    }
  }
}
