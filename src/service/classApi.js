import api from "./api";

export const ClassApi = api.injectEndpoints({
  endpoints: (build) => ({
    getClasses: build.query({
      query: (params) => ({
        url: "/class",
        params,
      }),
      providesTags: ["Class"],
    }),
    getClass: build.query({
      query: (id) => ({
        url: `/classes/${id}`,
      }),
      providesTags: ["Class"],
    }),
    createClass: build.mutation({
      query: (body) => ({
        url: "/classes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: build.mutation({
      query: ({ id, body }) => ({
        url: `/update_classes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClass: build.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useDeleteClassMutation,
  useCreateClassMutation, 
  useUpdateClassMutation,
} = ClassApi;