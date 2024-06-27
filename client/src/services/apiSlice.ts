import type { Resume } from '@/interface/resume';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:3001' }),
  tagTypes: ['Resume'],
  endpoints: builder => ({
    getResumes: builder.query<Resume[], void>({
      query: () => '/resumes',
      providesTags: (result = []) => [
        'Resume',
        ...result.map(({ id }: { id: string }) => ({
          type: 'Resume' as const,
          id,
        })),
      ],
    }),
  }),
});


export const { useGetResumesQuery } = apiSlice;
