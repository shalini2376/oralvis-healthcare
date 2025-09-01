import {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Trying login with:", email, password);
        try{
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password,
            })
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            // Redirect based on role
            console.log("Login response:", res.data);

            if (res.data.role === "Technician"){
                navigate("/technician");
            } else if (res.data.role === "Dentist"){
                navigate("/dentist");
            }
        } catch(err) {
            setError("Invalid credentials");
            console.log("Login  Err", err);
        }
    };

    return (
        <div className="login-container h-100 d-flex flex-column justify-content-center align-items-center">
            <h2 className="text-primary mt-3 p-4 text-center">Oralvis Healthcare - Login</h2>
            <form onSubmit={handleLogin} className='w-50'>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email </label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder="Enter email" required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Enter password" required />
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <button className='btn btn-primary w-50'>Login</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    )
}
export default LoginPage;