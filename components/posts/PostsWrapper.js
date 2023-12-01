import React, {useEffect, useState} from "react";
import {Pagination, PaginationItem} from "@mui/material";
import PostItem from "@/components/posts/PostItem";
import {useRouter} from "next/router";
import {useGetPostsQuery} from "@/store/slices/posts";
import Loader from "@/components/universalUI/Loader";

export default function PostsWrapper() {
    const router = useRouter();
    const pathname = router.pathname;
    const category = pathname.split("/")[2]
    const [page, setPage] = useState(null);

    const {data, isFetching} = useGetPostsQuery({category, page})
    const posts = data?.data?.posts

    const handleChange = (e, page) => {
        window.scrollTo({top: 0, behavior: "smooth"})
        setPage(page);
        router.replace({
            query: {
                ...router.query,
                page
            }
        })
    }

    useEffect(() => {
        if (router.query) {
            setPage(router.query.page || 1)
        };
    }, [router]);

    const count = data?.data?.pageCount;

    if (isFetching) return <Loader/>;

    return (
        <main className="page-main posts-page mPadding sectionPadding">
            <div className="title1 flex gap10 alignCenter mb30">
                <h1 className="font20 lighthouse-black">{category}</h1>
                <hr/>
            </div>
            {posts?.length ? <>
                <div className="posts-wrapper">
                    {posts.map((el, i) => (
                        <PostItem
                            data={el}
                            key={i}
                            all={true}
                        />
                    ))}
                </div>
                {posts.length < 10 && +page === 1 ? "" : <div className='pagination'>
                    <Pagination
                        count={count}
                        boundaryCount={1}
                        page={+page}
                        siblingCount={page < 3 ? 0 : 1}
                        onChange={handleChange}
                        renderItem={(item) => (
                            <PaginationItem
                                {...item}
                                last='Last'
                                page={item.page === count ? 'Last' : item.page || '...'}
                            />
                        )}
                        hidePrevButton
                        hideNextButton
                    />
                </div>}
            </> : <div className="flexCenter alignCenter primary60 font20 p20">
                No {category} yet.
            </div>}
        </main>
    )
}