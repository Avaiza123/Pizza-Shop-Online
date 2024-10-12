import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "../Routes";
import NavbarComponent from "../components/Navbars/NavbarComponent";
import Footer from "../components/Footer/Footer";
//import Products from "../components/Products/Products"; 

const User = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    console.log("user");
  }, []);

  const getRoutes = (_routes) => {
    return _routes.map((route, key) => {
      if (route.layout === "/user") {
        return (
          <Route
            key={key}
            path={route.path}
            element={
              route.path === '/user/products' ? (
                <route.component
                  onAddToCart={handleAddToCart}
                  selectedCategory={selectedCategory}
                />
              ) : (
                <route.component />
              )
            }
            exact
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <NavbarComponent 
        cart={cart} 
        onSelectCategory={handleCategorySelection} 
      />
      <Routes>
        {getRoutes(routes.common)}
        <Route path="*" element={<Navigate to="/user/home" />} />
        {/* <Route path="/signup" element={<Navigate to="/user/signup" />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default User;
