// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import "/src/assets/styles/Form.css";
import { PRODUCTS_CONSTS } from "../../assets/constants/products";
// import SliderComponent from "../Slider/SliderComponent";
import NavbarComponent from "/src/components/Navbars/NavbarComponent"; // Import the NavbarComponent

const Products = ({ onAddToCart }) => {
  const [productQuantities, setProductQuantities] = useState(
    PRODUCTS_CONSTS.PRODUCTS.reduce((acc, product) => {
      acc[product.id] = product.quantity;
      return acc;
    }, {})
  );

  const [selectedCategory, setSelectedCategory] = useState("Pizzas");

  const handleQuantityChange = (id, delta) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta),
    }));
  };

  const categories = {
    Pizzas: { name: "Pizzas", range: [1, 6] },
    Fries: { name: "Fries", range: [7, 12] }, 
  };

  const category = categories[selectedCategory] || categories["Pizzas"];

  const filteredProducts = PRODUCTS_CONSTS.PRODUCTS.filter(
    (product) =>
      product.id >= category.range[0] &&
      product.id <= category.range[1]
  );

  return (
    <>
      {/* <SliderComponent /> */}
      <NavbarComponent onCategorySelect={setSelectedCategory} />
      <Container>
        <h3>{category.name}</h3>
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className={`productItemInner`}>
                <div className="discountLabel">
                  <p>{PRODUCTS_CONSTS.DISCOUNT_LABEL}</p>
                </div>
                <CardImg
                  top
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                />
                <CardBody className="card-body">
                  <div>
                    <CardTitle className="card-title">{product.name}</CardTitle>
                    <CardText className="card-text">
                      Price: ${product.price}
                    </CardText>
                  </div>
                  <CardText className="card-text">
                    Quantity:
                    <Button
                      color="secondary"
                      onClick={() => handleQuantityChange(product.id, -1)}
                    >
                      -
                    </Button>
                    {productQuantities[product.id]}
                    <Button
                      color="secondary"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      +
                    </Button>
                  </CardText>
                  <Button
                    color="primary"
                    onClick={() =>
                      onAddToCart(product, productQuantities[product.id])
                    }
                    className="btn-primary1"
                  >
                    Add to Cart
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

Products.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
};

export default Products;
