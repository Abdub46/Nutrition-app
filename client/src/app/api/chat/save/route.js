import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req){

  try{

    const { chatId, role, content } = await req.json();

    await pool.query(
      `
      INSERT INTO "Messages"(chatid,role,content)
      VALUES($1,$2,$3)
      `,
      [chatId, role, content]
    );

    return NextResponse.json({ success:true });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      { error:"Save failed" },
      { status:500 }
    );

  }

}
