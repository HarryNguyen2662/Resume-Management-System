import type { ResumeProfile } from 'lib/redux/types';

import { View } from '@react-pdf/renderer';

import { ResumePDFSection, ResumePDFText } from './common';
import { spacing, styles } from './styles';

export const ResumePDFProfile = ({
  profile,
  themeColor,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, location, role, languages } = profile;
  const iconProps = { location, languages };

  return (
    <ResumePDFSection style={{ marginTop: spacing['4'] }}>
      <ResumePDFText bold={true} themeColor={themeColor} style={{ fontSize: '20pt' }}>
        {name}
      </ResumePDFText>
      {role && <ResumePDFText>{role}</ResumePDFText>}
      <View
        style={{
          ...styles.flexRow,
          flexWrap: 'wrap',
          marginTop: spacing['0.5'],
          gap: spacing['5']
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;
          
          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: 'center',
                gap: spacing['1'],
              }}
            >
              <ResumePDFText bold={true}>{key.charAt(0).toUpperCase() + key.slice(1)}: </ResumePDFText>
              <ResumePDFText>{value}</ResumePDFText>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
