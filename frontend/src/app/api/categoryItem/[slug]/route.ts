import { NextRequest, NextResponse } from 'next/server';

// Define the params interface
interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get the slug from the params object
    const { slug } = params;
    
    const apiBaseUrl = process.env.API_BASE_URL;
    
    if (!apiBaseUrl) {
      throw new Error('API_BASE_URL is not defined in environment variables');
    }

    // Use the slug in the API request
    const response = await fetch(`${apiBaseUrl}/categories/${slug}/item`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle 404 specifically for not found resources
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}