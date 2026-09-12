import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export function Login(){
    const {login}=  useAuth();
        const navigate = useNavigate()

    async function handleLogin(event){
        
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch (`${import.meta.env.VITE_API_URL}/auth/login`, {
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            }, 
            credentials:"include",
            body:JSON.stringify(data)
        })
        const result = await response.json();
        if(response.ok){
            console.log(result.message);
            login(result.user);
            navigate('/mydrive')
        } else {
            alert(result.message)
        }
    }
    return (
        <div className="login-container">
           <h1>Welcome Back!</h1>
           <form onSubmit={handleLogin}>
                <div className="form-row">
                <label htmlFor="username">
                    Username
                    <input type="text" id="username" name="username" minLength={3} placeholder="username" required />
                </label>
                </div>
                <div className="form-row">
                <label htmlFor="password">
                    Password
                    <input type="password" id="password" name="password" placeholder="Password" required />
                </label>
                </div>
                <button type="submit">Login</button>
            </form>

        </div>
    )
}