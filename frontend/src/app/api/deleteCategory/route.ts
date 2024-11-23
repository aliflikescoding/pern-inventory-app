import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from the URL
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Forward the delete request to your external API
    const response = await fetch(`http://localhost:5000/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    // Revalidate the categories page to update the UI
    revalidatePath('/categories');

    // Return success response
    return NextResponse.json(
      { message: 'Category deleted successfully' },
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