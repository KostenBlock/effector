import { useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import { $reviews, getReviewsFx } from "~/store/reviews.store";

import Link from "next/link";

import { GetStaticProps } from "next";

interface Props {
    data: any
}

export default function Reviews({ data }: Props) {
    const { reviews, reviewsSer } = useStore($reviews);

    useEffect(() => {
        (async () => {
            await getReviewsFx('kak_tak');
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

export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS}/items/dp_header`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_STATIC_TOKEN}`
        },
    });

    const { data } = await response.json();

    return {
        props: {
            data
        },
        revalidate: 20
    }
}
