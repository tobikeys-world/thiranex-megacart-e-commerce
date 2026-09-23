import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black tracking-tight">
                    Mega<span className="text-cyan-400">Cart</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                    >
                        Products
                    </Link>
                    <Link
                        to="/cart"
                        className="relative text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                    >
                        Cart

                        {cartCount > 0 && (
                            <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-black text-slate-950">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated && (
                        <Link
                            to="/orders"
                            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                        >
                            My Orders
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Authentication */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden text-sm text-slate-400 sm:block">
                                Hi, {user.name}
                            </span>

                            <button
                                onClick={logout}
                                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-red-400 hover:text-red-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:text-cyan-400"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;