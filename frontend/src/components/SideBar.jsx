import { Link } from "react-router-dom"

const SideBar = () => {
    return (
        <div className="sidebar">
            <p>Search</p>
            <ul className="nav nav pills flex-column">
                <li><Link className="link">Datasets</Link></li>
                <li><Link to="/" className="link">MLOps</Link></li>
            </ul>
            <p>Learn</p>
            <ul className="nav nav pills flex-column">
                <li><Link className="link">Documentation</Link></li>
                <li><Link className="link">About us</Link></li>
            </ul>
        </div>
    )
}

export default SideBar