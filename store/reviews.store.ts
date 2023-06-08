import axios from "axios";
import { combine, createEffect, createEvent, createStore, restore } from "effector";

import { ReviewI, ReviewPayloadI } from "~/types/reviews";

interface ReviewsStoreI {
    reviews: ReviewI[];
    isLoading: boolean;
    isError: boolean;
    [propName: string]: any;
}

export const getReviews = async () => {
    const { data: { feedbacks } } = await axios.post('https://service.1dogma.ru/admin/feadback/filter', {
        createAt: new Date().toISOString().split('T')[0].split('-').reverse().join("/"),
        statusPublished: "true",
        ofset: 0,
        limit: 12
    });
    return feedbacks;
};

export const update = createEvent<ReviewPayloadI>();

export const updateReview = async (data: ReviewPayloadI): Promise<ReviewPayloadI> => {
    return data;
};

export const getReviewsFx = createEffect<void, ReviewI[], Error>();
getReviewsFx.use(getReviews);

export const addReview = (reviews: ReviewI[], review: ReviewI): ReviewI[] => [
    ...reviews,
    review
];

export const setState = createEvent<Partial<ReviewsStoreI>>();

export const $reviews = createStore<ReviewsStoreI>({
    reviews: [],
    isLoading: false,
    isError: false
});

const serializeReviews = (state: ReviewsStoreI) =>
    state.reviews.map((review) => review.statusPublished = "hahaha");

export const $reviewsWithStatus = $reviews.map(serializeReviews);

export const $fetchError = restore<Error | null>(getReviewsFx.failData, null);

export const $reviewsGetStatus = combine({
    loading: getReviewsFx?.pending,
    error: $fetchError,
    data: $reviews,
});

$reviews
    .on(getReviewsFx, (state => ({ ...state, isLoading: true })))
    .on(getReviewsFx.doneData, (state, data) => ({ ...state, reviews: data }))
    .on(setState, ((state, payload) => {
        for (const key in payload) {
            if (Object.hasOwnProperty.call(payload, key) && Object.hasOwnProperty.call(state, key)) {
                state[key] = payload[key];
            }
        }
    }))