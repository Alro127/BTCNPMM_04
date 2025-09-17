import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    };

    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    };

    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
};

// Lấy danh sách sản phẩm (có phân trang)
const getProductsApi = ({ page = 1, limit = 8, search = "", category = "", minPrice = 0, maxPrice = 999999999 }) => {
    const URL_API = `/v1/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log(URL_API);
    return axios.get(URL_API);
};

const getCategoriesApi = async () => {
    const URL_API = "v1/api/products-category"
    return axios.get(URL_API);
};


// Lấy chi tiết 1 sản phẩm theo id
const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    console.log("Fetching product by id from URL:", URL_API);
    return axios.get(URL_API);
};

const increaseViewApi = async (id) => {
    const URL_API = `/v1/api/products/${id}/view`;
    return axios.patch(URL_API);
};

const getCommentCountApi = async (productId) => {
    const URL_API = `/v1/api/products/${productId}/comments/count`;
    return axios.get(URL_API);
}

const getCommentsByProductApi = async (productId) => {
    const URL_API = `/v1/api/products/${productId}/comments`;
    return axios.get(URL_API);
}

const createCommentApi = async (productId, content) => {
    const URL_API = `/v1/api/products/${productId}/new-comment`;
    const data = { content };
    return axios.post(URL_API, data);
}

const recordRecentViewApi = async (productId) => {
    const URL_API = `/v1/api/products/${productId}/record-recent-view`;
    return axios.post(URL_API);
}

const getRecentViewsApi = async () => {
    const URL_API = `/v1/api/recent-views`;
    return axios.get(URL_API);
}

const getFavouritesApi = async () => {
    const URL_API = `/v1/api/favourites`;
    return axios.get(URL_API);
}

const recordFavouriteApi = async (productId) => {
    const URL_API = `/v1/api/products/${productId}/record-favourite`;
    return axios.post(URL_API);
}

const getRelatedProductsApi = async (productId, limit = 4) => {
    const URL_API = `/v1/api/products/related?productId=${productId}&limit=${limit}`;
    return axios.get(URL_API);
}
// Thêm sản phẩm mới (chỉ khi đã login có token)
// const createProductApi = (product) => {
//     const URL_API = "/v1/api/products/new";
//     return axios.post(URL_API, product);
// };

export {
    createUserApi,
    loginApi,
    getUserApi,
    getProductsApi,
    getProductByIdApi,
    getCategoriesApi,
    increaseViewApi,
    getCommentCountApi,
    getCommentsByProductApi,
    createCommentApi,
    recordRecentViewApi,
    getRecentViewsApi,
    getFavouritesApi,
    recordFavouriteApi,
    getRelatedProductsApi,
};
