import { listRecipes } from "./actions";
import { RecipeList } from "./recipe-list";

export default async function RecipesPage() {
  const recipes = await listRecipes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recipes / BOM</h1>
        <p className="text-sm text-muted-foreground">
          Manage bills of material and production recipes.
        </p>
      </div>
      <RecipeList data={recipes} />
    </div>
  );
}
