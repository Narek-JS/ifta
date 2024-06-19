import { Fragment } from "react";
import { useSelector } from "react-redux";
import { selectIsUser } from "@/store/slices/auth";
import { IFTA_EMAIL, IFTA_PHONE } from "@/utils/constants";
import PhoneSvgIcon from "@/public/assets/svgIcons/PhoneSvgIcon";
import EmailSvgIcon from "@/public/assets/svgIcons/EmailSvgIcon";
import classNames from "classnames";
import Link from "next/link";

export default function TopPanel({ topPanel, width, staticTopPanel }) {
    const isAuth = useSelector(selectIsUser);

    return (
        <div
            ref={topPanel}
            className={classNames('topPanel mPadding flex gap40 alignCenter printNone', { staticTopPanel })}
        >
            <Link href={`tel:${IFTA_PHONE}`} className="contactItem flexBetween alignCenter gap5 primary">
                <PhoneSvgIcon/>
                <b className="font18 weight500">( 800 ) 341 - 2870</b>
            </Link>
            { isAuth || Number(width) > 768 ? (
                <Fragment>
                    <Link className="primary contactItem " href="/category/blogs">
                        Blogs
                    </Link>
                    <Link className="primary contactItem " href="/category/news">
                        News
                    </Link>
                </Fragment>
            ) : (
                <Fragment>
                    <Link className="primary contactItem topPanelSignIn" href="/sign-in">
                        Sign In
                    </Link>
                    <Link className="primary contactItem topPanelSignUp" href="/sign-up">
                        Sign Up
                    </Link>
                </Fragment>
            )}

            <Link href={`mailto: ${IFTA_EMAIL}`} className="contactItem flexBetween alignCenter gap5 primary mail">
                <EmailSvgIcon/>
                <b className="font18 weight500">{IFTA_EMAIL}</b>
            </Link>
        </div>
    );
};