import { Collection } from "./CollectionInterfaces";
import { User } from "./UsersInterfaces";

export interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  productCategories: ProductCategory;
  isDeleted: boolean;
}

export interface ProductCategory {
  category_id: number;
  category_name: string;
  isDeleted: boolean;
}

export interface ProductDetails {
  prodDeta_id: number;
  product_id: number;
  products: Product;
  quantityStock: number;
  weigthPoundsPack: number;
  startingPrice: Number;
  minimunQuantity: number;
  user_id: number;
  users: User;
  collectionPoint_id: number;
  collections: Collection
  harvestDate: Date;
  isDeleted: boolean;
}
