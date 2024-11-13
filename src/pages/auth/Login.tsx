import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";

function Login(){
    const navigate=useNavigate();

    const {login}=useAuth();

    const [username,setUserName]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const [error, setError]=useState<string>("")



    async function submit(event:any) {
        event.preventDefault();
        if (username==="" || password==="") {
            setError("Username and password are required")
        }

        const data={
            username:username,
            password:password
        }

        try{
            const response=await axios.post("http://localhost:8080/auth/login",data);
            login(response.data);
            navigate("/home");
        }catch(error){
            setError("There was an error logging in")
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back!</h1>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-lg mb-2">Username</label>
                        <input
                            type="text"
                            onChange={(event) => {
                                setUserName(event.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-purple-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-lg mb-2">Password</label>
                        <input
                            type="password"
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setError("");
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-purple-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="text-center text-red-500 text-sm mt-2">{error}</div>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200"
                    >
                        Log In
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-500">Don't have an account? <a href="#" className="text-purple-600 hover:underline">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;