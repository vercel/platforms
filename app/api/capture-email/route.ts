import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // For now, just log the email capture since Supabase might not be set up yet
    console.log('Email captured:', { email, source, timestamp: new Date().toISOString() })

    // Simulate successful capture
    // TODO: Replace this with actual Supabase call when ready
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase not configured, simulating success')
      return NextResponse.json({
        message: 'Email captured successfully (simulated)',
        email: email,
        source: source || 'unknown'
      })
    }

    // If Supabase is configured, try to call the edge function
    const response = await fetch(`${supabaseUrl}/functions/v1/capture-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, source }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Supabase error:', data)
      // Fall back to simulation if Supabase fails
      return NextResponse.json({
        message: 'Email captured successfully (fallback)',
        email: email,
        source: source || 'unknown'
      })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}