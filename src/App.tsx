import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Categories from "./pages/categories";
import CreateCategory from "./pages/categories/create";
import Collections from "./pages/collections";
import CreateCollection from "./pages/collections/create";
import Customers from "./pages/customers";
import Offers from "./pages/offers";
import CreateOffer from "./pages/offers/create";
import Orders from "./pages/orders";
import OrderDetail from "./pages/orders/detail";
import Products from "./pages/products";
import ProductEditor from "./pages/products/edit";
import ViewProduct from "./pages/products/view";
import Settings from "./pages/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/create" element={<CreateCategory />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/create" element={<CreateCollection />} />
          <Route path="customers" element={<Customers />} />
          <Route path="offers" element={<Offers />} />
          <Route path="offers/create" element={<CreateOffer />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="products/edit" element={<ProductEditor />} />
          <Route path="products/:id" element={<ViewProduct />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
