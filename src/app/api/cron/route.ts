import { NextResponse } from "next/server"

export async function GET() {
  await fetch("https://tipx.sao-x.com/user")
  return NextResponse.json({ ok: true })
}
