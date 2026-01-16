import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for inquiries (in production, use a database)
const inquiries: Array<{
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create inquiry object
    const inquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    }

    // Store inquiry
    inquiries.push(inquiry)

    // Log to console (in production, send email or save to database)
    console.log("[Inquiry Received]", inquiry)

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Inquiry error:", error)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ inquiries })
}
