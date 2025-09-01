import {Link, useNavigate} from "react-router-dom";

function Header() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/")
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 d-flex justify-content-between align-items-center">
            <Link className="navbar-brand fs-4" to={token ? (role === "Technician" ? "/technician" : "/dentist") : "/"}>Oralvis Healthcare💊</Link>
            <div className="">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        {!token &&  ( 
                            <button className="btn btn-outline-light" >Login</button>
                        )} 
                    </li>
                    <li className="nav-item">
                        {token && (
                            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
export default Header;