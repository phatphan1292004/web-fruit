import store from '../../../integrations/store';

export type CategoryItem = {
  slug: string;
  name: string;
  title?: string;
};

export async function fetchCategories() {
  return store.get<CategoryItem[]>('/categories');
}
