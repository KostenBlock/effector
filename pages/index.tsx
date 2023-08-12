import { useEffect } from "react";
import { useRouter } from "next/router";

import { createEffect, createStore } from 'effector'
import { useEvent, useStore } from 'effector-react'
import { $reviews } from "~/store/reviews.store";

const fetchDirectusDataFx = createEffect(async (name: string) => {
    const result = await fetch(`https://tools.1dogma.ru/items/${name}`, {
        headers: {
            authorization: `Bearer q7fPV3gDm_uTnUv_mUI68Uyz-ds51NDf`
        }
    })
    return result.json();
})

const $directusData = createStore({});

$directusData
    .on(fetchDirectusDataFx, (state) => ({ ...state, loading: true }))
    .on(fetchDirectusDataFx.doneData, (state, result) => {
        return {
            ...result,
            loading: false
        }
    })
    .on(fetchDirectusDataFx.fail, (state, _) => {
        return {
            ...state,
            error: true
        }
    })

export default function Sample() {
    const data = useStore($directusData)
    const { reviews } = useStore($reviews)
    const fetchEvent = useEvent(fetchDirectusDataFx);
    const { push } = useRouter();

    const loading = useStore(fetchDirectusDataFx.pending)

    useEffect(() => {
        (async () => {
            await fetchEvent("calltouch_phone_number");
        })();
    }, []);

    return (
        <div>
            <h1 onClick={() => push("/kaka")}>Kaka</h1>
        </div>
    )
}
