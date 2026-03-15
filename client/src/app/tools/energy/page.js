"use client";

import { useState } from "react";

export default function EnergyPage(){

const [form,setForm]=useState({});
const [result,setResult]=useState(null);

const calculate = async()=>{

const res = await fetch("/api/tools/energy",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(form)
});

const data = await res.json();
setResult(data);

};

return(

<div>

<h1>Energy Requirement Calculator</h1>

<input placeholder="Age" onChange={(e)=>setForm({...form,age:e.target.value})}/>

<select onChange={(e)=>setForm({...form,gender:e.target.value})}>
<option>Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>

<input placeholder="Weight (kg)" onChange={(e)=>setForm({...form,weight:e.target.value})}/>

<input placeholder="Height (cm)" onChange={(e)=>setForm({...form,height:e.target.value})}/>

<select onChange={(e)=>setForm({...form,activity:e.target.value})}>
<option>Activity Level</option>
<option value="sedentary">Sedentary</option>
<option value="light">Light</option>
<option value="moderate">Moderate</option>
<option value="active">Active</option>
<option value="veryactive">Very Active</option>
</select>

<button onClick={calculate}>Calculate</button>

{result && (

<div>

<p>BMR: {result.bmr} kcal</p>

<p>Daily Energy Requirement: {result.energy} kcal</p>

</div>

)}

</div>

);

}
