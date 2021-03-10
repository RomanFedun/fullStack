import {Injectable} from "@angular/core";
import {OrderPosition} from "../shared/interfaces";
import {Position} from "../shared/interfaces";
import {MaterialService} from "../shared/classes/MaterialService";

@Injectable()

export class OrderService {

  public list: OrderPosition[] = []
  public price = 0

 add(position: Position) {
   const orderPosition: OrderPosition = Object.assign({}, {
       name: position.name,
       cost: position.cost,
       quantity: position.quantity,
       _id: position._id
     }
   )

   let candidate = this.list.find(p => p._id === orderPosition._id)

   if (candidate) {
     // @ts-ignore
     candidate.quantity += orderPosition.quantity
   } else {

     this.list.push(orderPosition)
   }
   this.computedPrice()
 }

 remove(itemPosition: OrderPosition) {
    let idx = this.list.findIndex(item => item._id === itemPosition._id)
    this.list.splice(idx, 1)
    this.computedPrice()
   MaterialService.toast('deleted from Order')
 }

 clear() {
    this.list = []
   this.price = 0
 }

  private computedPrice() {
    this.price = this.list.reduce((total, item) => {
      // @ts-ignore
      return total += item.cost * item.quantity
    },0)
  }
}
