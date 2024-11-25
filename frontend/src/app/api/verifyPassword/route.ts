// app/api/verify-password/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    
    // Compare with environment variable on server side
    const isValid = password === process.env.ADMIN_PASSWORD
    
    return NextResponse.json({ isValid })
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request ${err}` },
      { status: 400 }
    )
  }
}