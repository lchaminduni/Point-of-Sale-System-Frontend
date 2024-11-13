import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryType } from "../types/CategoryType";
import { useAuth } from "../context/AuthContext";

const CategoryManagement: React.FC = () => {
    const { jwtToken } = useAuth();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  
    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories/all', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCategories(response.data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
    };
  
    useEffect(() => {
      fetchCategories();
    }, [jwtToken]);
  
    // Save new or updated category
    const handleSaveCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      const newCategory = { name: categoryName };
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      try {
        
        if (editMode && currentCategoryId) {
          await axios.put(`http://localhost:8080/categories/update/${currentCategoryId}`, newCategory,config);
          alert('Category updated successfully');
        } else {
          await axios.post('http://localhost:8080/categories/addcategories', newCategory,config);
          alert('Category added successfully');
        }
        fetchCategories();
        resetForm();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error response:', error.response.data);
            alert(`Failed to save category: ${error.response.data.message || error.message}`);
          } else {
            console.error('Error:', error);
            alert('Failed to save category due to unknown error');
          }
      }
    };
  
    // Delete category by ID
    const handleDeleteCategory = async (id: number) => {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          };
      
          try {
            await axios.delete(`http://localhost:8080/categories/deletecategories/${id}`, config);
            fetchCategories();
            alert('Category deleted successfully');
          } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
          }
    };
  
    // Edit mode for category
    const handleEditCategory = (category: CategoryType) => {
      setCategoryName(category.name);
      setEditMode(true);
      setCurrentCategoryId(category.id);
    };
  
    // Reset form fields
    const resetForm = () => {
      setCategoryName('');
      setEditMode(false);
      setCurrentCategoryId(null);
    };
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Category Management</h1>
        
        <form onSubmit={handleSaveCategory} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6 bg-white shadow-md rounded-lg p-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="border rounded p-2 flex-1 focus:outline-none focus:border-blue-400"
            required
          />
          <button type="submit" className={`p-2 rounded ${editMode ? 'bg-yellow-500' : 'bg-green-500'} text-white font-semibold transition duration-300 hover:bg-opacity-80`}>
            {editMode ? 'Update Category' : 'Add Category'}
          </button>
        </form>
  
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-100 transition duration-300">
                <td className="py-2 px-4">{category.id}</td>
                <td className="py-2 px-4">{category.name}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleEditCategory(category)} className="text-blue-500 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:underline">
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
  
  export default CategoryManagement;