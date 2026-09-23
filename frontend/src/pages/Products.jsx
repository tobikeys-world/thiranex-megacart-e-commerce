import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError("");

                const response = await api.get("/products");

                setProducts(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load products. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        MegaCart Store
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-4xl font-black sm:text-5xl">
                                Explore Products
                            </h1>

                            <p className="mt-3 max-w-xl text-slate-400">
                                Discover products selected for your everyday needs.
                            </p>
                        </div>

                        <p className="text-sm text-slate-500">
                            {products.length} product{products.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-64 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

                            <p className="mt-4 text-sm text-slate-400">
                                Loading products...
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

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
                        <h2 className="text-2xl font-bold">
                            No products available
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Check back soon for new products.
                        </p>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Products;