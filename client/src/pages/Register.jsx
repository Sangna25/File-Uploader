import { useNavigate } from "react-router-dom";


export function Register(){
    const navigate = useNavigate()
    async function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
            credentials:"include",
            method : "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),

        });
        const result = await response.json();
        if(response.ok){
            console.log(result.message);
            navigate("/login")
        } else {
            alert(result.message)
        }


    }    
    return (
        <div className="register-container">
            <h1>Create Your Account</h1>
            <p>Join CloudVault and start organizing your files securely in one place</p>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="firstName">
                        First Name :
                        <input type="text" id="firstName" name="firstName" />
                    </label>
                </div>
                 <div className="form-row">
          <label htmlFor="lastName">
            Last Name
          </label>
          <input type="text" id="lastName" name="lastName" required />
        </div>

        <div className="form-row">
          <label htmlFor="username">
            Username
          </label>
          <input type="text" id="username" name="username" required />
        </div>

        <div className="form-row">
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>

        <div className="form-row">
            <label htmlFor="photoUrl">Profile Photo URL (Optional)</label>
            <input type="url" id="photoUrl" name="photoUrl" />
        </div>
                    
           <button type="submit">Create Account</button>
            
            
            </form>

             <p className="login-link">
        Already have an account? <a href="/login">Sign In</a>
      </p>
        </div>
    )
}