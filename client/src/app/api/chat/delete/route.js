import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req){

try{

const { chatId } = await req.json();

await pool.query(
`
DELETE FROM "Messages"
WHERE chatid = $1
`,
[chatId]
);

await pool.query(
`
DELETE FROM "Chats"
WHERE id = $1
`,
[chatId]
);

return NextResponse.json({ success:true });

}catch(error){

console.error(error);

return NextResponse.json(
{ error:"Delete failed" },
{ status:500 }
);

}

}
