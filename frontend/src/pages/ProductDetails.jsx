import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
                <div className="mx-auto max-w-6xl text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
                    <p className="mt-4 text-slate-400">
                        Loading product...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
                <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
                    <h1 className="text-2xl font-bold">
                        Product not found
                    </h1>

                    <p className="mt-3 text-red-400">
                        {error || "This product does not exist."}
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        ← Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">

                <Link
                    to="/products"
                    className="mb-8 inline-flex items-center text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                    ← Back to Products
                </Link>

                <div className="grid overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 lg:grid-cols-2">

                    {/* Product Image */}
                    <div className="flex min-h-[400px] items-center justify-center bg-slate-800/50 p-8">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-[450px] w-full rounded-2xl object-contain"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center p-8 lg:p-12">

                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                            {product.category}
                        </p>

                        <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                            {product.name}
                        </h1>

                        <p className="mt-6 leading-7 text-slate-400">
                            {product.description}
                        </p>

                        <div className="mt-8">
                            <span className="text-3xl font-black text-white">
                                ₦{product.price.toLocaleString()}
                            </span>
                        </div>

                        <div className="mt-5">
                            {product.stock > 0 ? (
                                <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                                    {product.stock} units available
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-400">
                                    Out of stock
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="mt-8 rounded-full bg-cyan-400 px-7 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {product.stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"}
                        </button>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;