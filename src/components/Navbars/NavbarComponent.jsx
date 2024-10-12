import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '/src/Hook/useAuth';
import { auth } from '/src/firebaseConfig.js';
import { Avatar } from 'antd';
import '/src/assets/styles/Form.css';
import { useCart } from '/src/CartContext';
import Marquee from '/src/components/Marquee/Marquee';
import Swal from 'sweetalert2';
import { DEALS_CONSTS } from '../../assets/constants/products';
import Products from '../Products/Products';
import SliderComponent from '../Slider/SilderComponent';

// eslint-disable-next-line react/prop-types
const NavbarComponent = ({ onSelectCategory }) => {
  const { cart, addToCart } = useCart();
  const { currentUser } = useAuth();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [activeLink, setActiveLink] = useState('pizzas');
  const [selectedCategory, setSelectedCategory] = useState('pizzas'); // Add selectedCategory state

  useEffect(() => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartQuantity(totalItems);
  }, [cart]);

  const handleLogout = () => {
    localStorage.clear();
    auth.signOut();
  };

  const avatarText = currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase();

  const handleHotDealsClick = async () => {
    for (const deal of DEALS_CONSTS) {
      const result = await Swal.fire({
        title: deal.name,
        text: `Price: $${deal.price}`,
        imageUrl: deal.image,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Deal image',
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Next Deal',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      });

      if (result.isConfirmed) {
        addToCart(deal, 1);
        break;
      }
    }
  };

  const handleSelectCategory = (category) => {
    setActiveLink(category);
    setSelectedCategory(category); // Update selectedCategory state
    onSelectCategory(category);
  };

  return (
    <>
      <Marquee />
      <Navbar bg="light" expand="lg" className="navbar">
        <Navbar.Brand as={Link} to="/user/home" className="navbar-brand">
          <img className="imgi" src="/src/assets/images/logo1.png" alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="d-flex align-items-center">
            <Button onClick={handleHotDealsClick} className="btn-primary1">Hot Deals</Button>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/user/cart" className="nav-link2">
                  <div className="cart-mobile-view">
                    <img src="/src/assets/images/cart.png" alt="cart" style={{ width: '30px' }} />
                    <span className="mobile-cart-quantity-badge">{cartQuantity}</span>
                  </div>
                </Nav.Link>
                <NavDropdown
                  title={
                    <Avatar src={currentUser.photoURL || undefined}>
                      {!currentUser.photoURL && avatarText}
                    </Avatar>
                  }
                  id="basic-nav-dropdown"
                  className="nav-item"
                >
                  <NavDropdown.Item as={Link} to="/user/myprofile" className="dropdown-item">
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/auth/login" className="nav-link1">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="sub-navbar">
        <Nav className="mx-auto">
          <Nav.Link 
            onClick={() => handleSelectCategory('pizzas')}
            className={`nav-link ${activeLink === 'pizzas' ? 'active-list' : ''}`}
          >
            Pizzas
          </Nav.Link>
          <Nav.Link 
            onClick={() => handleSelectCategory('fries')}
            className={`nav-link ${activeLink === 'fries' ? 'active-list' : ''}`}
          >
            Fries
          </Nav.Link>
        </Nav>
      </div>

      <div className="sub-sub-navbar text-white">
        {activeLink === 'pizzas' && (
          <div className="text-white">
            <a className="sub-nav-link">FAVORITE FLAVORS</a>
            <a className="sub-nav-link">PREMIUM FLAVORS</a>
            <a className="sub-nav-link">HALF N HALF</a>
          </div>
        )}
        {activeLink === 'fries' && (
          <div className="text-white">
            <a className="sub-nav-link">LOADED FRIES</a>
            <a className="sub-nav-link">CHEESE FRIES</a>
            <a className="sub-nav-link">CRISPY FRIES</a>
            <a className="sub-nav-link">SIMPLE FRIES</a>
            <a className="sub-nav-link">KIDS FRIES</a>
          </div>
        )}
      </div>

      {/* Render the Products component and pass the selectedCategory as a prop */}
      <Products selectedCategory={selectedCategory} />
      <SliderComponent />
    </>
  );
};

export default NavbarComponent;
