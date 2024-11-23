import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    // Return the deleted category ID in the response
    return NextResponse.json(
      { 
        message: 'Category deleted successfully',
        deletedId: id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}