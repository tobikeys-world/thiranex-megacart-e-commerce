const Home = () => {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                        Welcome to MegaCart
                    </p>

                    <h1 className="text-5xl font-black leading-tight sm:text-6xl">
                        Everything you want.
                        <span className="block text-cyan-400">
                            One smart cart.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                        Discover quality products, build your cart and enjoy a simple,
                        secure checkout experience.
                    </p>

                    <button className="mt-8 rounded-full bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300">
                        Shop Now
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Home;