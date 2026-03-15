import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(){

  try{

    const chats = await pool.query(`
      SELECT id,title
      FROM "Chats"
      ORDER BY createdat DESC
    `);

    return NextResponse.json(chats.rows);

  }catch(error){

   return NextResponse.json([], { status:500 });

  }

}
