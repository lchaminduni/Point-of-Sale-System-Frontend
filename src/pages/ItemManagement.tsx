import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
} 
interface Item extends ItemType {
  quantity: number;
}

const ItemManagement: React.FC = () => {
  const { jwtToken } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/items/all', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log(items);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [jwtToken]);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      categoryId: categoryId,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      if (editMode && currentItemId) {
        await axios.put(`http://localhost:8080/items/update/${currentItemId}`, newItem,config);
        alert('Item updated successfully');
      } else {
        await axios.post('http://localhost:8080/items/additem', newItem,config);
        alert('Item added successfully');
      }
      fetchItems();
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response);
        alert(`Failed to save item. ${error.response.data.message || error.message}`);
      } else {
        console.error('Error:', error);
        alert('Failed to save item. Please check permissions or authentication.');
      }
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      console.log("JWT Token:", token); // Verify token in the console
      if (!token) {
        alert('Authentication token is missing');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:8080/items/delete/${id}`, config);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEditItem = (item: Item) => {
    setItemName(item.name);
    setItemPrice(item.price);
    setItemQuantity(item.quantity);
    setCategoryId(item.categoryId);
    setEditMode(true);
    setCurrentItemId(item.id);
  };

  const resetForm = () => {
    setItemName('');
    setItemPrice(0);
    setItemQuantity(0);
    setCategoryId(null);
    setEditMode(false);
    setCurrentItemId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Item Management</h1>
      <form onSubmit={handleSaveItem} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6 bg-white shadow-md rounded-lg p-4">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item Name"
          className="border rounded p-2 flex-1 focus:outline-none focus:border-blue-400"
          required
        />
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(parseFloat(e.target.value))}
          placeholder="Item Price"
          className="border rounded p-2 flex-1 focus:outline-none focus:border-blue-400"
          required
        />
        <input
          type="number"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(parseInt(e.target.value))}
          placeholder="Item Quantity"
          className="border rounded p-2 flex-1 focus:outline-none focus:border-blue-400"
          required
        />
        <input
          type="number"
          value={categoryId || ''}
          onChange={(e) => setCategoryId(parseInt(e.target.value))}
          placeholder="Category ID"
          className="border rounded p-2 flex-1 focus:outline-none focus:border-blue-400"
          required
        />
        <button type="submit" className={`p-2 rounded ${editMode ? 'bg-yellow-500' : 'bg-green-500'} text-white font-semibold transition duration-300 hover:bg-opacity-80`}>
          {editMode ? 'Update Item' : 'Add Item'}
        </button>
      </form>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white text-left">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Category ID</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-100 transition duration-300">
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.price}</td>
              <td className="py-2 px-4">{item.quantity}</td>
              <td className="py-2 px-4">{item.categoryId}</td>
              <td className="py-2 px-4">
                <button onClick={() => handleEditItem(item)} className="text-blue-500 hover:underline mr-2">
                  Edit
                </button>
                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemManagement;
