import { useContext,createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";



const AuthContext = createContext();
export function AuthProvider({children}){
    const [ user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const login = (userData) =>{
       
        setUser(userData)
    }

   const logout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    console.error(err);
  } finally {
    setUser(null);
  }
};

    useEffect(()=>{
        async function fetchCurrentUser(){
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`,{
                    credentials:"include"
                });

                if(response.ok){
                    const data = await response.json();
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch(err){
                console.error(err);
                setUser(null);
            }finally {
        setLoading(false);
      }
        }
        fetchCurrentUser()
    },[])

    return (
        <AuthContext.Provider value={{login,logout,setUser,user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}