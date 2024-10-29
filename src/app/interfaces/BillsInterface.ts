import { PaymentMethod } from "./PaymentMethodInterface"
import { Product } from "./ProductsInterfaces"
import { User} from "./UsersInterfaces"

export interface Bill {
  bill_id: number,
  user_id: number,
  users: User,
  method_id: number,
  paymentMethods: PaymentMethod,
  purchase_date: Date,
  isDeleted: boolean,
}

export interface BillDetails {
  billDeta_id: number,
  bill_id: number,
  bills: Bill,
  product_id: number,
  products: Product,
  isDeleted: boolean,
}
