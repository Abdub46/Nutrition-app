"use client";

export default function Checkout(){

const handlePayment = async ()=>{

/*
============================
M-PESA PAYMENT PLACEHOLDER
============================

Replace this section with real
M-Pesa STK Push API

Example flow:

1️⃣ Generate access token
2️⃣ Send STK push request
3️⃣ Wait for callback
4️⃣ Confirm payment

Example endpoint:

POST /api/mpesa/stkpush

*/

alert("M-Pesa payment will be integrated here");

};

return(

<div style={{padding:"40px"}}>

<h1>Checkout</h1>

<button onClick={handlePayment}>
Pay with M-Pesa
</button>

</div>

);
}
