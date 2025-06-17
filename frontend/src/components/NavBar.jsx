import {Link } from "react-router-dom"

const NavBar = () => {
    return (
        <div className="navbar-custom">
            <Link className="logo-text">ML Console <span className="logo-prompt">|</span></Link>
            <Link to="/" className="link">Home</Link>
            <Link to="/about-us" className="link">About</Link>
            <Link to="/docs" className="link">Docs</Link>
        </div>
    )
}

export default NavBar