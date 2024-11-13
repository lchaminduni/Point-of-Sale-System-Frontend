import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-teal-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to the POS System</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your items, categories, stock, and perform sales transactions efficiently.</p>

        {/* Button Section */}
        {isAuthenticated ? (
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/items")}
              className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Items Management
            </button>

            <button
              onClick={() => navigate("/categories")}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Category Management
            </button>

            <button
              onClick={() => navigate("/stocks")}
              className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
            >
              Stock Management
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
            >
              Point of Sale (POS)
            </button>
          </div>
        ) : (
          <div className="text-red-500 text-lg mt-4">
            You must be logged in to access the management features.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
