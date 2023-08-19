export interface ICartItem {
  drugName: string;
  quantity: number;
  price: number;
  id: number;
  isAvailable: boolean;
  totalPrice:number;
  expireDate: Date;
}
