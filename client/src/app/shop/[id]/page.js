"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image"; // ✅ import Image
import "../../shop/shop.css";
import { useCart } from "../../context/CartContext";


const products = [
  {
    id: "1",
    name: "Horizon Hoodie",
    price: 3000,
    image: "https://res.cloudinary.com/demo/image/upload/hoodie.jpg",
  },
  {
    id: "2",
    name: "Horizon T-Shirt",
    price: 1500,
    image: "https://res.cloudinary.com/demo/image/upload/tshirt.jpg",
  },
  {
    id: "3",
    name: "Horizon Beanie",
    price: 900,
    image: "https://res.cloudinary.com/demo/image/upload/beanie.jpg",
  },
];

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  const [size, setSize] = useState("M");



  const addToCartHandler = () => {

addToCart({
id:product.id,
name:product.name,
price:product.price,
size:size,
image:product.image
});

alert("Added to cart");

};





  return (
    <div className="product-page">

      {/* ✅ Use next/image for optimization and alt text */}
      <Image
        src={product.image}
        alt={product.name} // important for accessibility
        width={500}       // set width
        height={500}      // set height
        className="product-image"
      />

      <div className="product-info">
        <h1>{product.name}</h1>
        <p>KSh {product.price}</p>

        {/* SIZE SELECTOR */}
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="size-selector"
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

       <button onClick={addToCartHandler} className="buy-btn">
Add To Cart
</button>



      </div>
    </div>
  );
}



