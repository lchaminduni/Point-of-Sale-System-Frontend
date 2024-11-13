// src/components/OrderForm.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { OrderType } from "../types/OrderType";

interface Item {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  orderedDateTime: string;
  totalPrice: number;
}

const POSManagement: React.FC = () => {
  const { jwtToken } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{ [itemId: number]: number }>({});

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/items/all', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders/all', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, [jwtToken]);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  const handlePlaceOrder = async () => {
    const orderItems = Object.entries(itemQuantities)
    .filter(([_, quantity]) => quantity > 0) // Filter out items with quantity 0 or less
    .map(([itemId, quantity]) => ({
      itemId: parseInt(itemId),
      quantity,
    }));

  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`, // Using jwtToken directly from useAuth
    },
  };

  const newOrder: OrderType = { items: orderItems }; // Structure matches typical API expectation

  try {
    await axios.post('http://localhost:8080/orders/add', newOrder, config);
    alert('Order placed successfully');
    fetchOrders(); // Refresh orders after placing a new one
    setItemQuantities({}); // Reset quantities after order placement
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order. Please check permissions or stock availability.');
  }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Order Management</h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Place Order</h2>
        {items.map((item) => (
          <div key={item.id} className="flex items-center mb-4">
            <span className="flex-1">{item.name}</span>
            <span className="flex-1">Rs. {item.price}</span>
            <input
              type="number"
              value={itemQuantities[item.id] || 0}
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              placeholder="Quantity"
              className="border rounded p-2 flex-1"
              min={0}
            />
          </div>
        ))}
        <button
          onClick={handlePlaceOrder}
          className="bg-green-500 text-white font-semibold p-2 rounded mt-4"
        >
          Place Order
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white text-left">
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Order Date</th>
            <th className="py-2 px-4">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-100 transition duration-300">
              <td className="py-2 px-4">{order.id}</td>
              <td className="py-2 px-4">{new Date(order.orderedDateTime).toLocaleString()}</td>
              <td className="py-2 px-4">Rs. {order.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default POSManagement;