import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const OrderDetails = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setError("");
                console.log("Order ID from URL:", id);
                console.log("Order request URL:", `/orders/${id}`);
                const response = await api.get(`/orders/${id}`);

                setOrder(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load this order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const statuses = [
        "processing",
        "confirmed",
        "shipped",
        "delivered",
    ];

    const statusLabels = {
        processing: "Order Processing",
        confirmed: "Order Confirmed",
        shipped: "Order Shipped",
        delivered: "Order Delivered",
    };

    const statusDescriptions = {
        processing: "Your order has been received and is being processed.",
        confirmed: "Your order has been confirmed by MegaCart.",
        shipped: "Your order is on its way to you.",
        delivered: "Your order has been successfully delivered.",
    };

    const getStatusIndex = (status) => {
        return statuses.indexOf(status);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading order...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
                <div className="max-w-md text-center">
                    <div className="text-5xl">⚠️</div>

                    <h1 className="mt-5 text-3xl font-black">
                        Order unavailable
                    </h1>

                    <p className="mt-3 text-slate-400">
                        {error || "We couldn't find this order."}
                    </p>

                    <Link
                        to="/orders"
                        className="mt-7 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Back to My Orders
                    </Link>
                </div>
            </main>
        );
    }

    const currentStatusIndex = getStatusIndex(order.orderStatus);

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/orders"
                        className="text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
                    >
                        ← Back to My Orders
                    </Link>

                    <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        Order Details
                    </p>

                    <h1 className="mt-3 text-4xl font-black">
                        Track your order
                    </h1>

                    <p className="mt-3 break-all font-mono text-sm text-slate-500">
                        #{order._id}
                    </p>
                </div>

                {/* Cancelled State */}
                {order.orderStatus === "cancelled" && (
                    <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                        <div className="flex gap-4">
                            <span className="text-2xl">✕</span>

                            <div>
                                <h2 className="font-bold text-red-400">
                                    Order Cancelled
                                </h2>

                                <p className="mt-1 text-sm text-red-300/70">
                                    This order has been cancelled.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tracking */}
                {order.orderStatus !== "cancelled" && (
                    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                                    Delivery Tracking
                                </p>

                                <h2 className="mt-2 text-2xl font-black capitalize">
                                    {statusLabels[order.orderStatus]}
                                </h2>
                            </div>

                            <span className="hidden text-4xl sm:block">🚚</span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            {statusDescriptions[order.orderStatus]}
                        </p>

                        <div className="mt-10">
                            {statuses.map((status, index) => {
                                const completed = index <= currentStatusIndex;
                                const current = index === currentStatusIndex;

                                return (
                                    <div
                                        key={status}
                                        className="relative flex gap-5"
                                    >
                                        {/* Connector */}
                                        {index < statuses.length - 1 && (
                                            <div
                                                className={`absolute left-[15px] top-8 h-16 w-0.5 ${index < currentStatusIndex
                                                    ? "bg-cyan-400"
                                                    : "bg-slate-700"
                                                    }`}
                                            />
                                        )}

                                        {/* Circle */}
                                        <div
                                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${completed
                                                ? "border-cyan-400 bg-cyan-400 text-slate-950"
                                                : "border-slate-700 bg-slate-900 text-slate-600"
                                                }`}
                                        >
                                            {completed ? "✓" : index + 1}
                                        </div>

                                        {/* Text */}
                                        <div className="pb-10">
                                            <p
                                                className={`font-bold ${current
                                                    ? "text-cyan-400"
                                                    : completed
                                                        ? "text-white"
                                                        : "text-slate-500"
                                                    }`}
                                            >
                                                {statusLabels[status]}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {completed
                                                    ? statusDescriptions[status]
                                                    : "Waiting for this stage."}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Order Content */}
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                    {/* Items */}
                    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                            Purchased Items
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                        </h2>

                        <div className="mt-6 space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
                                >
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="mt-2 font-bold text-cyan-400">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Summary */}
                    <aside className="h-fit space-y-5">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                                Delivery
                            </p>

                            <h2 className="mt-2 text-xl font-black">
                                Shipping Information
                            </h2>

                            <div className="mt-5 space-y-3 text-sm">
                                <p className="font-semibold text-white">
                                    {order.shippingAddress.fullName}
                                </p>

                                <p className="text-slate-400">
                                    {order.shippingAddress.address}
                                </p>

                                <p className="text-slate-400">
                                    {order.shippingAddress.city}
                                </p>

                                <p className="text-slate-400">
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                                Payment
                            </p>

                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Method
                                </span>

                                <span className="font-semibold capitalize">
                                    {order.paymentMethod.replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Payment Status
                                </span>

                                <span className="font-semibold capitalize text-yellow-400">
                                    {order.paymentStatus}
                                </span>
                            </div>

                            <div className="mt-6 border-t border-slate-800 pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-black text-cyan-400">
                                        ₦{order.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;