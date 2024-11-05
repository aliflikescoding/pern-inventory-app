import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

// Define the props type
interface CategoryCardProps {
  name: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, link }) => {
  return (
    <Card className="p-5 flex flex-col items-center">
      <div className="relative"> {/* Use relative positioning for the parent container */}
        <div className="bg-black absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer hover:opacity-50 transition-opacity flex justify-center items-center">
          <p className="">View Category Items</p>
        </div> {/* Set absolute positioning */}
        <Image
          src={link}
          width={300}
          height={300}
          alt="Category Image"
          className="object-cover" // Make the image fill the container
        />
      </div>
      <h1 className="text-2xl my-2 font-light">{name}</h1>
      <Button>Edit Category</Button>
    </Card>
  );
};

export default CategoryCard;
