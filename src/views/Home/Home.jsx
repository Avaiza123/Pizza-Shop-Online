import  { useState } from 'react';
import Products from '/src/components/Products/Products';
import '/src/assets/styles/Form.css';
import { useCart } from '/src/CartContext';
const Home = () => {
  const [  setCart] = useState([]);
  const { addToCart } = useCart();
  
  // eslint-disable-next-line no-unused-vars
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

  return (
    <div>
      
      <Products onAddToCart={addToCart} />
    </div>
  );
};

export default Home;
