import  { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { LogoutOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import '/src/assets/styles/Form.css';

const Sidebar = ({ handleLogout, avatarText, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="sidebar-icon" onClick={toggleSidebar}>
        <MenuOutlined style={{ fontSize: '24px' }} />
      </div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <Avatar src={currentUser.photoURL || undefined}>
              {!currentUser.photoURL && avatarText}
            </Avatar>
          </div>
          <ul className="sidebar-links">
            <li>
              <Link to="/user/myprofile">
                <UserOutlined /> My Profile
              </Link>
            </li>
            <li onClick={handleLogout}>
            <Link to="/auth/login">
              <LogoutOutlined /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
    </>
  );
};

Sidebar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  avatarText: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    photoURL: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Sidebar;
