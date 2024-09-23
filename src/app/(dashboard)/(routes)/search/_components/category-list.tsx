import { Category } from "@prisma/client";
import { CategoryListItems } from "./category-list-items";

interface CategoryListProps {
  category: Category[];
}

export const CategoryList = ({ category }: CategoryListProps) => {
  return (
    <div className="scrollbar-none flex items-center gap-x-2 overflow-x-auto pb-2">
      {category.map((items) => (
        <CategoryListItems key={items.id} label={items.name} value={items.id} />
      ))}
    </div>
  );
};
