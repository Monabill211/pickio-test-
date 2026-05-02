import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "@/i18n";
import FAQ from "./pages/FAQ";
import ShippingDelivery from "./pages/ShippingDelivery";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";

// Admin imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminUserProfile from "./pages/admin/AdminUserProfile";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";
import AddCategories from "./pages/admin/AddCategories";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserAuthProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
<Route path="/product/:id" element={<ProductDetail />} />           <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<ShippingDelivery />} />
              <Route path="/returns" element={<ReturnsPolicy />} />

              {/* Admin Routes - Login is public */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedRoute><AdminOrderDetails /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute><AdminUserProfile /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/categories/add" element={<ProtectedRoute><AddCategories /></ProtectedRoute>} />
              <Route path="/admin/contact-messages" element={<ProtectedRoute><AdminContactMessages /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
      </UserAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
