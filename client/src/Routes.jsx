import App from "./App";
import { Error } from "./pages/Error";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MyDrive } from "./pages/MyDrive";
import { Register } from "./pages/Register";
import { FolderPage } from "./pages/FolderPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
const Routes = [
    {
        path :'/',
        element: <App />,
        errorElement : <Error />,
        children :[
            {
                index : true,
                element : (
                <PublicRoute>
                <Home />
                </PublicRoute>
            )
            }, 
            {
                path : '/register',
                element:
                        (
                    <PublicRoute>
                    <Register />
                    </PublicRoute>
                )
                                    
            },
            {
                path :'/login',
                element: (
                    <PublicRoute>
                    <Login />
                    </PublicRoute>
                )
            },
            {
                path:'/mydrive',
                element:  <ProtectedRoute>
                            <MyDrive />
                            </ProtectedRoute>
            
        },
            {
                path:'//mydrive/folder/:id',
                element:  <ProtectedRoute>
                            <FolderPage />
                            </ProtectedRoute>
            
        },
           
        ]
    }
]

export default Routes;