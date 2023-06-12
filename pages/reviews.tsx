import { useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import { $reviews, getReviewsFx } from "~/store/reviews.store";

import Link from "next/link";

export default function Reviews() {
    const fetchEventReviews = useEvent(getReviewsFx);
    const { reviews } = useStore($reviews);

    useEffect(() => {
        (async () => {
            await getReviewsFx();
        })();
    }, []);

    return (
        <div>
            <Link href={"/"}>
                To gome
            </Link>
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
