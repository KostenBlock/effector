import {AppProps} from "next/app";

import { attachReduxDevTools } from "@effector/redux-devtools-adapter";
attachReduxDevTools();

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
};