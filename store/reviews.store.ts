import axios from "axios";
import {combine, createEffect, createEvent, createStore, restore, split} from "effector";

import { ReviewI, ReviewPayloadI } from "~/types/reviews";

interface ReviewsStoreI {
    reviews: ReviewI[];
    reviewsSer: ReviewI[];
    isLoading: boolean;
    isError: boolean;
    [propName: string]: any;
}

export const getReviews = async (name: string) => {
    const response = await fetch('https://service.1dogma.ru/admin/feadback/filter', {
        method: 'POST',
        body: JSON.stringify({
            createAt: new Date().toISOString().split('T')[0].split('-').reverse().join("/"),
            statusPublished: "true",
            ofset: 0,
            limit: 12
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const { feedbacks }: { feedbacks: ReviewI[] } = await response.json();
    return feedbacks;
};

export const update = createEvent<ReviewPayloadI>();

export const updateReview = async (data: ReviewPayloadI): Promise<ReviewPayloadI> => {
    return data;
};

export const getReviewsFx = createEffect<string, ReviewI[], Error>();
getReviewsFx.use(getReviews);

getReviewsFx.doneData.watch((data) => {
    // console.log(data)
})

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

export const setStateHandler = (state: ReviewsStoreI, payload: Partial<ReviewsStoreI>) => {
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
export const reset = createEvent();

export const $reviews = createStore<ReviewsStoreI>({
    reviews: [],
    reviewsSer: [],
    isLoading: false,
    isError: false
});

const serializeReviews = (state: ReviewsStoreI) =>{
    return state.reviewsSer = state.reviews.map((review) => ({ ...review, statusPublished: 'Huita' }));
}

export const $reviewsWithStatus = $reviews.map(serializeReviews);

export const $fetchError = restore<Error>(getReviewsFx.failData, null);

export const $reviewsGetStatus = combine({
    loading: getReviewsFx.pending,
    error: $fetchError,
    data: $reviews
});

$reviews
    .on(getReviewsFx, (state) => setStateHandler(state, { isLoading: true }))
    .on(getReviewsFx.doneData, (state, data) => setStateHandler(state, { reviews: data, isLoading: false }))
    .on(getReviewsFx.fail, (state, data) => setStateHandler(state, { isLoading: false }))
    .on(setState, ((state, payload) => setStateHandler(state, payload)))
    .reset(reset);