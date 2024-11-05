import React from "react";
import { Card } from "./ui/card";
import { Layers3 } from "lucide-react";

interface CategoryTotalCardProps {
  name: string;
  total: number;
}

const CategoryTotalCard: React.FC<CategoryTotalCardProps> = ({
  name,
  total,
}) => {
  return (
    <Card className="flex flex-col p-5" style={{ width: "fit-content" }}>
      <h3 className="text-2xl font-semibold mb-1 flex items-center">{name} Total <Layers3 className="ml-2"/></h3>
      <p className="text-xl">
        Total : <span className="text-4xl font-light">{total}</span> {name}
      </p>
    </Card>
  );
};

export default CategoryTotalCard;
