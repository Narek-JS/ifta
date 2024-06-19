import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Reply from "@/components/posts/Reply";
import PostItem from "@/components/posts/PostItem";
import Loader from "@/components/universalUI/Loader";
import UserSvgIcon from "@/public/assets/svgIcons/UserSvgIcon";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { MessageIcon } from "@/public/assets/svgIcons/MessageIcon";
import { CalendarIcon } from "@/public/assets/svgIcons/CalendarIcon";
import { FacebookIcon } from "@/public/assets/svgIcons/FacebookIcon";
import { TwitterIcon } from "@/public/assets/svgIcons/TwitterIcon";
import { LinkedinIcon } from "@/public/assets/svgIcons/LinkedinIcon";
import { dateFormat, ImageLoader } from "@/utils/helpers";
import { useRouter } from "next/router";
import { API_URL } from "@/utils/constants";

// Function to get comments JSX
const getCommentJSX = (comment) => (
  <div className="commentItem mb20" key={comment.id}>
    <div className="flex alignCenter gap5 mb10">
      <UserSvgIcon />
      <div>
        <p className="primary">{comment?.name}</p>
        <span className="primary60 font14">{dateFormat(comment.created_at)}</span>
      </div>
    </div>
    <p className="primary60">{comment.comments}</p>
  </div>
);

// Function to get related post JSX
const getRelatedPostJSX = (relatedPost, index) => (
  <div className="nth-blog" key={index}>
    <Link href={`/post/singlePost?slug=${relatedPost.slug}&category_id=${relatedPost.category_id}`} className="img">
      <Image src={relatedPost.image} width={240} height={200} loader={ImageLoader} alt='Post' />
    </Link>
    <div className='blog-content'>
      <div className='flex alignCenter date gap10'>
        <span className="icon-Vector-14 icon"></span>
        <span className='primary60 font-16 weight500 date-text'>{dateFormat(relatedPost.updated_at)}</span>
        <Link href={`/category/${relatedPost.category.slug}`} className="secondary category">{relatedPost.category?.name}</Link>
      </div>
      <p className="primary textCenter blog-title line34">{relatedPost.title}</p>
    </div>
  </div>
);

export default function SinglePost({ postData, latestPostsData }) {
  const router = useRouter();
  const commentRef = useRef();
  const [url, setUrl] = useState("");

  const data = postData?.post;

  useEffect(() => {
    setUrl(window.location.href);
  }, [router]);

  const commentsJSX = useMemo(() => {
    if (!data?.comment?.length) {
      return null;
    };

    return (
      <div ref={commentRef} className="related-posts comments mb30">
        <div className="flex gap10 alignCenter mb30">
          <p className="arrow-right color-s">
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#072765" d="M1 2L15 10.3478L1 18" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          </p>
          <p className="secondary weight700 font24">Responses ({data.comment.length})</p>
        </div>
        {data.comment.map(getCommentJSX)}
      </div>
    );
  }, [data?.comment]);

  const relatedPostsJSX = useMemo(() => {
    if (!postData?.relatedPosts?.length) {
      return null;
    };

    return (
      <div className="related-posts mb30">
        <div className="flex gap10 alignCenter mb30">
          <p className="arrow-right color-s">
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 2L15 10.3478L1 18" stroke="#F3BD1B" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          </p>
          <p className="primary weight700 font24">You Might Also Like</p>
        </div>
        <div className="posts-container flexBetween gap20">
          {postData.relatedPosts.map(getRelatedPostJSX)}
        </div>
      </div>
    );
  }, [postData?.relatedPosts]);

  const latestPostsJSX = useMemo(() => {
    if (!latestPostsData?.length) {
      return null;
    };

    return latestPostsData.map((item, index) => (
      <div className="right-side-post" key={index}>
        <PostItem data={item} />
      </div>
    ));
  }, [latestPostsData]);

  if (!data) {
    return <Loader />;
  };

  return (
    <Fragment>
      <Head>
        <title>{data.title}</title>
        <meta property="og:title" content={data.title} data-rh="true" />
        <meta property="og:type" content="website" data-rh="true" />
        <meta property="og:image" content={data.image} data-rh="true" />
      </Head>
      <main className="page-main mPadding sectionPadding single-post">
        <div className="flexBetween gap40">
          <div className="left-side">
            <div className="title1 flex gap10 alignCenter mb30">
              <h1 className="font20 lighthouse-black">{data.category?.name}hahahah</h1>
              <hr />
            </div>
            <div className="main-img mb20">
              <Image width={780} height={520} src={data.image} loader={ImageLoader} alt="post" />
            </div>
            <div className="flexBetween alignCenter date-socials mb30">
              <div className='flex alignCenter date gap10'>
                <CalendarIcon />
                <span className='primary60 font16 weight500 date-text'>{dateFormat(data.updated_at)}</span>
                <Link href="/category/blogs" className="lighthouse-black underline">Blogs</Link>
                <div
                  onClick={() => commentRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="flex pointer alignCenter gap5"
                >
                  <MessageIcon />
                  <span className="primary60">{data?.comment?.length || 0}</span>
                </div>
              </div>
              <div className="social-sharing flexBetween alignCenter gap20 font18">
                <b className="primary80 font20">Share</b>
                <FacebookShareButton url={url} quote={"フェイスブックはタイトルが付けれるようです"} hashtag={"#hashtag"} description={"aiueo"}>
                  <FacebookIcon />
                </FacebookShareButton>
                <TwitterShareButton title={"test"} url={url} hashtags={["hashtag1", "hashtag2"]}>
                  <TwitterIcon />
                </TwitterShareButton>
                <LinkedinShareButton title="title" url={url} source={url} summary="summary">
                  <LinkedinIcon />
                </LinkedinShareButton>
              </div>
            </div>
            <h2 className='font32 primary weight700 postTitle mb30 line34'>{data.title}</h2>
            <div className="content mb20 primary" dangerouslySetInnerHTML={{ __html: data.body }}></div>

            {/* Comments JSX from useMemo response */}
            {commentsJSX}

            {/* Related Posts JSX from useMemo response */}
            {relatedPostsJSX}

            <Reply id={data?.id} />
          </div>
          <div className="right-side">
            <h3 className="primary mb40">Latest {data.category_id === 2 ? "News" : "Posts"}</h3>
            <div className="posts">
              {/* Latest Posts JSX from useMemo response */}
              {latestPostsJSX}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

// Fetch data on the server-side
async function getServerSideProps(context) {
  const { slug, category_id } = context.query;
  console.log('slug, category_id --> ', {slug, category_id});
  
  // Fetch single post data
  const postResponse = await fetch(`${API_URL}/posts/${slug}`);
  const postData = await postResponse.json();

  // Fetch latest posts data
  const latestCategory = +category_id === 1 ? 2 : 1;
  const latestResponse = await fetch(`${API_URL}/getLast2Data?category=${latestCategory}&limit=2`);
  const latestPostsData = await latestResponse.json();

  return {
    props: {
      postData: postData.data,
      latestPostsData: latestPostsData.data
    }
  };
}