import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface StockType {
  id: number;
  quantity: number;
  itemId: number;
}



const StockManagement: React.FC = () => {
  const { jwtToken } = useAuth();
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [itemId, setItemId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [currentStockId, setCurrentStockId] = useState<number | null>(null);

  
  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/stocks/all', {
          headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log(stocks)
      setStocks(response.data);
      
      //const modifiedStocks = response.data.map((stock: any) => ({
          //...stock,
          //itemId: stock.item ? stock.item.id: null
     //}));

      //console.log(modifiedStocks);
      //setStocks(modifiedStocks);
  } catch (error) {
      console.error('Error fetching stocks:', error);
  }
  };

  useEffect(() => {
      fetchStocks();
  }, [jwtToken]);

  // Save new or updated stock
  const handleSaveStock = async (e: React.FormEvent) => {
      e.preventDefault();
      const newStock = {
        quantity: quantity,
        itemId: itemId,
      };
      const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
      };

      try {
          if (editMode && currentStockId) {
              await axios.put(
                  `http://localhost:8080/stocks/update/${currentStockId}`,
                  newStock,
                  config
              );
              alert('Stock updated successfully');
          } else {
              await axios.post('http://localhost:8080/stocks/add', newStock, config);
              alert('Stock added successfully');
          }
          fetchStocks();
          resetForm();
      } catch (error) {
          console.error('Error saving stock:', error);
          alert('Failed to save stock.');
      }
  };

  const handleDeleteStock = async (id: number) => {
      try {
          await axios.delete(`http://localhost:8080/stocks/delete/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          fetchStocks();
      } catch (error) {
          console.error('Error deleting stock:', error);
          alert('Failed to delete stock');
      }
  };

  const handleEditStock = (stock: StockType) => {
      setQuantity(stock.quantity);
      setItemId(stock.itemId);
      setEditMode(true);
      setCurrentStockId(stock.id);
  };

  const resetForm = () => {
      setQuantity(0);
      setItemId(null);
      setEditMode(false);
      setCurrentStockId(null);
  };

  return (
      <div className="container mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Stock Management</h1>

          <form onSubmit={handleSaveStock} className="space-y-4 mb-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{editMode ? 'Edit Stock' : 'Add New Stock'}</h2>

              <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  placeholder="Stock Quantity"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
              />
              <input
                  type="number"
                  value={itemId || ''}
                  onChange={(e) => setItemId(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Item ID"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
              />
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition">
                  {editMode ? 'Update Stock' : 'Add Stock'}
              </button>
          </form>

          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                  <tr>
                      <th className="w-1/5 py-2 px-3 text-center font-semibold text-sm uppercase">ID</th>
                      <th className="w-1/5 py-2 px-3 text-center font-semibold text-sm uppercase">Quantity</th>
                      <th className="w-1/5 py-2 px-3 text-center font-semibold text-sm uppercase">Item ID</th>
                      <th className="w-1/5 py-2 px-3 text-center font-semibold text-sm uppercase">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {stocks.map((stock) => (
                      <tr key={stock.id} className="border-t hover:bg-gray-100 transition">
                          <td className="py-3 px-3 text-center">{stock.id}</td>
                          <td className="py-3 px-3 text-center">{stock.quantity}</td>
                          <td className="py-3 px-3 text-center">{stock.itemId !== null ? stock.itemId : 'No Item'}</td>
                          <td className="py-3 px-3 text-center space-x-2">
                              <button
                                  onClick={() => handleEditStock(stock)}
                                  className="text-blue-500 hover:text-blue-600 font-medium"
                              >
                                  Edit
                              </button>
                              <button
                                  onClick={() => handleDeleteStock(stock.id)}
                                  className="text-red-500 hover:text-red-600 font-medium"
                              >
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

export default StockManagement;