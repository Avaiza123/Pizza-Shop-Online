// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { useCart } from "/src/CartContext";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from "/src/Hook/useAuth";
import "/src/assets/styles/Cart.css";

const Cart = ({ onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const now = new Date();
    const orderData = {
      name: formData.name,
      address: formData.address,
      email: formData.email,
      items: cart,
      total: calculateTotal(),
      userId: currentUser?.uid || null,
      status: "current",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    try {
      const db = getFirestore();
      await addDoc(collection(db, "orders"), orderData);
      localStorage.setItem("order", JSON.stringify(orderData));
      setSuccessMessage("Order successfully submitted!");

      // Clear the cart and close the form
      clearCart();
      setIsCheckoutVisible(false);
      setFormData({
        name: "",
        address: "",
        email: "",
      });
      if (onCheckout) onCheckout(); // Notify parent component if needed
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (id, delta) => {
    updateQuantity(
      id,
      Math.max(1, cart.find((item) => item.id === id).quantity + delta)
    );
  };

  return (
    <Container className="cart-container">
      <Row>
        <Col>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <Row>
              {cart.map((item, index) => (
                <Col key={index} sm={12} md={5} lg={3} className="mb-4">
                  <Card className="card-card">
                    <CardImg
                      top
                      src={item.image}
                      alt={item.name}
                      className="card-item-image"
                    />
                    <CardBody className="card-card-body">
                      <CardTitle className="card-card-title">
                        {item.name}
                      </CardTitle>
                      <CardText className="card-card-text">
                        Quantity:
                        <Button
                          color="secondary"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </Button>
                        {item.quantity}
                        <Button
                          color="secondary"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </CardText>
                      <CardText className="card-card-text">
                        Price: ${item.price * item.quantity}
                      </CardText>
                      <Button
                        color="danger"
                        onClick={() => removeFromCart(item.id)}
                        className="btn-danger"
                      >
                        Remove
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="cart-summary mt-4">
            <h3>Total Amount: ${calculateTotal()}</h3>
            {cart.length > 0 && !isCheckoutVisible && (
              <Button
                color="primary"
                onClick={() => setIsCheckoutVisible(true)}
                className="btn-primary1"
              >
                Checkout
              </Button>
            )}
          </div>

          {isCheckoutVisible && (
            <div className="checkout-container mt-4">
              <Form onSubmit={handleSubmit} className="checkout-form">
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <Button
                  color="primary"
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  color="secondary"
                  onClick={() => setIsCheckoutVisible(false)}
                  className="btn-secondary ml-2"
                >
                  Cancel
                </Button>
              </Form>
              {successMessage && (
                <Alert color="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

Cart.propTypes = {
  onCheckout: PropTypes.func,
};

export default Cart;
