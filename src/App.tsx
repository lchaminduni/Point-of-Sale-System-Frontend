import './App.css'
import './index.css'; // or './App.css' depending on your setup

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";

import ItemManagement from './pages/ItemManagement';
import StocksManagement from './pages/StocksManagement';
import POSManagement from './pages/POSManagement';
import CategoryManagement from './pages/CategoryManagement';



function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute/>}>
        
          <Route path='/' element={<Login/>}/>
          
          <Route path='/home' element={<Home/>}/>
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/items" element={<ItemManagement />} />
          <Route path="/stocks" element={<StocksManagement />} />
          <Route path="/orders" element={<POSManagement/>} />
          
        </Route>
        <Route path='/auth/login' element={<Login/>}/>

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App;