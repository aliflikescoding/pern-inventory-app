import CategoryCard from "@/components/category-card";
import CategoryTotalCard from "@/components/category-total-card";
import { categories } from "@/app/data.js";

export default function Home() {
  return (
    <div className="flex">
      <div className="border-r-2 p-5">
        <h1 className="py-2">test</h1>
        <h1 className="py-2">test</h1>
        <h1 className="py-2">test</h1>
      </div>
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
                link={category.category_image_link}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
