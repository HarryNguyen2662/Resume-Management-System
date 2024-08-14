import type { ResumeWorkExperience } from 'lib/redux/types';

import { View } from '@react-pdf/renderer';

import { ResumePDFBulletList, ResumePDFSection, ResumePDFText } from './common';
import { spacing, styles } from './styles';

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, jobTitle, date, descriptions, location }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName = idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing['2'] } : {}}>
            {!hideCompanyName && (
              <View style={{ ...styles.flexRow, alignItems: 'center', gap: '5px', fontSize: 12 }}>
                <ResumePDFText bold={true}>{company},</ResumePDFText>
                <ResumePDFText>{location} —</ResumePDFText>
                <ResumePDFText>{jobTitle}</ResumePDFText>
              </View>
            )}

            <ResumePDFText style={{ fontSize: 10, marginVertical: 3 }}>{date}</ResumePDFText>

            <View style={{ ...styles.flexCol, marginTop: spacing['1.5'] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
