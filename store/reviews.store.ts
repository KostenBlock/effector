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

export const addReview = (reviews: ReviewI[]): ReviewI[] => [
    ...reviews,
    {
        feadback: "pizdec",
        name: "kosta",
        statusPublished: "true",
        createAt: "23-02-13",
        idMongo: "13103-1254-124321"
    }
];

export const setStateHandler = (state: ReviewsStoreI, payload: Partial<ReviewsStoreI>): ReviewsStoreI => {
    for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key) && Object.hasOwnProperty.call(state, key)) {
            return {
                ...state,
                ...payload
            }
        }
    }
}

export const setState = createEvent<Partial<ReviewsStoreI>>();
export const add = createEvent<ReviewI>();

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
    .on(setState, ((state, payload) => setStateHandler(state, payload)))
    .on(add, (state) => ({
        ...state,
        reviews: addReview(state.reviews)
    }))