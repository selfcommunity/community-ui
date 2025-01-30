import {Accordion, AccordionDetails, AccordionSummary, Box, Icon, styled, Typography, useMediaQuery, useTheme, useThemeProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {HTMLAttributes, SyntheticEvent, useCallback, useState} from 'react';
import {SCCourseLessonCompletionStatusType, SCCourseLessonType, SCCourseSectionType} from '@selfcommunity/types';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCAccordionLessons';

const classes = {
  root: `${PREFIX}-root`,
  accordion: `${PREFIX}-accordion`,
  summary: `${PREFIX}-summary`,
  details: `${PREFIX}-details`,
  circle: `${PREFIX}-circle`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface AccordionLessonsProps {
  sections: SCCourseSectionType[] | null;
  lessons: SCCourseLessonType[] | null;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function AccordionLessons(inProps: AccordionLessonsProps) {
  // PROPS
  const props: AccordionLessonsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {sections, lessons, className} = props;

  //STATES
  const [expanded, setExpanded] = useState<number | false>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // HANDLERS
  const handleChange = useCallback(
    (panel: number) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    },
    [setExpanded]
  );

  if (!sections || sections.length === 0 || !lessons || lessons.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)}>
      {sections.map((section: SCCourseSectionType) => (
        <Accordion
          key={section.id}
          className={classes.accordion}
          expanded={expanded === section.id}
          onChange={handleChange(section.id)}
          disableGutters
          elevation={0}
          square>
          <AccordionSummary className={classes.summary} expandIcon={<Icon>expand_less</Icon>}>
            <Typography component="span" variant="body1">
              {section.name}
            </Typography>
            {!isMobile && (
              <Typography component="span" variant="body1">
                <FormattedMessage
                  id="ui.course.table.lessons.title"
                  defaultMessage="ui.course.table.lessons.title"
                  values={{
                    lessonsNumber: lessons.filter((lesson) => lesson.section_id === section.id).length
                  }}
                />
              </Typography>
            )}
          </AccordionSummary>
          {lessons.map((lesson) => {
            if (lesson.section_id === section.id) {
              return (
                <AccordionDetails key={lesson.id} className={classes.details}>
                  {lesson.completion_status === SCCourseLessonCompletionStatusType.COMPLETED ? (
                    <Icon fontSize="small" color="primary">
                      circle_checked
                    </Icon>
                  ) : (
                    <Box className={classes.circle} />
                  )}
                  <Typography>{lesson.name}</Typography>
                </AccordionDetails>
              );
            }
          })}
        </Accordion>
      ))}
    </Root>
  );
}
