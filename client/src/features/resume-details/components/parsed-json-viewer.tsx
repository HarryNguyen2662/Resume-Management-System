import type { Resume } from 'lib/redux/types';

import { cx } from 'lib/cx';
import { deepClone } from 'lib/deep-clone';
import { initialEducation, initialWorkExperience } from 'lib/redux/resumeSlice';
import { Fragment } from 'react';

import EducationsEditForm from './JsonEditForm/EducationsEditForm';
import ProfileEditForm from './JsonEditForm/ProfileEditForm';
import ProjectsEditForm from './JsonEditForm/ProjectsEditForm';
import SkillsEditForm from './JsonEditForm/SkillsEditForm';
import WorkExperiencesEditForm from './JsonEditForm/WorkExperiencesEditForm';

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50 text-lg font-semibold mb-2">
    <th className="px-3 py-2 text-lg font-semibold mb-2" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[] | undefined | null;
  className?: string | false;
}) => (
  <tr className={cx('divide-x', className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === 'string' ? (
        value
      ) : value ? (
        value.map((x, idx) => (
          <Fragment key={idx}>
            • {x}
            <br />
          </Fragment>
        ))
      ) : (
        <span>Not available</span> // Or any other placeholder you prefer
      )}
    </td>
  </tr>
);

export const ParsedJsonViewer = ({ resume }: { resume: Resume }) => {
  const educations = resume.educations.length === 0 ? [deepClone(initialEducation)] : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0 ? [deepClone(initialWorkExperience)] : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills =
    resume.skills.featuredSkills
      ?.filter(item => item.skill.trim())
      .map(item => item.skill)
      .join(', ')
      .trim() || '';

  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }

  return (
    <table className="text-sm text-gray-900 border-solid border-2 border-slate-400">
      <tbody className="divide-y text-left align-top">
        <div className="bg-white-100 shadow-lg rounded-lg p-4 mb-6">
          <TableRowHeader>
            <div className="flex justify-between items-center">
              <p>Profile</p>
              <ProfileEditForm profile={resume.profile} />
            </div>
          </TableRowHeader>
          <TableRow label="Name" value={resume.profile.name} />
          <TableRow label="Email" value={resume.profile.email} />
          <TableRow label="Phone" value={resume.profile.phone} />
          <TableRow label="Location" value={resume.profile.location} />
          <TableRow label="Link" value={resume.profile.url} />
          <TableRow label="Summary" value={resume.profile.summary} />
          <TableRow label="Summary" value={resume.profile.role} />
          <TableRow label="Summary" value={resume.profile.languages} />
        </div>
        <div className="bg-white-100 shadow-lg rounded-lg p-4 mb-6">
          <TableRowHeader>
            <div className="flex justify-between items-center">
              <p>Education</p>
              <EducationsEditForm educations={resume.educations} />
            </div>
          </TableRowHeader>
          {educations.map((education, idx) => (
            <Fragment key={idx}>
              <TableRow label="School" value={education.school} />
              <TableRow label="Degree" value={education.degree} />
              <TableRow label="GPA" value={education.gpa} />
              <TableRow label="Date" value={education.date} />
              <TableRow
                label="Descriptions"
                value={education.descriptions}
                className={educations.length - 1 !== 0 && idx !== educations.length - 1 && '!border-b-4'}
              />
            </Fragment>
          ))}
        </div>
        <div className="bg-white-100 shadow-lg rounded-lg p-4 mb-6">
          <TableRowHeader>
            <div className="flex justify-between items-center">
              <p>Work Experience</p>
              <WorkExperiencesEditForm workExperiences={resume.workExperiences} />
            </div>
          </TableRowHeader>
          {workExperiences.map((workExperience, idx) => (
            <Fragment key={idx}>
              <TableRow label="Company" value={workExperience.company} />
              <TableRow label="Job Title" value={workExperience.jobTitle} />
              <TableRow label="Date" value={workExperience.date} />
              <TableRow
                label="Descriptions"
                value={workExperience.descriptions}
                className={workExperiences.length - 1 !== 0 && idx !== workExperiences.length - 1 && '!border-b-4'}
              />
              <TableRow label="Location" value={workExperience.location} />
            </Fragment>
          ))}
        </div>
        <div className="bg-white-100 shadow-lg rounded-lg p-4 mb-6">
          {resume.projects.length > 0 && (
            <TableRowHeader>
              <div className="flex justify-between items-center">
                <p>Projects</p>
                <ProjectsEditForm projects={resume.projects} />
              </div>
            </TableRowHeader>
          )}
          {resume.projects.map((project, idx) => (
            <Fragment key={idx}>
              <TableRow label="Project" value={project.project} />
              <TableRow label="Date" value={project.date} />
              <TableRow
                label="Descriptions"
                value={project.descriptions}
                className={resume.projects.length - 1 !== 0 && idx !== resume.projects.length - 1 && '!border-b-4'}
              />
            </Fragment>
          ))}
        </div>
        <div className="bg-white-100 shadow-lg rounded-lg p-4 mb-6">
          <TableRowHeader>
            <div className="flex justify-between items-center">
              <p>Skills</p>
              <SkillsEditForm skills={resume.skills} />
            </div>
          </TableRowHeader>
          <TableRow label="Descriptions" value={skills} />
        </div>
      </tbody>
    </table>
  );
};
