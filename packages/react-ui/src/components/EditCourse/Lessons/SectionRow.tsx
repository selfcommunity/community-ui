import {DragDropContext, Draggable, DraggableProvided, Droppable, DropResult} from '@hello-pangea/dnd';
import {Fragment, memo, useCallback, useEffect, useState} from 'react';
import {Collapse, Icon, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import classNames from 'classnames';
import {PREFIX} from '../constants';
import LessonRow from './LessonRow';
import AddButton from './AddButton';
import MenuRow from '../MenuRow';
import {FormattedMessage} from 'react-intl';
import FieldName from './FieldName';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {useSnackbar} from 'notistack';
import LessonReleaseMenu from '../../LessonReleaseMenu';
import {SCCourseLessonType, SCCourseLessonTypologyType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CourseService, Endpoints} from '@selfcommunity/api-services';

const classes = {
  tableBodyIconWrapper: `${PREFIX}-table-body-icon-wrapper`,
  tableBodyAccordion: `${PREFIX}-table-body-accordion`,
  actionsWrapper: `${PREFIX}-actions-wrapper`,
  tableBodyCollapseWrapper: `${PREFIX}-table-body-collapse-wrapper`,
  cellWidth: `${PREFIX}-cell-width`,
  cellAlignRight: `${PREFIX}-cell-align-right`,
  cellAlignCenter: `${PREFIX}-cell-align-center`,
  cellPadding: `${PREFIX}-cell-padding`
};

function getLesson(id: number, type: SCCourseLessonTypologyType = SCCourseLessonTypologyType.LESSON) {
  return {
    id,
    type,
    name: `Lezione senza titolo - ${id}`
  };
}

interface SectionRowProps {
  course: SCCourseType | null;
  provider: DraggableProvided;
  section: SCCourseSectionType;
  isNewRow: boolean;
  handleManageSection: (section: SCCourseSectionType, type: 'add' | 'rename' | 'update' | 'delete') => void;
}

function SectionRow(props: SectionRowProps) {
  // PROPS
  const {course, provider, section, isNewRow, handleManageSection} = props;

  // STATES
  const [open, setOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [lessons, setLessons] = useState<SCCourseLessonType[]>([]);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // EFFECTS
  useEffect(() => {
    if (section.lessons) {
      setLessons(section.lessons);
    }
  }, [section]);

  // HANDLERS
  const handleExpandAccordion = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  const handleDragEnd = useCallback(
    (e: DropResult<string>) => {
      if (!e.destination) {
        return;
      }

      const tempLessons = Array.from(section.lessons);
      const [sourceData] = tempLessons.splice(e.source.index, 1);
      tempLessons.splice(e.destination.index, 0, sourceData);

      /* const tempRow: any = {
        ...section,
        lessons: tempLessons
      };

      handleUpdateSection(tempRow); */
    },
    [section]
  );

  const handleAddTempLesson = useCallback(() => {
    setLessons((prevLessons) => (prevLessons?.length > 0 ? [...prevLessons, getLesson(prevLessons.length + 1)] : [getLesson(1)]));
  }, [setLessons]);

  const handleAbleEditMode = useCallback(() => setTimeout(() => setEditMode(true)), [setEditMode]);
  const handleDisableEditMode = useCallback(() => setEditMode(false), [setEditMode]);

  const handleDeleteSection = useCallback(() => {
    CourseService.deleteCourseSection(course.id, section.id)
      .then(() => {
        handleManageSection(section, 'delete');

        enqueueSnackbar(
          <FormattedMessage id="ui.editCourse.tab.lessons.table.snackbar.delete" defaultMessage="ui.editCourse.tab.lessons.table.snackbar.delete" />,
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);

        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }, [course, section, handleManageSection]);

  const handleManageLesson = useCallback(
    (lesson: SCCourseLessonType, type: 'add' | 'rename' | 'delete') => {
      switch (type) {
        case 'add': {
          const tempSection: SCCourseSectionType = {
            ...section,
            lessons: section.lessons ? [...section.lessons, lesson] : [lesson]
          };

          handleManageSection(tempSection, 'update');
          break;
        }
        case 'rename': {
          const tempSection: SCCourseSectionType = {
            ...section,
            lessons: section.lessons.map((prevLesson) => {
              if (prevLesson.id === lesson.id) {
                return {
                  ...prevLesson,
                  name: lesson.name
                };
              }

              return prevLesson;
            })
          };

          handleManageSection(tempSection, 'update');
          break;
        }
        case 'delete': {
          const tempSection: SCCourseSectionType = {
            ...section,
            lessons: section.lessons.filter((prevLesson) => prevLesson.id !== lesson.id)
          };

          handleManageSection(tempSection, 'update');
        }
      }
    },
    [section, handleManageSection]
  );

  return (
    <Fragment>
      <TableRow {...provider.draggableProps} ref={provider.innerRef} className={classes.tableBodyAccordion}>
        <TableCell component="th" scope="row" {...provider.dragHandleProps} className={classNames(classes.cellWidth, classes.cellPadding)}>
          <Stack className={classes.tableBodyIconWrapper}>
            <IconButton aria-label="expand row" size="small" onClick={handleExpandAccordion}>
              {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </IconButton>

            <Icon color="disabled">drag</Icon>
          </Stack>
        </TableCell>
        <TableCell>
          <FieldName
            endpoint={{
              url: () =>
                isNewRow
                  ? Endpoints.CreateCourseSection.url({id: course.id})
                  : Endpoints.PatchCourseSection.url({id: course.id, section_id: section.id}),
              method: isNewRow ? Endpoints.CreateCourseSection.method : Endpoints.PatchCourseSection.method
            }}
            row={section}
            isNewRow={isNewRow}
            handleManageRow={handleManageSection}
            editMode={editMode}
            handleDisableEditMode={handleDisableEditMode}
          />
        </TableCell>
        <TableCell className={classes.cellAlignCenter}>
          <LessonReleaseMenu course={course} section={section} />
        </TableCell>
        <TableCell className={classes.cellAlignRight}>
          <Stack className={classes.actionsWrapper}>
            <AddButton label="ui.editCourse.tab.lessons.table.lesson" handleAddRow={handleAddTempLesson} color="primary" variant="outlined" />

            <MenuRow>
              <MenuItem onClick={handleAbleEditMode}>
                <Typography variant="body1">
                  <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.rename" defaultMessage="ui.editCourse.tab.lessons.table.menu.rename" />
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleDeleteSection}>
                <Typography variant="body1">
                  <FormattedMessage id="ui.editCourse.tab.lessons.table.menu.delete" defaultMessage="ui.editCourse.tab.lessons.table.menu.delete" />
                </Typography>
              </MenuItem>
            </MenuRow>
          </Stack>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell className={classes.tableBodyCollapseWrapper} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table>
                <Droppable droppableId="droppable-2">
                  {(outerProvider) => (
                    <TableBody ref={outerProvider.innerRef} {...outerProvider.droppableProps}>
                      {lessons.map((lesson, i, array) => (
                        <Draggable key={i} draggableId={i.toString()} index={i}>
                          {(innerProvider) => (
                            <LessonRow
                              key={i}
                              provider={innerProvider}
                              course={course}
                              section={section}
                              lesson={lesson}
                              isNewRow={array.length > (section.lessons?.length || 0)}
                              handleManageLesson={handleManageLesson}
                            />
                          )}
                        </Draggable>
                      ))}
                      {outerProvider.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default memo(SectionRow);
