import CategoryCard from "@/components/category-card";
import CategoryTotalCard from "@/components/category-total-card";
import { categories } from "@/app/data.js";

export default function Categories() {
  return (
    <div>
      <div className="p-5">
        <h1 className="text-5xl font-light">Categories</h1>
        <div className="my-5">
          <CategoryTotalCard
            name={`Categories`}
            total={categories.length}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            // Add return statement or use an implicit return with parentheses
            return (
              <CategoryCard
                key={category.category_id}
                name={category.category_name}
                imageLink={category.category_image_link}
                link="test"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
