import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Categories from "./pages/categories";
import CreateCategory from "./pages/categories/create";
import AddProductsToCollection from "./pages/placements/add-products";
import Customers from "./pages/customers";
import Offers from "./pages/offers";
import CreateOffer from "./pages/offers/create";
import Orders from "./pages/orders";
import OrderDetail from "./pages/orders/detail";
import Products from "./pages/products";
import ProductEditor from "./pages/products/edit";
import ViewProduct from "./pages/products/view";
import Settings from "./pages/settings";
import LoginPage from "./pages/auth/LoginPage";
import CreatePlacements from "./pages/placements/create";
import Placements from "./pages/placements";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="placements" element={<Placements />} />
            <Route path="placements/edit/:id" element={<CreatePlacements />} />
            <Route
              path="placements/collection/:id/add-products"
              element={<AddProductsToCollection />}
            />
            <Route path="placements/create" element={<CreatePlacements />} />
            <Route path="customers" element={<Customers />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/create" element={<CreateOffer />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductEditor />} />
            <Route path="products/edit/:id" element={<ProductEditor />} />
            <Route path="products/view/:id" element={<ViewProduct />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
