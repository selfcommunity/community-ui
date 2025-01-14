import React, {useCallback, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Icon, IconButton, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import CardContent from '@mui/material/CardContent';
import {getContributionHtml} from '../../utils/contribution';
import Widget from '../Widget';
import {SCLessonModeType} from '../../types';
import ContentLesson from '../Composer/Content/ContentLesson';
import {EditorProps} from '../Editor';
import {ComposerContentType} from '../../types/composer';
import {SCCourseLessonType, SCCourseSectionType} from '@selfcommunity/types';
import {SectionRowInterface} from '../EditCourse/types';
import {getCourseData, getSections} from '../EditCourse/data';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage} from 'react-intl';
import {enqueueSnackbar} from 'notistack';
import {Logger} from '@selfcommunity/utils';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  titleSection: `${PREFIX}-title-section`,
  text: `${PREFIX}-text`,
  info: `${PREFIX}-info`,
  textSection: `${PREFIX}-text-section`,
  editor: `${PREFIX}-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonObjectProps {
  lesson: SCCourseLessonType;
  /**
   * The lesson object
   */
  lessonObj: any;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The way the lesson is rendered
   * @default SCLessonModeType.VIEW
   */
  mode: SCLessonModeType;
  /**
   * Callback fired on lesson change
   */
  onLessonNavigationChange: (lesson: SCCourseLessonType) => void;
  /**
   * Callback fired when the lesson content on edit mode changes
   */
  onContentChange?: (content) => void;
  /**
   * Editor props
   * @default {}
   */
  EditorProps?: Omit<EditorProps, 'onFocus'>;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonObject(inProps: LessonObjectProps): JSX.Element {
  // PROPS
  const props: LessonObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    lesson,
    lessonObj,
    onLessonNavigationChange,
    mode = SCLessonModeType.VIEW,
    EditorProps = {},
    onContentChange,
    isSubmitting,
    ...rest
  } = props;

  const [sections, setSections] = useState<SectionRowInterface[] | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const currentSection = sections?.[currentSectionIndex] || null;
  const currentLesson = currentSection?.lessons?.[currentLessonIndex] || null;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS
  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentLessonIndex(prevSection.lessons.length - 1);
    }
    onLessonNavigationChange(currentLesson);
  };

  const handleNext = () => {
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentLessonIndex(0);
    }
    onLessonNavigationChange(currentLesson);
  };

  const isPrevDisabled = !sections || (currentSectionIndex === 0 && currentLessonIndex === 0);
  const isNextDisabled = !sections || (currentSectionIndex === sections.length - 1 && currentLessonIndex === currentSection?.lessons?.length - 1);

  const handleChangeLesson = useCallback(
    (content: any) => {
      if (onContentChange) {
        onContentChange(content);
      }
    },
    [onContentChange]
  );

  // EFFECTS
  useEffect(() => {
    getCourseData(1)
      .then((courseData) => {
        if (courseData) {
          setSections(courseData.sections || []);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="An error occurred" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, []);

  // RENDER
  if (!lessonObj) {
    return null;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Box className={classes.info}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="ui.lessonObject.lesson.number" defaultMessage="Lesson {from} of {to}" values={{from: 1, to: 5}} />
        </Typography>
      </Box>
      <Box className={classes.titleSection}>
        <Typography variant="h5">{lesson.name}</Typography>
        <Box>
          <IconButton onClick={handlePrev} disabled={isPrevDisabled}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <IconButton onClick={handleNext} disabled={isNextDisabled}>
            <Icon>arrow_next</Icon>
          </IconButton>
        </Box>
      </Box>
      <Widget>
        <CardContent classes={{root: classes.content}}>
          {mode === SCLessonModeType.EDIT ? (
            <ContentLesson
              value={lessonObj}
              //error={{titleError, error}}
              onChange={handleChangeLesson}
              disabled={isSubmitting}
              EditorProps={{
                toolbar: true,
                uploadImage: true,
                ...EditorProps
              }}
            />
          ) : (
            <Box className={classes.textSection}>
              <Typography
                component="div"
                gutterBottom
                className={classes.text}
                dangerouslySetInnerHTML={{
                  __html: getContributionHtml(lessonObj?.html, scRoutingContext.url)
                }}
              />
            </Box>
          )}
        </CardContent>
      </Widget>
    </Root>
  );
}
