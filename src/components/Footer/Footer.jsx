import { useState } from 'react';
import '/src/assets/styles/Footer.css';
import { Row,Col, Container } from 'reactstrap';

const Footer = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you could also handle form submission, e.g., sending data to a server
    // For example: axios.post('/api/contact', formData).then(response => setSubmitted(true)).catch(error => console.error(error));
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <Row>
            <Col md={6}>
        <h6 className='text-left'>@2024 rights</h6></Col>
        <Col md={6} className='footer-contact'>
        <button onClick={() => setIsFormVisible(!isFormVisible)} className="contact-link ">
          Contact Us
        </button></Col></Row>
        {isFormVisible && (
            <Container >
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email1"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
            {submitted && <p className="success-message">Thank you for your message. We will get back to you soon!</p>}
          </form></Container>
        )}
      </div>
    </footer>
  );
};

export default Footer;
