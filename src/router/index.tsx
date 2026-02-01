import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import AboutPage from "@/pages/AboutPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import OrdersPage from "@/pages/OrdersPage";
import CategoriesPage from "@/pages/CategoriesPage";
import ProductsPage from "@/pages/ProductsPage";
import ProfilePage from "@/pages/ProfilePage";
import RegisterPage from "@/pages/RegisterPage";
import WishlistPage from "@/pages/WishlistPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "admin",
        element: <AdminDashboardPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "categories",
        element: <AdminCategoriesPage />,
      },
      {
        path: "users",
        element: <AdminDashboard />,
      },
      {
        path: "settings",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="p-8 text-center text-red-500 font-bold">
        404: Page Not Found
      </div>
    ),
  },
]);
