import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const data = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'item not found' },
          { status: 404 }
        );
      }
      
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    // Return the deleted item ID in the response
    return NextResponse.json(
      { 
        message: 'item deleted successfully',
        deletedId: id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting item:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}