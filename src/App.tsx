import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Categories from "./pages/categories";
import Collections from "./pages/collections";
import Customers from "./pages/customers";
import Offers from "./pages/offers";
import Orders from "./pages/orders";
import Products from "./pages/products";
import ProductEditor from "./pages/products/edit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="categories" element={<Categories />} />
          <Route path="collections" element={<Collections />} />
          <Route path="customers" element={<Customers />} />
          <Route path="offers" element={<Offers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="products/edit" element={<ProductEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
