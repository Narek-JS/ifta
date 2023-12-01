import "/styles/layout.scss";
import "/styles/global.scss";
import "/styles/home.scss";
import "/styles/post.scss";
import "/styles/about.scss";
import "/styles/auth.scss";
import "/styles/form.scss";
import "/styles/card.scss";
import "/styles/profile.scss";
import 'react-toastify/dist/ReactToastify.css';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import {store} from "@/store";
import { useEffect } from "react";
import Layout from "@/components/layout";
import Head from "next/head";

export default function App({Component, pageProps}) {

    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments)
        }

        gtag('js', new Date());
        gtag('config', 'AW-414658176');
    }, []);

    return (
        <GoogleOAuthProvider clientId="782238341262-bnd2npjdur258dr71oi5ukboet1l6746.apps.googleusercontent.com">
            <Provider store={store}>
                <Head>
                    <title>IFTA – International Fuel Tax Agreement</title>
                    <meta name="description" content="IFTA online"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="icon" href="/favicon.png"/>
                    <meta property="og:type" content="website" data-rh="true"/>
                    <meta property="og:image" content="/assets/images/banner1.png" data-rh="true"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1 minimum-scale=1 maximum-scale=1"/>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-414658176" />
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        (function(w,d,s,l,i){
                            w[l]=w[l]||[];
                            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                            var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                            j.async=true;
                            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                            f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-NL55PCNR');
                        `,
                    }} />

                </Head>
                <ToastContainer/>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </GoogleOAuthProvider>
    )
}