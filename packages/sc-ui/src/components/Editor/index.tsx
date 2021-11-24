import React, { RefObject, useEffect, useMemo } from 'react';
import {styled} from '@mui/material/styles';
import {ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {defineMessages, useIntl} from 'react-intl';
import MUIRichTextEditor, {TMUIRichTextEditorRef} from 'mui-rte';
import {Box} from '@mui/material';

const PREFIX = 'SCEditor';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  boxSizing: 'border-box',
  cursor: 'text',
  padding: theme.spacing(2),
  minHeight: 100
}));

const messages = defineMessages({
  placeholder: {
    id: 'ui.editor.placeholder',
    defaultMessage: 'ui.editor.placeholder'
  }
});

export default function Editor({
  className = '',
  defaultValue = '',
  readOnly = false,
  onChange = null,
  onRef = null,
}: {
  className?: string;
  defaultValue?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onRef?: (editor: RefObject<TMUIRichTextEditorRef>) => void;
}): JSX.Element {
  const editor: RefObject<TMUIRichTextEditorRef> = React.createRef();
  const intl = useIntl();

  /**
   * On mount if onRef in props
   * forward editor ref
   */
  useEffect(() => {
    onRef && onRef(editor);
  }, []);

  // Default editor content
  const content: string = useMemo(() => {
    const contentHTML = convertFromHTML(defaultValue);
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
    return JSON.stringify(convertToRaw(state));
  }, []);

  const handleChange = (editor) => {
    onChange && onChange(draftToHtml(convertToRaw(editor.getCurrentContent())));
  };

  const handleFocus = () => {
    editor.current.focus();
  };

  return (
    <Root className={className} onClick={handleFocus}>
      <MUIRichTextEditor
        readOnly={readOnly}
        label={intl.formatMessage(messages.placeholder)}
        onChange={handleChange}
        ref={editor}
        defaultValue={content}
        inlineToolbarControls={['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'link', 'clear']}
        toolbar={false}
        inlineToolbar={true}
      />
    </Root>
  );
}
