"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart(){

const router = useRouter();

// LOAD CART FROM LOCALSTORAGE SAFELY
const [cart,setCart] = useState(() => {

if (typeof window === "undefined") return [];

try {

const stored = localStorage.getItem("cart");
return stored ? JSON.parse(stored) : [];

} catch {

return [];

}

});

const total = cart.reduce((sum,item)=>sum+item.price,0);

return(

<div style={{padding:"40px"}}>

<h1>Your Cart</h1>

{cart.length === 0 && <p>Your cart is empty</p>}




{cart.map((item,i)=>(
<div key={i}>

<p>{item.name} ({item.size})</p>
<p>KSh {item.price}</p>


<button onClick={()=>{
const updated = cart.filter((_,index)=>index!==i);
setCart(updated);
localStorage.setItem("cart",JSON.stringify(updated));
}}>
Remove
</button>









</div>
))}

<h3>Total: KSh {total}</h3>

<button onClick={()=>router.push("/checkout")}>
Checkout
</button>

</div>

);
}

