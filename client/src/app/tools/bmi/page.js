"use client";

import { useState } from "react";

export default function BMIPage(){

const [weight,setWeight]=useState("");
const [height,setHeight]=useState("");
const [result,setResult]=useState(null);

const calculate = async()=>{

const res = await fetch("/api/tools/bmi",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({weight:Number(weight),height:Number(height)})
});

const data = await res.json();
setResult(data);

};

return(

<div>

<h1>BMI Calculator</h1>

<input placeholder="Weight (kg)" onChange={(e)=>setWeight(e.target.value)} />

<input placeholder="Height (m)" onChange={(e)=>setHeight(e.target.value)} />

<button onClick={calculate}>Calculate</button>

{result && (

<div>

<p>BMI: {result.bmi}</p>

<p>Category: {result.category}</p>

<p>Ideal Weight: {result.idealWeight} kg</p>

</div>

)}

</div>

);

}
