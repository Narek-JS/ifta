import PostsWrapper from "@/components/posts/PostsWrapper";
import { API_URL } from "@/utils/constants";

export default function CategoryPage(props) {
    return <PostsWrapper {...props} />;
};

export async function getStaticPaths() {
    // Static example data for categories
    const categories = {
        data: [
            { id: 1, name: "blogs", slug: "blogs" },
            { id: 2, name: "news", slug: "news" }
        ]
    };

    // Create paths for each category
    const paths = categories.data.map(category => ({
        params: { category: category.slug }
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps(context) {
    const { params } = context;
    const category = params.category || '';
    const page = params.page || 1;

    try {
        const res = await fetch(`${API_URL}/category?slug=${category}&page=${page}`);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();

        return {
            props: {
                initialPosts: data?.data?.posts || [],
                initialPageCount: data?.data?.pageCount || 0,
                category,
                initialPage: page
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // Mock data for fallback
        const mockData = {
            data: {
                posts: [],
                pageCount: 0,
            },
        };

        return {
            props: {
                initialPosts: mockData.data.posts,
                initialPageCount: mockData.data.pageCount,
                category,
                initialPage: page
            },
            revalidate: 60,
        };
    }
}
