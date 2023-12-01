import Head from "next/head";
import Link from "next/link";
import Reply from "@/components/posts/Reply";
import PostItem from "@/components/posts/PostItem";
import React, {Fragment, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {dateFormat, ImageLoader} from "@/utils/helpers";
import {FacebookShareButton, LinkedinShareButton, TwitterShareButton} from "react-share";
import {useRouter} from "next/router";
import {useGetLatestPostsQuery, useGetSinglePostQuery} from "@/store/slices/posts";
import Loader from "@/components/universalUI/Loader";
import UserSvgIcon from "@/public/assets/svgIcons/UserSvgIcon";

export default function SinglePost() {
    const router = useRouter();
    const commentRef = useRef();
    const [url, setUrl] = useState("");
    const {slug, category_id} = router.query;

    const {data: postData, isFetching} = useGetSinglePostQuery(slug);
    const {data: latestData,} = useGetLatestPostsQuery(+category_id === 1 ? 2 : 1);

    const data = postData?.data?.post;
    const latest = latestData?.data;
    const relatedPosts = postData?.data?.relatedPosts;

    useEffect(() => {
        setUrl(window.location.href);
    }, [router]);

    if (isFetching || !data) {
        return <Loader/>
    }

    return (
        <Fragment>
            <Head>
                <title>{data.title}</title>
                <meta property="og:title" content={data.title} data-rh="true"/>
                <meta property="og:type" content="website" data-rh="true"/>
                <meta property="og:image" content={data.image} data-rh="true"/>
            </Head>
            <main className="page-main mPadding sectionPadding single-post">
                <div className="flexBetween gap40">
                    <div className="left-side">
                        <div className="title1 flex gap10 alignCenter mb30">
                            <h1 className="font20 lighthouse-black">{data.category?.name}</h1>
                            <hr/>
                        </div>
                        <div className="main-img mb20">
                            <Image width={780} height={520} src={data.image} loader={ImageLoader} alt="post"/>
                        </div>
                        <div className="flexBetween alignCenter date-socials mb30">
                            <div className='flex alignCenter date gap10'>
                                <svg width="24" height="30" viewBox="0 0 24 30" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 17.5C11.7167 17.5 11.4793 17.38 11.288 17.14C11.096 16.9008 11 16.6042 11 16.25C11 15.8958 11.096 15.5987 11.288 15.3587C11.4793 15.1196 11.7167 15 12 15C12.2833 15 12.521 15.1196 12.713 15.3587C12.9043 15.5987 13 15.8958 13 16.25C13 16.6042 12.9043 16.9008 12.713 17.14C12.521 17.38 12.2833 17.5 12 17.5ZM8 17.5C7.71667 17.5 7.479 17.38 7.287 17.14C7.09567 16.9008 7 16.6042 7 16.25C7 15.8958 7.09567 15.5987 7.287 15.3587C7.479 15.1196 7.71667 15 8 15C8.28333 15 8.521 15.1196 8.713 15.3587C8.90433 15.5987 9 15.8958 9 16.25C9 16.6042 8.90433 16.9008 8.713 17.14C8.521 17.38 8.28333 17.5 8 17.5ZM16 17.5C15.7167 17.5 15.4793 17.38 15.288 17.14C15.096 16.9008 15 16.6042 15 16.25C15 15.8958 15.096 15.5987 15.288 15.3587C15.4793 15.1196 15.7167 15 16 15C16.2833 15 16.5207 15.1196 16.712 15.3587C16.904 15.5987 17 15.8958 17 16.25C17 16.6042 16.904 16.9008 16.712 17.14C16.5207 17.38 16.2833 17.5 16 17.5ZM12 22.5C11.7167 22.5 11.4793 22.38 11.288 22.14C11.096 21.9008 11 21.6042 11 21.25C11 20.8958 11.096 20.5992 11.288 20.36C11.4793 20.12 11.7167 20 12 20C12.2833 20 12.521 20.12 12.713 20.36C12.9043 20.5992 13 20.8958 13 21.25C13 21.6042 12.9043 21.9008 12.713 22.14C12.521 22.38 12.2833 22.5 12 22.5ZM8 22.5C7.71667 22.5 7.479 22.38 7.287 22.14C7.09567 21.9008 7 21.6042 7 21.25C7 20.8958 7.09567 20.5992 7.287 20.36C7.479 20.12 7.71667 20 8 20C8.28333 20 8.521 20.12 8.713 20.36C8.90433 20.5992 9 20.8958 9 21.25C9 21.6042 8.90433 21.9008 8.713 22.14C8.521 22.38 8.28333 22.5 8 22.5ZM16 22.5C15.7167 22.5 15.4793 22.38 15.288 22.14C15.096 21.9008 15 21.6042 15 21.25C15 20.8958 15.096 20.5992 15.288 20.36C15.4793 20.12 15.7167 20 16 20C16.2833 20 16.5207 20.12 16.712 20.36C16.904 20.5992 17 20.8958 17 21.25C17 21.6042 16.904 21.9008 16.712 22.14C16.5207 22.38 16.2833 22.5 16 22.5ZM5 27.5C4.45 27.5 3.979 27.2554 3.587 26.7663C3.19567 26.2763 3 25.6875 3 25V7.5C3 6.8125 3.19567 6.22417 3.587 5.735C3.979 5.245 4.45 5 5 5H6V2.5H8V5H16V2.5H18V5H19C19.55 5 20.021 5.245 20.413 5.735C20.8043 6.22417 21 6.8125 21 7.5V25C21 25.6875 20.8043 26.2763 20.413 26.7663C20.021 27.2554 19.55 27.5 19 27.5H5ZM5 25H19V12.5H5V25Z"
                                        fill="#F3BD1B"/>
                                </svg>
                                <span
                                    className='primary60 font16 weight500 date-text'>{dateFormat(data.updated_at)}</span>
                                <Link href="/category/blogs" className="lighthouse-black underline">Blogs</Link>
                                <div onClick={()=>{
                                    commentRef.current?.scrollIntoView({behavior: "smooth"})
                                }} className="flex pointer alignCenter gap5">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M7.268 18.732L5 21V16.843C3.75 15.383 3 13.524 3 11.5C3 6.806 7.03 3 12 3C16.97 3 21 6.806 21 11.5C21 16.194 16.97 20 12 20C10.338 20.0053 8.70464 19.5676 7.268 18.732Z"
                                              fill="#FFBF00"/>
                                    </svg>
                                    <span className="primary60">{data?.comment?.length || 0}</span>
                                </div>
                            </div>
                            <div className="social-sharing flexBetween alignCenter gap20 font18">
                                <b className="primary80 font20">Share</b>
                                <FacebookShareButton
                                    url={url}
                                    quote={"フェイスブックはタイトルが付けれるようです"}
                                    hashtag={"#hashtag"}
                                    description={"aiueo"}
                                >
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20.2139 16.125L20.8363 12.8675H16.9452V10.7535C16.9452 9.8625 17.4886 8.9935 19.2312 8.9935H21V6.22C19.9617 6.08528 18.9124 6.01175 17.8607 6C14.658 6 12.5618 7.56 12.5618 10.3845V12.867H9V16.125H12.5618V24H16.9452V16.125H20.2139Z"
                                            fill="#F3BD1B"/>
                                    </svg>
                                </FacebookShareButton>
                                <TwitterShareButton
                                    title={"test"}
                                    url={url}
                                    hashtags={["hashtag1", "hashtag2"]}
                                >
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M23.8 9.69412C23.1816 9.99059 22.5151 10.1854 21.8245 10.2786C22.5312 9.82965 23.0772 9.11812 23.3342 8.26259C22.6677 8.68612 21.9289 8.98259 21.1499 9.152C20.5155 8.42353 19.6241 8 18.6122 8C16.725 8 15.1832 9.62635 15.1832 11.6339C15.1832 11.9219 15.2153 12.2014 15.2715 12.464C12.4126 12.3115 9.86692 10.8631 8.17247 8.66918C7.87533 9.20282 7.70669 9.82965 7.70669 10.4904C7.70669 11.7525 8.30899 12.8706 9.24054 13.5059C8.67036 13.5059 8.14034 13.3365 7.67457 13.0824V13.1078C7.67457 14.8696 8.8631 16.3435 10.4371 16.6739C9.93175 16.8198 9.40122 16.84 8.88719 16.7332C9.10531 17.4553 9.53248 18.0871 10.1087 18.5399C10.6848 18.9927 11.381 19.2436 12.0994 19.2574C10.8817 20.2743 9.37223 20.8239 7.81912 20.816C7.54608 20.816 7.27304 20.7991 7 20.7652C8.52581 21.7986 10.3407 22.4 12.2841 22.4C18.6122 22.4 22.0895 16.8602 22.0895 12.0574C22.0895 11.8965 22.0895 11.744 22.0815 11.5831C22.756 11.0748 23.3342 10.4311 23.8 9.69412Z"
                                            fill="#F3BD1B"/>
                                    </svg>
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    title="title"
                                    url={url}
                                    source={url}
                                    summary="summary"
                                >
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.5257 8.8675C10.5255 9.36254 10.3395 9.83721 10.0088 10.1871C9.67799 10.537 9.22951 10.7334 8.76197 10.7331C8.29443 10.7329 7.84614 10.536 7.5157 10.1858C7.18527 9.83554 6.99977 9.36067 7 8.86563C7.00023 8.37059 7.18619 7.89592 7.51695 7.54604C7.84772 7.19617 8.2962 6.99975 8.76374 7C9.23127 7.00025 9.67957 7.19714 10.01 7.54736C10.3404 7.89759 10.5259 8.37245 10.5257 8.8675ZM10.5786 12.1153H7.05289V23.8H10.5786V12.1153ZM16.1492 12.1153H12.6411V23.8H16.114V17.6683C16.114 14.2525 20.3184 13.9352 20.3184 17.6683V23.8H23.8V16.3991C23.8 10.6407 17.5771 10.8554 16.114 13.6832L16.1492 12.1153Z"
                                            fill="#F3BD1B"/>
                                    </svg>
                                </LinkedinShareButton>
                            </div>
                        </div>
                        <h1 className='font32 primary weight700 postTitle mb30 line34'>{data.title}</h1>
                        <div className="content mb20 primary" dangerouslySetInnerHTML={{__html: data.body}}></div>
                        {data?.comment?.length ? <div ref={commentRef} className="related-posts comments mb30">
                            <div className="flex gap10 alignCenter mb30">
                                <p className="arrow-right color-s">
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path stroke="#072765" d="M1 2L15 10.3478L1 18" strokeWidth="3"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </p>
                                <p className="secondary weight700 font24">Responses ({data.comment.length})</p>
                            </div>
                            {data.comment.map(el => (
                                <div className="commentItem mb20" key={el.id}>
                                    <div className="flex alignCenter gap5 mb10">
                                        <UserSvgIcon/>
                                        <div>
                                            <p className="primary">{el?.name}</p>
                                            <span className="primary60 font14">{dateFormat(el.created_at)}</span>
                                        </div>
                                    </div>
                                    <p className="primary60">{el.comments}</p>
                                </div>
                            ))}
                        </div> : ""}
                        {relatedPosts.length ? <div className="related-posts mb30">
                            <div className="flex gap10 alignCenter mb30">
                                <p className="arrow-right color-s">
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 2L15 10.3478L1 18" stroke="#F3BD1B" strokeWidth="3"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </p>
                                <p className="primary weight700 font24">You Might Also Like</p>
                            </div>
                            <div className="posts-container flexBetween gap20">
                                {relatedPosts?.map((el, i) => (
                                    <div className="nth-blog" key={i}>
                                        <Link href={`/post?slug=${el.slug}&category_id=${el.category_id}`}
                                              className="img">
                                            <Image src={el.image} width={240} height={200} loader={ImageLoader}
                                                   alt='Post'/>
                                        </Link>
                                        <div className='blog-content'>
                                            <div className='flex alignCenter date gap10'>
                                                <span className="icon-Vector-14 icon"></span>
                                                <span
                                                    className='primary60 font-16 weight500 date-text'>{dateFormat(el.updated_at)}</span>
                                                <Link href={`/category/${el.category.slug}`}
                                                      className="secondary category">{el.category?.name}</Link>
                                            </div>
                                            <p className="primary textCenter blog-title line34">{el.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> : ""}
                        <Reply id={data?.id}/>
                    </div>
                    <div className="right-side">
                        <h3 className="primary mb40">Latest {data.category_id === 2 ? "News" : "Posts"}</h3>
                        <div className="posts">
                            {latest?.map((item, idx) => (
                                <div className="right-side-post" key={idx}>
                                    <PostItem
                                        data={item}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}