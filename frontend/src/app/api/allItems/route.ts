import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in environment variables');
    }

    const response = await fetch(`${apiBaseUrl}/allitems`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}