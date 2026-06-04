import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Analytics from "./pages/analytics";
import Categories from "./pages/categories";
import CreateCategory from "./pages/categories/create";
import AddProductsToPlacement from "./pages/placements/add-products";
import Customers from "./pages/customers";
import Offers from "./pages/offers";
import CreateOffer from "./pages/offers/create";
import ViewOffer from "./pages/offers/view";
import Orders from "./pages/orders";
import OrderDetail from "./pages/orders/detail";
import Products from "./pages/products";
import ProductEditor from "./pages/products/edit";
import ViewProduct from "./pages/products/view";
import Settings from "./pages/settings";
import LoginPage from "./pages/auth/LoginPage";
import CreatePlacements from "./pages/placements/create";
import Placements from "./pages/placements";
import ShippingPage from "./pages/shipping";
import Notifications from "./pages/notifications";
import NotFoundPage from "./pages/not-found";
import HomePromoList from "./pages/home-promo";
import CreateOrEditHomePromo from "./pages/home-promo/create";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<CreateCategory />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="placements" element={<Placements />} />
            <Route path="home-promo" element={<HomePromoList />} />
            <Route path="home-promo/create" element={<CreateOrEditHomePromo />} />
            <Route path="home-promo/edit/:id" element={<CreateOrEditHomePromo />} />
            <Route path="placements/edit/:id" element={<CreatePlacements />} />
            <Route
              path="placements/:id/products"
              element={<AddProductsToPlacement />}
            />
            <Route path="placements/create" element={<CreatePlacements />} />
            <Route path="customers" element={<Customers />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/create" element={<CreateOffer />} />
            <Route path="offers/view/:id" element={<ViewOffer />} />
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
