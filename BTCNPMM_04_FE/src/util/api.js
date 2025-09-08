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
    return axios.get(URL_API);
};

export const getCategoriesApi = async () => {
    const URL_API = "v1/api/products-category"
    return axios.get(URL_API);
};


// Lấy chi tiết 1 sản phẩm theo id
const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    return axios.get(URL_API);
};

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
};
