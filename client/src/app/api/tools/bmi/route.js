import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req){

try{

const { weight, height } = await req.json();

if(!weight || !height){
return NextResponse.json({error:"Invalid input"},{status:400});
}

if(weight < 20 || weight > 300){
return NextResponse.json({error:"Weight out of range"},{status:400});
}

if(height < 1 || height > 2.5){
return NextResponse.json({error:"Height out of range"},{status:400});
}

const bmi = weight / (height * height);

let category="Normal";

if(bmi < 18.5) category="Underweight";
else if(bmi < 25) category="Normal";
else if(bmi < 30) category="Overweight";
else category="Obese";

const idealWeight = 21.7 * (height * height);

await pool.query(
`
INSERT INTO "BMICalculator"(weight,height,bmi,category,idealweight)
VALUES($1,$2,$3,$4,$5)
`,
[weight,height,bmi,category,idealWeight]
);

return NextResponse.json({
bmi:bmi.toFixed(2),
category,
idealWeight:idealWeight.toFixed(2)
});

}catch(error){

console.error(error);

return NextResponse.json({error:"Calculation failed"},{status:500});

}

}
