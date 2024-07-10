import type { Resume, ResumeEducation, ResumeProfile } from '@/interface/resume';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PaginationResumesList {
  resume: Resume[];
}

interface EditResumeResults {
  resume: Resume;
}

interface EditProfile {
  profile: ResumeProfile;
  id: string;
}

interface EditEucation {
  educations: ResumeEducation[];
  id: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/v1' }),
  tagTypes: ['Resume'],
  endpoints: builder => ({
    getResumesbyPages: builder.query<PaginationResumesList, { limit: number; page: number }>({
      query: ({ limit, page }) => {
        const searchParams = new URLSearchParams();

        searchParams.set('limit', limit.toString());
        searchParams.set('page', page.toString());

        return {
          url: `/resume/resumepage?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: result => [
        'Resume',
        ...result!.resume.map(({ id }: { id: string }) => ({
          type: 'Resume' as const,
          id,
        })),
      ],
    }),

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
      providesTags: (_result, _error, arg) => [{ type: 'Resume', id: arg }]
    }),

    deleteResumeById: builder.mutation<void, string>({
      query: resumeId => ({
        url: `/resume/${resumeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),

    updateProfileById: builder.mutation<EditResumeResults, EditProfile>({
      query: ({ profile, id }) => ({
        url: `/resume/${id}`,
        method: 'PATCH',
        body: { profile },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Resume', id: arg.id }]
    }),

    updateEducationById: builder.mutation<EditResumeResults, EditEucation>({
      query: ({ educations, id }) => ({
        url: `/resume/${id}`,
        method: 'PATCH',
        body: { educations },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Resume', id: arg.id }]
    }),
  }),
});

export const {
  useGetResumesQuery,
  useUploadNewResumeMutation,
  useGetResumeByIdQuery,
  useDeleteResumeByIdMutation,
  useGetResumesbyPagesQuery,
  useUpdateProfileByIdMutation,
  useUpdateEducationByIdMutation,
} = apiSlice;
