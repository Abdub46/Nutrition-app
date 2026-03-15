import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";


export async function POST(req) {

  try {




const { message, chatId: existingChatId } = await req.json();


const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

const decodedUser = verifyToken(token);

if (!decodedUser) {

return NextResponse.json(
{ error: "Unauthorized" },
{ status: 401 }
);

}









const userId = decodedUser.id;



   


    /* 1️⃣ USER PROFILE */

    const userQuery = await pool.query(
      `
      SELECT id, name, age, gender
      FROM "Users"
      WHERE id = $1
      `,
      [userId]
    );

    const user = userQuery.rows[0];



    /* 2️⃣ LATEST BMI */

    const bmiQuery = await pool.query(
      `
      SELECT weight, height, bmi, category, "dailyCalories"
      FROM "BMIHistory"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 1
      `,
      [userId]
    );

    const bmi = bmiQuery.rows[0];


    let nutritionGoal = "maintain a balanced diet";

if (bmi) {
  if (bmi.bmi > 25) {
    nutritionGoal = "weight loss with lower calorie meals and more vegetables";
  } 
  else if (bmi.bmi < 18.5) {
    nutritionGoal = "weight gain with higher calorie and protein meals";
  } 
  else {
    nutritionGoal = "maintain a balanced healthy diet";
  }
}








    /* 3️⃣ FOOD DATABASE */

    const foodsQuery = await pool.query(
      `
      SELECT
        name,
        serving_size,
        calories,
        protein,
        carbohydrates,
        fat,
        price_kes
      FROM foods
      `
    );

    const foods = foodsQuery.rows.map(food => ({
  name: food.name,
  calories: food.calories,
  protein: food.protein,
  carbs: food.carbohydrates,
  fat: food.fat,
  price: food.price_kes
}));




    /* 4️⃣ AI CONTEXT */



  const systemPrompt = `
You are a professional nutrition assistant helping Kenyan students eat healthy and affordable meals.

CLIENT PROFILE
${JSON.stringify(user)}

LATEST HEALTH DATA
${JSON.stringify(bmi)}

NUTRITION GOAL
The user's goal is: ${nutritionGoal}

AVAILABLE FOODS DATABASE
${JSON.stringify(foods)}

AI RULES

1. Use foods only from the foods database.
2. Consider the user's nutrition goal.
3. If the goal is weight loss → recommend lower calorie meals.
4. If the goal is weight gain → recommend higher calorie meals.
5. If the goal is balanced → recommend a balanced diet.
6. Prefer affordable foods suitable for Kenyan students.

FORMAT RESPONSE IN MARKDOWN:

Title

| Meal | Food | Calories | Protein | Cost |
|------|------|----------|---------|------|

Short explanation

Budget tips
`;



const aiResponse = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",
headers:{
"Authorization":`Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"minimax/minimax-m2.5",
messages:[
{role:"system",content:systemPrompt},
{role:"user",content:message}
]
})
}
);

const aiData = await aiResponse.json();

const reply =
aiData.choices?.[0]?.message?.content ||
"Sorry, I couldn't generate a response.";







    /* 5️⃣ OPENROUTER */

  const titleResponse = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method:"POST",
    headers:{
      "Authorization":`Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      model:"minimax/minimax-m2.5",
      messages:[
        {
          role:"user",
          content:`Create a short 5-word title for this conversation: ${message}`
        }
      ]
    })
  }
);

const titleData = await titleResponse.json();

const title = titleData.choices[0].message.content
 || "Sorry, I couldn't generate a response.";


 /* 6️⃣ CREATE CHAT */

const chat = await pool.query(
`
INSERT INTO "Chats"(userid,title)
VALUES($1,$2)
RETURNING id
`,
[userId,title]
);

const newChatId = chat.rows[0].id;
const currentChatId = existingChatId || newChatId;





/* 7️⃣ SAVE USER MESSAGE */

await pool.query(
`
INSERT INTO "Messages"(chatid,role,content)
VALUES($1,$2,$3)
`,
[currentChatId,"user",message]
);



/* 8️⃣ SAVE AI MESSAGE */

await pool.query(
`
INSERT INTO "Messages"(chatid,role,content)
VALUES($1,$2,$3)
`,
[currentChatId,"assistant",reply]
);










    return NextResponse.json({
reply,
chatId: currentChatId
});


  } catch (error) {

    console.error("AI ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );

  }

}

