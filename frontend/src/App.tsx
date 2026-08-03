import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
//auth
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";

import Register from "./pages/Register";

//cart and nav
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Cart from "./pages/Cart";

//Admin panel
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

//my orders and admin orders
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";


function App() {

    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <Admin />
                                </AdminRoute>
                                }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <MyOrders />
                                </ProtectedRoute>
                                }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                                }
                        />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
        );
    }

export default App;