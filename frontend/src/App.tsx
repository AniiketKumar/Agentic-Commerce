import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
//auth
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";

//cart and nav
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Cart from "./pages/Cart";

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
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
        );
    }

export default App;