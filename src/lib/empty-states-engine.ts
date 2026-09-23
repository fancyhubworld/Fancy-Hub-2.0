export type EmptyStateType =
  | "no_products"
  | "no_orders"
  | "empty_cart"
  | "empty_wishlist"
  | "no_search_results"
  | "not_found_404";

export interface EmptyStateItemConfig {
  type: EmptyStateType;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  showSearch?: boolean;
  popularCategories?: Array<{ label: string; link: string }>;
  suggestedProducts?: boolean;
}

export const DEFAULT_EMPTY_STATES: Record<EmptyStateType, EmptyStateItemConfig> = {
  no_products: {
    type: "no_products",
    title: "No Products Found",
    description: "We couldn't find any items matching your selected filters. Try broadening your criteria or explore our trending collections.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80",
    buttonText: "Browse All Collections",
    buttonLink: "/shop",
  },
  no_orders: {
    type: "no_orders",
    title: "No Orders Placed Yet",
    description: "Looks like you haven't placed an order yet. Discover authentic handlooms and festive deals from master weavers.",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80",
    buttonText: "Start Shopping Today",
    buttonLink: "/deals",
  },
  empty_cart: {
    type: "empty_cart",
    title: "Your Shopping Bag is Empty",
    description: "Explore India's finest Banarasi silk, designer kurtas, and audio gadgets to fill your bag with festive joy.",
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80",
    buttonText: "Explore Festive Deals",
    buttonLink: "/shop",
  },
  empty_wishlist: {
    type: "empty_wishlist",
    title: "Your Wishlist is Empty",
    description: "Save items you love by clicking the heart icon on any product card to track prices and festive discounts.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    buttonText: "Explore Trending Weaves",
    buttonLink: "/new-arrivals",
  },
  no_search_results: {
    type: "no_search_results",
    title: "No Results Matching Your Search",
    description: "Check your spelling or try searching for generic keywords like 'Sarees', 'Kurtas', 'ANC Earbuds', or 'Silk Mark'.",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    buttonText: "View Best Sellers",
    buttonLink: "/best-sellers",
    showSearch: true,
  },
  not_found_404: {
    type: "not_found_404",
    title: "404 — Page Not Found",
    description: "The page you're looking for might have been moved, renamed, or temporarily unavailable. Let's get you back to shopping!",
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&q=80",
    buttonText: "Return to Homepage",
    buttonLink: "/",
    showSearch: true,
    popularCategories: [
      { label: "Handloom Sarees", link: "/category/sarees" },
      { label: "Ethnic Kurtas", link: "/category/kurtas" },
      { label: "5G Electronics", link: "/category/electronics" },
      { label: "Festive Flash Sale", link: "/flash-sale" },
    ],
    suggestedProducts: true,
  },
};
