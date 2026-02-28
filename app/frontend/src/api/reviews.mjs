import api from "./axios.mjs";

export const postReview = async (productId, comment, stars) => {
    return await api.post(`/reviews/${productId}`, {
        comment,
        stars
    })
}