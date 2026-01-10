// Constants used throughout the application

export const INDUSTRIES = [
  { id: 'automotive', name: 'Automotive', icon: 'Car' },
  { id: 'electronics', name: 'Electronics', icon: 'Cpu' },
  { id: 'food-beverage', name: 'Food & Beverage', icon: 'Utensils' },
  { id: 'pharmaceuticals', name: 'Pharmaceuticals', icon: 'Pill' },
  { id: 'retail', name: 'Retail & E-commerce', icon: 'ShoppingBag' },
  { id: 'industrial', name: 'Industrial Manufacturing', icon: 'Factory' },
] as const;

export const CAPABILITIES = [
  {
    id: 'warehousing',
    title: 'Warehousing & Distribution',
    description: 'State-of-the-art warehousing solutions with advanced inventory management.',
    icon: 'Warehouse',
  },
  {
    id: 'transportation',
    title: 'Transportation & Logistics',
    description: 'Efficient transportation networks ensuring timely delivery.',
    icon: 'Truck',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Support',
    description: 'Comprehensive manufacturing support services.',
    icon: 'Cog',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain Management',
    description: 'End-to-end supply chain optimization and management.',
    icon: 'Network',
  },
  {
    id: 'technology',
    title: 'Technology Solutions',
    description: 'Cutting-edge technology for logistics and manufacturing.',
    icon: 'Code',
  },
] as const;

