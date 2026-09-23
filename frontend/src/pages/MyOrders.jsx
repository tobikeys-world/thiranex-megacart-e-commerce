import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setError("");

                const response = await api.get("/orders/my-orders");

                setOrders(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        const styles = {
            processing:
                "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
            confirmed:
                "bg-blue-400/10 text-blue-400 border-blue-400/20",
            shipped:
                "bg-purple-400/10 text-purple-400 border-purple-400/20",
            delivered:
                "bg-green-400/10 text-green-400 border-green-400/20",
            cancelled:
                "bg-red-400/10 text-red-400 border-red-400/20",
        };

        return (
            styles[status] ||
            "bg-slate-400/10 text-slate-400 border-slate-400/20"
        );
    };

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        MegaCart Account
                    </p>

                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                        My Orders
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Track and manage your MegaCart purchases.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-64 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
                            <p className="mt-4 text-sm text-slate-400">
                                Loading your orders...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-5 text-2xl font-black">
                            No orders yet
                        </h2>

                        <p className="mt-3 text-slate-400">
                            Your completed purchases will appear here.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* Orders */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-5">
                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                            >
                                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            Order ID
                                        </p>

                                        <p className="mt-1 break-all font-mono text-sm text-slate-300">
                                            ID: {order._id}
                                        </p>

                                        <p className="mt-2 text-xs text-yellow-400">
                                            Open URL: /orders/{order._id}
                                        </p>

                                        <p className="mt-3 text-sm text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString(
                                                "en-NG",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <span
                                            className={`rounded-full border px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {order.orderStatus}
                                        </span>

                                        <span className="text-xl font-black text-cyan-400">
                                            ₦{order.totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-800 pt-5">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <p className="text-sm text-slate-400">
                                            {order.items.length} item
                                            {order.items.length !== 1 ? "s" : ""}
                                        </p>

                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="rounded-full border border-slate-700 px-5 py-2 text-center text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
                                        >
                                            View Order →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyOrders;