import React from 'react';

const FeaturedCars = () => {
  const cars = [
    {
      id: 1,
      name: "Luxury Sedan 2024",
      price: "$45,000",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Experience ultimate comfort and style with our latest luxury sedan."
    },
    {
      id: 2,
      name: "Sports SUV 2024",
      price: "$55,000",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Power and versatility combined in this stunning SUV."
    },
    {
      id: 3,
      name: "Electric Hatchback 2024",
      price: "$35,000",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      description: "Eco-friendly and efficient, perfect for city driving."
    }
  ];

  return (
    <div className="featured-cars">
      <h2>Featured Vehicles</h2>
      <div className="cars-grid">
        {cars.map(car => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p className="price">{car.price}</p>
            <p className="description">{car.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCars; 