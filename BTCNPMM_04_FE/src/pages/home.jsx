import { useEffect, useState } from "react";
import { getProductsApi, getCategoriesApi, getRecentViewsApi, getFavouritesApi } from "../util/api";
import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [recentViews, setRecentViews] = useState([]);
    const [favourites, setFavourites] = useState([]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getProductsApi({
                page,
                limit,
                search,
                category: category === "all" ? "" : category,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            });

            const recentViewsRes = await getRecentViewsApi();
            if (recentViewsRes?.success) {
                setRecentViews(recentViewsRes.recentViews || []);
            }

            const favouritesRes = await getFavouritesApi();
            if (favouritesRes?.success) {
                setFavourites(favouritesRes.favourites || []);
            }

            console.log("Favourites:", favouritesRes?.favourites);

            if (res?.success) {
                setProducts(res.data || res.products || []);
                setTotal(res.pagination?.count || 0);
            } else {
                console.error("Lỗi load products:", res?.message);
                setProducts([]);
                setTotal(0);
            }

        } catch (err) {
            console.error("Lỗi load products:", err);
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            if (res?.categories) setCategories(res.categories);
        } catch (err) {
            console.error("Lỗi load categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, search, category, priceRange]);

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <Banner />
            <FilterBar
                search={search}
                setSearch={(val) => { setPage(1); setSearch(val); }}
                priceRange={priceRange}
                setPriceRange={(val) => { setPage(1); setPriceRange(val); }}
                category={category}
                setCategory={(val) => { setPage(1); setCategory(val); }}
                categories={categories}
            />
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
                <ProductList
                    products={products}
                    loading={loading}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    total={total}
                    recentViews={recentViews}
                    favourites={favourites}
                />
            </div>
        </div>
    );
};

export default HomePage;
