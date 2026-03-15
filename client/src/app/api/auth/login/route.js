import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req){

const { email,password } = await req.json();

const userQuery = await pool.query(
`
SELECT id,email,password
FROM "Users"
WHERE email=$1
`,
[email]
);

const user = userQuery.rows[0];

if(!user){

return NextResponse.json(
{ error:"Invalid login" },
{ status:401 }
);

}

const token = signToken(user);

const response = NextResponse.json({
message:"Login successful"
});

response.cookies.set("token",token,{
httpOnly:true,
path:"/",
});

return response;

}
