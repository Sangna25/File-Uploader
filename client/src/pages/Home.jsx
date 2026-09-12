import { useNavigate } from "react-router-dom"

export function Home(){
    const navigate = useNavigate()
    return (
        <div className="home-container">
            <h1>CloudVault</h1>
            <p>Store, organize, and access your files securely from one place.</p>

            <div className="home-info-wrapper">
            <div className="home-info-container">
                <img src="assets/upload-files.png" alt="upload-img" />
                <h3>Upload Files</h3>
            </div>

            <div className="home-info-container">
                <img src="assets/org-folder.png" alt="organise-img" />
                <h3>Organise Folders</h3>
            </div>

            <div className="home-info-container">
                <img src="assets/home-downloads.png" alt="upload-img" />
                <h3>Download Anytime</h3>
            </div>
            </div>

            <div className="main-container">
                <button onClick={() => navigate("/register")}>Get Started</button>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>


        </div>
    )
}