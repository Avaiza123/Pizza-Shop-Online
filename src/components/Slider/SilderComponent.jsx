// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import '/src/assets/styles/SliderComponent.css';

const SliderComponent = () => {
    const images = [
        '/src/assets/images/slider11.jpg',
        '/src/assets/images/slider22.jpg',
        '/src/assets/images/slider3.webp',
        '/src/assets/images/deal.png'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); 
        return () => clearInterval(interval);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="slider-container">
            <div className="slider">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                ))}
            </div>
            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default SliderComponent;
