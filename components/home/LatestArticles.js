import Link from "next/link";
import PostItem from "@/components/posts/PostItem";
import {useGetLatestPostsQuery} from "@/store/slices/posts";

export default function LatestArticles() {

    const { data } = useGetLatestPostsQuery(0);
    const blogs = data?.data.blogs;
    const news = data?.data.news;

    if (!blogs?.length && !news?.length) {
        return null;
    }

    return (
        <div className="latestArticles mPadding">
            <hr className="hr"/>
            <h1 className="font20 primary weight500">Our Latest Articles</h1>
            <div className="container flexBetween">
                <div className="posts">
                    <Link href="category/blogs" className="weight500 primary font18">Latest Blogs</Link>
                    <div className="flexBetween self">
                        {blogs?.[0] && <PostItem
                            compact={true}
                            data={blogs[0]}
                            btnName="Read More"
                        />}
                        {blogs?.[1] && <PostItem
                            compact={true}
                            data={blogs[1]}
                            btnName="Read More"
                        />}
                    </div>
                </div>
                <div className="posts">
                    <Link href="category/news" className="weight500 primary font18">Latest News</Link>
                    <div className="flexBetween self">
                        {news?.[0] && <PostItem
                            compact={true}
                            data={news[0]}
                            btnName="Read More"
                        />}
                        {news?.[1] && <PostItem
                            compact={true}
                            data={news[1]}
                            btnName="Read More"
                        />}
                    </div>
                </div>
            </div>
        </div>
    )
}