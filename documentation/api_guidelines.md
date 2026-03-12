# API Implementation Guidelines

This document outlines the standard pattern for implementing new API integrations in the Soho Admin Dashboard. This ensures consistency, type safety, and efficient state management across the application.

## 1. Directory Structure

For any new feature (e.g., `category`), follow this structure:
- [src/lib/route.ts](file:///home/ptspl19/Desktop/git-projects/Freelance/Soho/SohoAdminDashboard/src/lib/route.ts): Define API endpoint paths.
- `src/api/<feature>.ts`: Define the specific API calls.
- `src/pages/<feature>/<feature>.dto.ts`: Zod schemas for request validation.
- `src/pages/<feature>/<feature>.interface.ts`: TypeScript interfaces for the API responses.

## 2. Step-by-Step Implementation Guide

### Step 1: Define API Endpoints
Add your endpoint to the central routing file: [src/lib/route.ts](file:///home/ptspl19/Desktop/git-projects/Freelance/Soho/SohoAdminDashboard/src/lib/route.ts)

```typescript
export const apiEndpoint = {
  // existing routes...
  category: {
    list: "/v1/categories",
    create: "/v1/categories",
    get: (id: string) => `/v1/categories/${id}`,
    update: (id: string) => `/v1/categories/${id}`,
    delete: (id: string) => `/v1/categories/${id}`,
  },
};
```

### Step 2: Define Interfaces & DTOs
Store types close to where they will be used or in a dedicated types folder if shared.

**`src/pages/category/category.interface.ts`** (Response types)
```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
}
```

**`src/pages/category/category.dto.ts`** (Request schemas and types)
```typescript
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
```

### Step 3: Create API Service Methods
Use the pre-configured Axios instance to make the requests.

**`src/api/category.ts`**
```typescript
import api from '../lib/axios';
import { apiEndpoint } from '../lib/route';
import { type CreateCategoryDto } from '../pages/category/category.dto';
import { type Category, type CategoryListResponse } from '../pages/category/category.interface';

export const getCategories = async (): Promise<CategoryListResponse> => {
  const { data } = await api.get<CategoryListResponse>(apiEndpoint.category.list);
  return data;
};

export const createCategory = async (payload: CreateCategoryDto): Promise<Category> => {
  const { data } = await api.post<Category>(apiEndpoint.category.create, payload);
  return data;
};
```

### Step 4: Integrate with React Query & Components

#### For Fetching Data (`useQuery`)
Use this for `GET` requests where you just need to read data.

```tsx
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/category';

export default function CategoryList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.data.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
```

#### For Mutating Data (`useMutation`)
Use this for `POST`, `PUT`, `PATCH`, `DELETE` operations.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createCategory } from '../../api/category';
import { createCategorySchema } from './category.dto';

export default function CreateCategoryForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate the 'categories' query so the list UI refreshes automatically
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // Reset form or navigate away
    },
    onError: (error: any) => {
      console.error("Failed to create category", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate inputs locally using Zod
    const validationResult = createCategorySchema.safeParse({ name });
    
    if (!validationResult.success) {
       // Display errors...
       return;
    }

    // 2. Trigger API call
    createMutation.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
       {/* form fields */}
    </form>
  );
}
```

## 3. Global State Management (Zustand)
Use `Zustand` (`src/store/*.ts`) when the state needs to be accessed completely globally and isn't tied directly to an immediate server-cache layer (like React Query). Good examples include:
- Authentication state (tokens, `isAuthenticated`)
- UI Preferences (sidebar toggles, themes)

Avoid putting remote server data (like the list of categories) into Zustand. React Query handles remote data caching, refetching, and staleness out of the box better than a manual Zustand store.
