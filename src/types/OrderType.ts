interface OrderItem {
    itemId: number;
    quantity: number;
  }
  
  // Define the overall order structure
  export interface OrderType {
    items: OrderItem[];
  }