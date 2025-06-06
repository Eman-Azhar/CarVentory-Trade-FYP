import React, { useState, useEffect } from 'react';
import './Auth.css';

const ImageGallery = ({ images, defaultImage = '/default-car.jpg' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        console.log("Images received by gallery:", images);
        if (!images || images.length === 0) {
            setImageUrls([defaultImage]);
            return;
        }
        
        // Process the images to ensure they're correctly formatted
        const processedUrls = images.map(img => {
            if (typeof img === 'string') {
                return img.startsWith('http') ? img : `http://localhost:5000${img}`;
            } else if (img && img.url) {
                return img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`;
            }
            return defaultImage;
        });
        
        console.log("Processed URLs:", processedUrls);
        setImageUrls(processedUrls);
    }, [images, defaultImage]);

    const nextImage = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex(prevIndex => 
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    if (imageUrls.length === 0) {
        return (
            <div className="gallery-container">
                <img 
                    src={defaultImage} 
                    alt="No image available" 
                    className="gallery-main-image" 
                />
            </div>
        );
    }

    return (
        <div className="gallery-container">
            <div className="gallery-main-image-container">
                <img 
                    src={imageUrls[currentIndex]} 
                    alt={`Image ${currentIndex + 1}`} 
                    className="gallery-main-image" 
                />
                
                {imageUrls.length > 1 && (
                    <>
                        <button 
                            className="gallery-nav-btn prev" 
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            ❮
                        </button>
                        <button 
                            className="gallery-nav-btn next" 
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            ❯
                        </button>
                    </>
                )}
            </div>
            
            {imageUrls.length > 1 && (
                <div className="gallery-thumbnails">
                    {imageUrls.map((url, index) => (
                        <img 
                            key={index}
                            src={url} 
                            alt={`Thumbnail ${index + 1}`} 
                            className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery; 