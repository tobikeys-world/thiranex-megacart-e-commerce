import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Checkout = () => {
    const navigate = useNavigate();

    const { cartItems, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        phone: "",
        paymentMethod: "cash_on_delivery",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect users who are not logged in
    if (!isAuthenticated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
                <div className="max-w-md text-center">
                    <div className="text-5xl">🔐</div>

                    <h1 className="mt-5 text-3xl font-black">
                        Login required
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Please log in to your MegaCart account before checking out.
                    </p>

                    <Link
                        to="/login"
                        className="mt-7 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Login to Continue
                    </Link>
                </div>
            </main>
        );
    }

    // Empty cart protection
    if (cartItems.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
                <div className="max-w-md text-center">
                    <div className="text-5xl">🛒</div>

                    <h1 className="mt-5 text-3xl font-black">
                        Your cart is empty
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Add some products before proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="mt-7 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setLoading(true);

            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                })),

                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    phone: formData.phone,
                },

                paymentMethod: formData.paymentMethod,
            };

            const response = await api.post("/orders", orderData);

            clearCart();

            navigate(`/orders/${response.data.order._id}`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to place your order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        MegaCart Checkout
                    </p>

                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                        Complete your order
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Enter your delivery details and choose your payment method.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Checkout Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                                01
                            </p>

                            <h2 className="mt-2 text-2xl font-black">
                                Delivery Information
                            </h2>
                        </div>

                        <div className="mt-7 space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Delivery Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Enter your delivery address"
                                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                                />
                            </div>

                            {/* City + Phone */}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Lagos"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="08012345678"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-10 border-t border-slate-800 pt-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                                02
                            </p>

                            <h2 className="mt-2 text-2xl font-black">
                                Payment Method
                            </h2>

                            <div className="mt-6 space-y-3">
                                {/* Cash on Delivery */}
                                <label
                                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${formData.paymentMethod === "cash_on_delivery"
                                        ? "border-cyan-400 bg-cyan-400/5"
                                        : "border-slate-700 hover:border-slate-600"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash_on_delivery"
                                        checked={formData.paymentMethod === "cash_on_delivery"}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-cyan-400"
                                    />

                                    <div>
                                        <p className="font-semibold text-white">
                                            Cash on Delivery
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Pay when your order arrives.
                                        </p>
                                    </div>
                                </label>

                                {/* Card */}
                                <label
                                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${formData.paymentMethod === "card"
                                        ? "border-cyan-400 bg-cyan-400/5"
                                        : "border-slate-700 hover:border-slate-600"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === "card"}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-cyan-400"
                                    />

                                    <div>
                                        <p className="font-semibold text-white">
                                            Card Payment
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Payment integration can be added later.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-10 w-full rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </form>

                    {/* Order Summary */}
                    <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-28">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                            Your Order
                        </p>

                        <h2 className="mt-3 text-2xl font-black">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex gap-4 border-b border-slate-800 pb-4"
                                >
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Qty: {item.quantity}
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-cyan-400">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-4 border-b border-slate-800 pb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Delivery</span>
                                <span className="text-cyan-400">Free</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6">
                            <span className="font-semibold text-slate-300">
                                Total
                            </span>

                            <span className="text-2xl font-black text-cyan-400">
                                ₦{cartTotal.toLocaleString()}
                            </span>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Checkout;