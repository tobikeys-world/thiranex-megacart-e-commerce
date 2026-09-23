import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const {
        cartItems,
        cartCount,
        cartTotal,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10 text-4xl">
                        🛒
                    </div>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        Your Cart
                    </p>

                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                        Your cart is empty
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-slate-400">
                        Looks like you haven't added anything yet. Explore our products
                        and find something you like.
                    </p>

                    <Link
                        to="/products"
                        className="mt-8 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Start Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        MegaCart
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-4xl font-black sm:text-5xl">
                                Your Cart
                            </h1>

                            <p className="mt-3 text-slate-400">
                                {cartCount} item{cartCount !== 1 ? "s" : ""} ready for checkout.
                            </p>
                        </div>

                        <button
                            onClick={clearCart}
                            className="self-start rounded-full border border-red-500/30 px-5 py-2 text-sm font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-500/10"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Cart Items */}
                    <section className="space-y-4">
                        {cartItems.map((item) => (
                            <article
                                key={item._id}
                                className="flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                            >
                                {/* Product Image */}
                                <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-800 sm:w-28">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                        {item.category}
                                    </p>

                                    <h2 className="mt-1 truncate text-lg font-bold text-white">
                                        {item.name}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        ₦{item.price.toLocaleString()} each
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                                    <div className="flex items-center overflow-hidden rounded-full border border-slate-700">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity - 1)
                                            }
                                            className="px-4 py-2 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                                        >
                                            −
                                        </button>

                                        <span className="min-w-10 text-center text-sm font-bold text-white">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity + 1)
                                            }
                                            className="px-4 py-2 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="text-left sm:w-28 sm:text-right">
                                    <p className="text-xs text-slate-500">Total</p>
                                    <p className="mt-1 text-lg font-black text-cyan-400">
                                        ₦{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Order Summary */}
                    <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-28">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                            Order Summary
                        </p>

                        <h2 className="mt-3 text-2xl font-black">
                            Ready to checkout?
                        </h2>

                        <div className="mt-6 space-y-4 border-b border-slate-800 pb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Items</span>
                                <span className="font-semibold text-white">
                                    {cartCount}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="font-semibold text-white">
                                    ₦{cartTotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Delivery</span>
                                <span className="font-semibold text-cyan-400">
                                    Free
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-6">
                            <span className="text-slate-400">Total</span>

                            <span className="text-2xl font-black text-cyan-400">
                                ₦{cartTotal.toLocaleString()}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className="block w-full rounded-xl bg-cyan-400 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            to="/products"
                            className="mt-3 block text-center text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
                        >
                            ← Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Cart;