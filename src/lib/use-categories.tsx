"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CategoryTreeNode } from "./categories";

interface CategoryContextType {
  categoryTree: CategoryTreeNode[];
  flatCategories: CategoryTreeNode[];
  headerCategories: CategoryTreeNode[];
  homepageCategories: CategoryTreeNode[];
  mobileCategories: CategoryTreeNode[];
  isLoading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategoryByPath: (path: string) => CategoryTreeNode | null;
  getCategoryById: (id: string) => CategoryTreeNode | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

function flattenTree(nodes: CategoryTreeNode[]): CategoryTreeNode[] {
  const list: CategoryTreeNode[] = [];
  function recurse(items: CategoryTreeNode[]) {
    for (const item of items) {
      list.push(item);
      if (item.children && item.children.length > 0) {
        recurse(item.children);
      }
    }
  }
  recurse(nodes);
  return list;
}

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>([]);
  const [flatCategories, setFlatCategories] = useState<CategoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (isMounted = true) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories/tree", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success && isMounted) {
        setCategoryTree(data.data || []);
        setFlatCategories(flattenTree(data.data || []));
        setError(null);
      }
    } catch (err: any) {
      if (isMounted) {
        console.warn("Failed to load dynamic categories, falling back to local state:", err.message);
        setError(err.message);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchCategories(mounted);
    return () => {
      mounted = false;
    };
  }, [fetchCategories]);

  const headerCategories = categoryTree.filter((c) => c.showInHeader && c.isActive);
  const homepageCategories = flatCategories
    .filter((c) => c.showOnHomepage && c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const mobileCategories = flatCategories.filter((c) => c.showInMobile && c.isActive);

  const getCategoryByPath = useCallback(
    (path: string): CategoryTreeNode | null => {
      const cleanPath = path.replace(/^\/+|\/+$/g, "");
      return flatCategories.find((c) => c.fullPath === cleanPath || c.slug === cleanPath) || null;
    },
    [flatCategories]
  );

  const getCategoryById = useCallback(
    (id: string): CategoryTreeNode | null => {
      return flatCategories.find((c) => c.id === id) || null;
    },
    [flatCategories]
  );

  return (
    <CategoryContext.Provider
      value={{
        categoryTree,
        flatCategories,
        headerCategories,
        homepageCategories,
        mobileCategories,
        isLoading,
        error,
        refreshCategories: () => fetchCategories(true),
        getCategoryByPath,
        getCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
