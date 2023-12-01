import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from "@/utils/constants";

export const faqsSlice = createApi({
    reducerPath: 'faqsSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL
    }),
    endpoints: (builder) => ({
        getFaqs: builder.query({
            query: () => 'faqs',
        }),
    }),
})

export const { useGetFaqsQuery } = faqsSlice;