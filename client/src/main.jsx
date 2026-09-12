import ReactDOM from "react-dom/client";

import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Routes from './Routes.jsx'
import { AuthProvider } from "./Context/AuthContext.jsx";

const router = createBrowserRouter(Routes);


ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
    
  
);