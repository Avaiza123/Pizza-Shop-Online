// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '/src/assets/styles/Admin.css';
const AdminNavbar = ({  setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (

    <nav className="adminNavbar navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#"><img  className="Navimg" src="/src/assets/images/logo1.png"/></a>
        <div className="collapse navbar-collapse">
          <Nav className="mx-auto">
            <NavItem>
              <NavLink href="#" onClick={() => setActiveTab('orders')}>
                Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" onClick={() => setActiveTab('users')}>
                Users
              </NavLink>
            </NavItem>
          </Nav>
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

AdminNavbar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default AdminNavbar;
