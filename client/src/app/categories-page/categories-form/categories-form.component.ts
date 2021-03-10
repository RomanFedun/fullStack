import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/MaterialService";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {


  @ViewChild('input') inputRef: ElementRef |any

  form: FormGroup | any
  image: File | any
  imagePreview: any = ''
  isNew: boolean = true
  category: Category | any

  constructor(private route: ActivatedRoute,
              private categoryService: CategoriesService,
              private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params:Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoryService.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category | any)  => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  onSubmit() {
    let obs$

    this.form.disable()
    if (this.isNew) {
      //method create
     obs$ = this.categoryService.create(this.form.value.name, this.image)
    } else {
      //method update
     obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category= category
        MaterialService.toast('changes are update')
        this.form.enable()
      } ,
    error => {
        MaterialService.toast(error.error.message)
      this.form.enable()
    }
    )
  }

  deleteCategory() {
    const decision = window.confirm(`you want to delete ${this.category.name}?`)
    if (decision) {
      this.categoryService.delete(this.category._id).subscribe(

          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories']),
      )
    }
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    this.image = event.target.files[0]


    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(this.image)
  }
}
