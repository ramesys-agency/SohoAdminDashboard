import type { CategoryTreeNode } from "../../api/categories";

interface CategorySelectOptionsProps {
  categories: CategoryTreeNode[];
}

/**
 * Renders a category tree as <select> children, grouping sub-categories under
 * their parent. Shared by the product form and the product filters so both show
 * the same hierarchy.
 *
 * A parent that has children is rendered as an <optgroup> and stays selectable
 * via its own "All <name>" entry — picking a parent includes its descendants'
 * products, since the products endpoint expands categoryId down the tree.
 */
export default function CategorySelectOptions({
  categories,
}: CategorySelectOptionsProps) {
  return (
    <>
      {categories.map((category) =>
        category.children && category.children.length > 0 ? (
          <optgroup key={category.id} label={category.name}>
            <option value={category.id}>All {category.name}</option>
            {category.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </optgroup>
        ) : (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ),
      )}
    </>
  );
}
