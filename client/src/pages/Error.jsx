import { Link } from "react-router-dom"
export function Error(){
    return (
        <div className="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or may have been moved.</p>
      <Link to="/" className="error-home-link">
        Back to Home
      </Link>
    </div>
    )
}