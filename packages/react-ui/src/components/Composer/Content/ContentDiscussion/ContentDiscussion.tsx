import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, BoxProps, TextField, Typography, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import Editor, {EditorProps} from '../../../Editor';
import {ComposerContentType} from '../../../../types/composer';
import {FormattedMessage, useIntl} from 'react-intl';
import {COMPOSER_TITLE_MAX_LENGTH} from '../../../../constants/Composer';
import {
  DEFAULT_EXTRA_SPACE_CONTENT_EDITOR,
  DEFAULT_HEIGHT_SWITCH_CONTENT_TYPE,
  DEFAULT_INITIAL_MAX_HEIGHT_CONTENT_EDITOR,
  PREFIX
} from '../../constants';
import {PREFIX as SCEDITOR_PREFIX} from '../../../Editor/constants';
import {SCThemeType} from '@selfcommunity/react-core';
import {iOS} from '@selfcommunity/utils';

const classes = {
  root: `${PREFIX}-content-discussion-root`,
  generalError: `${PREFIX}-general-error`,
  title: `${PREFIX}-content-discussion-title`,
  medias: `${PREFIX}-content-discussion-medias`,
  editor: `${PREFIX}-content-discussion-editor`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ContentDiscussionRoot'
})(({theme}) => ({}));

/**
 * Default post
 */
const DEFAULT_DISCUSSION: ComposerContentType = {
  title: '',
  categories: [],
  group: null,
  event: null,
  medias: [],
  html: '',
  addressing: []
};

export interface ContentDiscussionProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: ComposerContentType | null;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  error?: any;

  /**
   * All the inputs should be disabled?
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback for change event on poll object
   * @param value
   * @default empty object
   */
  onChange: (value: ComposerContentType) => void;

  /**
   * Value indicating the initial height
   * @default 370
   */
  defaultInitialMaxHeightContentEditor?: number;

  /**
   * Value indicating the amount of space to take into account to dynamically
   * calculate the max-height of the editor content (div.content)
   * Default is :
   * 90 (dialog topbar + bottombar) + 55 (editor toolbar) + 45 (selector content type) + 20 (title padding top/bottom)
   * @default 210
   */
  defaultExtraSpaceContentEditor?: number;

  /**
   * Props indicate if the content switch button is visible
   * @default true
   */
  isContentSwitchButtonVisible?: boolean;

  /**
   * Props to spread into the editor object
   * @default empty object
   */
  EditorProps?: EditorProps;
}

export default (props: ContentDiscussionProps): JSX.Element => {
  // PROPS
  const {
    className = null,
    value = {...DEFAULT_DISCUSSION},
    defaultInitialMaxHeightContentEditor = DEFAULT_INITIAL_MAX_HEIGHT_CONTENT_EDITOR,
    defaultExtraSpaceContentEditor = DEFAULT_EXTRA_SPACE_CONTENT_EDITOR,
    isContentSwitchButtonVisible = true,
    error = {},
    disabled = false,
    onChange,
    EditorProps = {}
  } = props;
  const {titleError = null, error: generalError = null} = {...error};

  const titleRef = useRef(null);
  const [editorMaxHeight, setEditorMaxHeight] = useState<number | string>(
    defaultInitialMaxHeightContentEditor + (isContentSwitchButtonVisible ? 0 : DEFAULT_HEIGHT_SWITCH_CONTENT_TYPE)
  );

  // HOOKS
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isIOS = useMemo(() => iOS(), []);

  // HANDLERS
  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({...value, title: event.target.value});
    },
    [value]
  );

  const handleKeyDownTitle = useCallback(
    (event: {key: string; preventDefault: () => void}) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      } else if (
        value.title.length > COMPOSER_TITLE_MAX_LENGTH &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace', 'Shift', 'Home', 'End'].indexOf(event.key) < 0
      ) {
        event.preventDefault();
      }
    },
    [value]
  );

  const handleChangeHtml = useCallback(
    (html: string) => {
      onChange({...value, html});
    },
    [value]
  );

  const computeEditorContentHeight = useCallback(() => {
    if (titleRef.current) {
      if (isMobile) {
        // Measure title input height
        const rect = titleRef.current.getBoundingClientRect();
        const _delta =
          defaultExtraSpaceContentEditor + rect.height + (isIOS ? 30 : 0) - (isContentSwitchButtonVisible ? 0 : DEFAULT_HEIGHT_SWITCH_CONTENT_TYPE);
        setEditorMaxHeight(`calc(100vh - ${_delta}px)`);
      } else {
        setEditorMaxHeight(
          DEFAULT_INITIAL_MAX_HEIGHT_CONTENT_EDITOR + (isContentSwitchButtonVisible ? 0 : DEFAULT_HEIGHT_SWITCH_CONTENT_TYPE) + 'px'
        );
      }
    }
  }, [isMobile, titleRef.current, setEditorMaxHeight, isIOS, isContentSwitchButtonVisible]);

  useEffect(() => {
    computeEditorContentHeight();
  }, [value, isContentSwitchButtonVisible, computeEditorContentHeight, isMobile]);

  // RENDER
  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && (
        <Typography className={classes.generalError}>
          <FormattedMessage id={`ui.composer.error.${generalError}`} defaultMessage={`ui.composer.error.${generalError}`} />
        </Typography>
      )}
      <TextField
        className={classes.title}
        ref={titleRef}
        placeholder={intl.formatMessage({
          id: 'ui.composer.content.discussion.title.label',
          defaultMessage: 'ui.composer.content.discussion.title.label'
        })}
        autoFocus
        fullWidth
        variant="outlined"
        value={value.title}
        onChange={handleChangeTitle}
        onKeyDown={handleKeyDownTitle}
        multiline
        InputProps={{
          endAdornment: <Typography variant="body2">{COMPOSER_TITLE_MAX_LENGTH - value.title.length}</Typography>
        }}
        error={Boolean(titleError)}
        helperText={titleError}
        disabled={disabled}
      />
      <Box sx={{[`& .${SCEDITOR_PREFIX}-content`]: {maxHeight: `${editorMaxHeight} !important`}}}>
        <Editor {...EditorProps} editable={!disabled} className={classes.editor} onChange={handleChangeHtml} defaultValue={value.html} />
      </Box>
    </Root>
  );
};
