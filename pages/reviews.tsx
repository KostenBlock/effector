import { useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import { $reviews, $reviewsGetStatus, getReviewsFx, reset } from "~/store/reviews.store";

import Link from "next/link";

export default function Reviews() {
    const fetchEventReviews = useEvent(getReviewsFx);
    const { reviews, isLoading } = useStore($reviews);

    useEffect(() => {
        (async () => {
            await fetchEventReviews();
        })();
    }, []);

    return (
        <div>
            <Link href={"/"}>
                To gome
            </Link>
            <button
                onClick={() => reset()}
            >
                Сбросить
            </button>
            <ul>
                {reviews.map((review, index) => {
                    return (
                        <li key={index}>
                            {review.name}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
