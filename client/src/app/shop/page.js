"use client";

import "./shop.css";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "../context/CartContext";



const products = [
  {
    id: 1,
    name: "Horizon Hoodie",
    price: "KSh 3,000",
    image: "https://res.cloudinary.com/dm5bnya8d/image/upload/v1773579862/horizon-hoodie_jtscll.jpg",
  },
  {
    id: 2,
    name: "Horizon T-Shirt",
    price: "KSh 1,500",
    image: "https://res.cloudinary.com/dm5bnya8d/image/upload/v1773579861/horizon-tshirt_vmfojn.jpg",
  },
  {
    id: 3,
    name: "Horizon Beanie",
    price: "KSh 900",
    image: "https://res.cloudinary.com/dm5bnya8d/image/upload/v1773579861/horizon-beanie_mmcvyj.jpg",
  },
  {
    id: 4,
    name: "Horizon Tote Bag",
    price: "KSh 850",
    image: "https://res.cloudinary.com/dm5bnya8d/image/upload/v1773579860/horizon-tote_yywhlq.jpg",
  },
  {
    id: 5,
    name: "Horizon Sweatpants",
    price: "KSh 3,200",
    image: "https://res.cloudinary.com/dm5bnya8d/image/upload/v1773579861/horizon-sweatpants_l3oo7p.jpg",
  },
];

export default function Shop() {
    const { cart } = useCart();

  return (
    <div className="shop-container">

        <Link href="/cart" className="floating-cart">
        🛒 Cart ({cart.length})
        </Link>

      <h1 className="shop-title">Horizon Apparel</h1>











      <p className="shop-subtitle">Join the Movement</p>

      <div className="shop-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">

           <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="product-image"
/>


            <h3>{product.name}</h3>

            <p className="price">{product.price}</p>

            <button className="buy-btn">View</button>

          </div>
        ))}
      </div>

    </div>
  );
}
