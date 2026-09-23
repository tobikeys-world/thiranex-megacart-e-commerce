import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="relative aspect-square overflow-hidden bg-slate-800">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-cyan-400 backdrop-blur">
                    {product.category}
                </span>

                {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h2 className="line-clamp-1 text-lg font-bold text-white">
                    {product.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                    {product.description}
                </p>

                <div className="mt-5">
                    <p className="text-xs text-slate-500">Price</p>

                    <p className="text-xl font-black text-cyan-400">
                        ₦{product.price.toLocaleString()}
                    </p>
                </div>

                <div className="mt-5 flex gap-2">
                    <Link
                        to={`/products/${product._id}`}
                        className="flex-1 rounded-full border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
                    >
                        View
                    </Link>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;