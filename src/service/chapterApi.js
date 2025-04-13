import api from "./api";

export const ChaptersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getChapter: build.query({
            query: (id) => ({
                url: `/chapters/class/${id}?class_id=${id}`,
            }),
            providesTags: ["Chapters"],
        }),

        createChapter: build.mutation({
            query: (body) => ({
                url: "/Chapters",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Chapters"],
        }),
        updateChapter: build.mutation({
            query: ({ id, body }) => ({
                url: `/update_chapter/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Chapters"],
        }),
        deleteChapter: build.mutation({
            query: (id) => ({
                url: `/chapter/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Chapters"],
        }),
    }),
});

export const {
    useGetChapterQuery,
    useDeleteChapterMutation,
    useCreateChapterMutation,
    useUpdateChapterMutation,
} = ChaptersApi;