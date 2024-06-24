import { useRouter } from "next/router";
import { API_URL } from "@/utils/constants";
import { Fragment, useEffect, useState } from "react";
import { Pagination, PaginationItem } from "@mui/material";

import Loader from "@/components/universalUI/Loader";
import PostItem from "@/components/posts/PostItem";

export default function PostsWrapper({ initialPosts, initialPageCount, category, initialPage }) {
    const router = useRouter();
    const [page, setPage] = useState(initialPage);
    const [posts, setPosts] = useState(initialPosts);
    const [count, setCount] = useState(initialPageCount);
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Function to handle page change in pagination.
    const handleChange = async (e, page) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setPage(page);
        router.replace({ query: { ...router.query, page } });
        await fetchData(category, page);
    };

    // Function to fetch posts data based on category and page.
    const fetchData = async (category, page) => {
        setIsFetching(true);
        const res = await fetch(`${API_URL}/category?slug=${category}&page=${page}`);
        const data = await res.json();
        setPosts(data?.data?.posts);
        setCount(data?.data?.pageCount);
        setIsFetching(false);
    };

    // Effect to set page from router query parameters.
    useEffect(() => {
        if (router.query) {
            setPage(router.query.page || 1);
        };
    }, [router]);

    // Effect to fetch posts data when category or page changes.
    useEffect(() => {
        // Skip fetching if it's the initial mount and we have initial posts.
        if (isInitialMount && initialPosts.length > 0) {
            setIsInitialMount(false);
            return;
        };

        if (category && page) {
            fetchData(category, page);
        };
    }, [category]);

    // Render loading spinner if fetching data.
    if (isFetching) {
        return <Loader />;
    };

    return (
        <main className="page-main posts-page mPadding sectionPadding">
            <div className="title1 flex gap10 alignCenter mb30">
                <h1 className="font20 lighthouse-black">{category}</h1>
                <hr />
            </div>
            {posts?.length ? (
                <Fragment>
                    <div className="posts-wrapper">
                        {posts.map((el, i) => (
                            <PostItem data={el} key={i} all={true} />
                        ))}
                    </div>
                    {posts.length < 10 && +page === 1 ? "" : (
                        <div className='pagination'>
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
                        </div>
                    )}
                </Fragment>
            ) : (
                <div className="flexCenter alignCenter primary60 font20 p20">
                    No {category} yet.
                </div>
            )}
        </main>
    );
};