export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  status: string;
  date: string;
  image?: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "NeoPhone 15 Pro",
    sku: "PH-1029-NP",
    category: "Electronics",
    price: "$999.00",
    status: "Active",
    date: "Oct 12, 2023",
  },
  {
    id: "2",
    name: "Aura Wireless Buds",
    sku: "AU-5541-W",
    category: "Audio",
    price: "$149.00",
    status: "Active",
    date: "Oct 15, 2023",
  },
  {
    id: "3",
    name: "Atlas Leather Bag",
    sku: "BG-2210-LB",
    category: "Travel",
    price: "$280.00",
    status: "Draft",
    date: "Nov 02, 2023",
  },
  {
    id: "4",
    name: "Nexus Ergo Desk",
    sku: "HM-7782-WD",
    category: "Furniture",
    price: "$450.00",
    status: "Active",
    date: "Nov 10, 2023",
  },
  {
    id: "5",
    name: "Premium Cotton T-Shirt",
    sku: "AP-1001-CT",
    category: "Apparel",
    price: "$25.00",
    status: "Active",
    date: "Dec 01, 2023",
  },
  {
    id: "6",
    name: "Slim Fit Denim Jeans",
    sku: "AP-1002-DJ",
    category: "Apparel",
    price: "$45.00",
    status: "Active",
    date: "Dec 05, 2023",
  },
  {
    id: "7",
    name: "Leather Chelsea Boots",
    sku: "FT-1001-CB",
    category: "Footwear",
    price: "$120.00",
    status: "Active",
    date: "Dec 10, 2023",
  },
  {
    id: "8",
    name: "Summer Canvas Tote",
    sku: "BG-1001-CT",
    category: "Travel",
    price: "$15.00",
    status: "Active",
    date: "Dec 15, 2023",
  },
  {
    id: "9",
    name: "Organic Wool Sweater",
    sku: "AP-1003-WS",
    category: "Apparel",
    price: "$85.00",
    status: "Draft",
    date: "Dec 20, 2023",
  },
  {
    id: "10",
    name: "Classic White Sneakers",
    sku: "FT-1002-WS",
    category: "Footwear",
    price: "$65.00",
    status: "Active",
    date: "Jan 05, 2024",
  },
  {
    id: "11",
    name: "Navy Blue Blazer",
    sku: "AP-1004-NB",
    category: "Apparel",
    price: "$150.00",
    status: "Active",
    date: "Jan 10, 2024",
  },
  {
    id: "12",
    name: "Khaki Chino Pants",
    sku: "AP-1005-KC",
    category: "Apparel",
    price: "$40.00",
    status: "Active",
    date: "Jan 15, 2024",
  },
];
