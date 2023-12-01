import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from "@/utils/constants";

export const postsSlice = createApi({
    reducerPath: 'postsSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL
    }),
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({category, page}) => `category?slug=${category}&page=${page}`,
        }),
        getSinglePost: builder.query({
            query: (slug) => `posts/${slug}`,
        }),
        getLatestPosts: builder.query({
            query: (category) => `getLast2Data?category=${category}&limit=2`,
        })
    }),
})

export const { useGetPostsQuery, useGetSinglePostQuery, useGetLatestPostsQuery } = postsSlice;