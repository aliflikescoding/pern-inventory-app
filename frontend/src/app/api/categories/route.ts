import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const response = await fetch(`${process.env.API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // If the external API call was successful, return a simple success response
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Category created successfully' 
      }, { 
        status: 200 
      });
    } else {
      // If the external API returns an error
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create category' 
      }, { 
        status: response.status 
      });
    }
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}