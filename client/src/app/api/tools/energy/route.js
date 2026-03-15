import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req){

try{

const { age, gender, weight, height, activity } = await req.json();

if(!age || !gender || !weight || !height){
return NextResponse.json({error:"Missing data"},{status:400});
}

if(age < 10 || age > 100){
return NextResponse.json({error:"Age out of range"},{status:400});
}

let bmr;

if(gender === "male"){
bmr = (13.7 * weight) + (5 * height) - (6.8 * age) + 66.5;
}else{
bmr = (9.6 * weight) + (1.8 * height) - (4.7 * age) + 665;
}

const activityLevels = {
sedentary:1.2,
light:1.375,
moderate:1.55,
active:1.725,
veryactive:1.9
};

const energy = bmr * activityLevels[activity];

await pool.query(
`
INSERT INTO "EnergyCalculator"
(age,gender,weight,height,activitylevel,bmr,energy)
VALUES($1,$2,$3,$4,$5,$6,$7)
`,
[age,gender,weight,height,activity,bmr,energy]
);

return NextResponse.json({
bmr:Math.round(bmr),
energy:Math.round(energy)
});

}catch(error){

console.error(error);

return NextResponse.json({error:"Energy calculation failed"},{status:500});

}

}
