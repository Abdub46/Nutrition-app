import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req){

  const { chatId } = await req.json();

  const messages = await pool.query(
    `
    SELECT role,content
    FROM "Messages"
    WHERE chatid=$1
    ORDER BY createdat ASC
    `,
    [chatId]
  );

  return NextResponse.json(messages.rows);

}
