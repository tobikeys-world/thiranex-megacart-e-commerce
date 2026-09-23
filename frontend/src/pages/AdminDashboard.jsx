import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
};

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchAdminData = async () => {
        try {
            const [productsResponse, ordersResponse] = await Promise.all([
                api.get("/products"),
                api.get("/orders"),
            ]);

            setProducts(productsResponse.data);
            setOrders(ordersResponse.data);
        } catch (error) {
            console.error("Failed to load admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const processingOrders = orders.filter(
        (order) => order.orderStatus === "processing"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "delivered"
    ).length;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, productData);
                alert("Product updated successfully.");
            } else {
                await api.post("/products", productData);
                alert("Product added successfully.");
            }

            setFormData(emptyForm);
            setEditingId(null);
            await fetchAdminData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/products/${id}`);

            alert("Product deleted successfully.");

            await fetchAdminData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete product.");
        }
    };
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, {
                orderStatus: newStatus,
            });

            await fetchAdminData();

            alert("Order status updated successfully.");
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Failed to update order status."
            );
        }
    };
    const cancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-600">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        MegaCart Control Center
                    </p>

                    <h1 className="text-4xl font-black tracking-tight">
                        Admin Dashboard
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Manage products, monitor orders and keep your store running.
                    </p>
                </div>

                {/* Statistics */}
                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Total Products</p>
                        <p className="mt-3 text-4xl font-black text-cyan-400">
                            {products.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Total Orders</p>
                        <p className="mt-3 text-4xl font-black">
                            {orders.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Processing</p>
                        <p className="mt-3 text-4xl font-black text-amber-400">
                            {processingOrders}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Delivered</p>
                        <p className="mt-3 text-4xl font-black text-emerald-400">
                            {deliveredOrders}
                        </p>
                    </div>
                </section>

                {/* Product Form */}
                <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {editingId ? "Edit Product" : "Add Product"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {editingId
                                    ? "Update the selected product."
                                    : "Add a new item to your store catalog."}
                            </p>
                        </div>

                        {editingId && (
                            <button
                                onClick={cancelEdit}
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Product name"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Category"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price"
                            min="0"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Stock quantity"
                            min="0"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Product image URL"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400 md:col-span-2"
                        />

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Product description"
                            rows="4"
                            required
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400 md:col-span-2"
                        />

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 md:col-span-2"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Product"
                                    : "Add Product"}
                        </button>
                    </form>
                </section>

                {/* Products */}
                <section className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold">Product Catalog</h2>
                        <p className="text-sm text-slate-400">
                            Manage everything currently available in MegaCart.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-48 w-full object-cover"
                                />

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold">{product.name}</h3>
                                            <p className="mt-1 text-xs text-cyan-400">
                                                {product.category}
                                            </p>
                                        </div>

                                        <span className="text-sm font-bold text-emerald-400">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                                        {product.description}
                                    </p>

                                    <p className="mt-4 text-sm">
                                        Stock:{" "}
                                        <span className="font-bold">{product.stock}</span>
                                    </p>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Orders */}
                <section className="mt-12">
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold">Recent Orders</h2>
                        <p className="text-sm text-slate-400">
                            Monitor customer orders.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                        <table className="w-full min-w-[800px] text-left">
                            <thead className="border-b border-slate-800 text-sm text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.slice(0, 8).map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b border-slate-800 last:border-0"
                                    >
                                        <td className="px-6 py-4 font-mono text-sm text-cyan-400">
                                            #{order._id.slice(-8)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-semibold">
                                                {order.user?.name || "Customer"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {order.user?.email || "No email"}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 font-semibold">
                                            ₦{order.totalAmount.toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)
                                                }
                                                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm capitalize outline-none focus:border-cyan-400"
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminDashboard;