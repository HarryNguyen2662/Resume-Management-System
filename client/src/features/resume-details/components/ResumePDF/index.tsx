import type { Settings, ShowForm } from 'lib/redux/settingsSlice';
import type { Resume } from 'lib/redux/types';

import { Document, Image,Page, View } from '@react-pdf/renderer';
import { DEFAULT_FONT_COLOR } from 'lib/redux/settingsSlice';

import logo from '../../../../assets/CV_Logo.png';
import { SuppressResumePDFErrorMessage } from './common/SuppressResumePDFErrorMessage';
import { ResumePDFCustom } from './ResumePDFCustom';
import { ResumePDFEducation } from './ResumePDFEducation';
import { ResumePDFProfile } from './ResumePDFProfile';
import { ResumePDFProject } from './ResumePDFProject';
import { ResumePDFSkills } from './ResumePDFSkills';
import { ResumePDFWorkExperience } from './ResumePDFWorkExperience';
import { spacing, styles } from './styles';

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } = resume;
  const { name } = profile;
  const { fontFamily, fontSize, documentSize, formToHeading, formToShow, formsOrder, showBulletPoints } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const showFormsOrder = formsOrder.filter(form => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading['skills']}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints['skills']}
      />
    ),
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading['workExperiences']}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    projects: () => (
      <ResumePDFProject heading={formToHeading['projects']} projects={projects} themeColor={themeColor} />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading['educations']}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints['educations']}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading['custom']}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints['custom']}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={'OpenResume'}>
        <Page
          size={documentSize === 'A4' ? 'A4' : 'LETTER'}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + 'pt',
          }}
        >
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[0]} ${spacing[20]}`,
            }}
          >
            <Image src={logo} style={{ width: 130, marginHorizontal: 'auto', marginTop: 5 }} />
            <ResumePDFProfile profile={profile} themeColor={themeColor} isPDF={isPDF} />
            {showFormsOrder.map(form => {
              const Component = formTypeToComponent[form];

              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
