import type { Resume } from '@/interface/resume';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/v1' }),
  tagTypes: ['Resume'],
  endpoints: builder => ({
    getResumes: builder.query<Resume[], void>({
      query: () => '/resume',
      providesTags: (result = []) => [
        'Resume',
        ...result.map(({ id }: { id: string }) => ({
          type: 'Resume' as const,
          id,
        })),
      ],
    }),

    uploadNewResume: builder.mutation({
      query: ({ pdf, jsonData }) => {
        const formData = new FormData();

        formData.append('pdf', pdf);
        formData.append('jsonData', JSON.stringify(jsonData));

        return {
          url: '/resume',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Resume'],
    }),

    getResumeById: builder.query<Resume, string>({
      query: resumeId => `/resume/${resumeId}`,
    }),

    deleteResumeById: builder.mutation<void, string>({
      query: resumeId => ({
        url: `/resume/${resumeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const { useGetResumesQuery, useUploadNewResumeMutation, useGetResumeByIdQuery, useDeleteResumeByIdMutation } =
  apiSlice;
