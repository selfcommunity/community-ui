/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ElementFormatType, LexicalEditor, NodeKey, TextFormatType} from 'lexical';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, REMOVE_LIST_COMMAND} from '@lexical/list';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {$createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType} from '@lexical/rich-text';
import {$setBlocksType} from '@lexical/selection';
import {$isTableNode, $isTableSelection} from '@lexical/table';
import {$findMatchingParent, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType, mergeRegister} from '@lexical/utils';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {getSelectedNode} from '../../../utils/editor';
import {Box, Icon, IconButton, Menu, MenuItem, ToggleButton, ToggleButtonGroup, Tooltip} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import ImagePlugin from './ImagePlugin';
import EmojiPlugin from './EmojiPlugin';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import {PREFIX} from '../constants';

const blockTypeToBlockIcon = {
  h1: 'format_heading_1',
  h2: 'format_heading_2',
  h3: 'format_heading_3',
  bullet: 'format_list_bulleted',
  number: 'format_list_numbered',
  quote: 'format_quote',
  paragraph: 'format_paragraph'
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
};

const FORMATS: TextFormatType[] = ['bold', 'underline', 'italic', 'strikethrough', 'subscript', 'superscript'];
const ALIGNMENTS: ElementFormatType[] = ['left', 'right', 'center', 'justify'];

function BlockFormatIconButton({
  className = '',
  editor,
  blockType,
  disabled = false
}: {
  className?: string;
  blockType: keyof typeof blockTypeToBlockIcon;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  // STATE
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // FORMAT METHODS
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  // HANDLERS
  const handleSelect = (block) => (event) => {
    switch (block) {
      case 'bullet':
        formatBulletList();
        break;
      case 'number':
        formatNumberedList();
        break;
      case 'paragraph':
        formatParagraph();
        break;
      case 'quote':
        formatQuote();
        break;
      default:
        formatHeading(block);
        break;
    }
    setAnchorEl(null);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton className={className} disabled={disabled} onClick={handleOpen}>
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.blockType" defaultMessage="ui.editor.toolbarPlugin.blockType" />}>
          <>
            <Icon>{blockTypeToBlockIcon[blockType]}</Icon>
            <Icon>{anchorEl ? 'expand_less' : 'expand_more'}</Icon>
          </>
        </Tooltip>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {Object.keys(blockTypeToBlockIcon).map((block) => (
          <MenuItem key={block} onClick={handleSelect(block)}>
            <Icon>{blockTypeToBlockIcon[block]}</Icon>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const classes = {
  root: `${PREFIX}-toolbar-plugin-root`,
  blockFormat: `${PREFIX}-block-format`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ToolbarPluginRoot'
})(() => ({}));

export interface ToolbarPluginProps {
  uploadImage: boolean;
}

export default function ToolbarPlugin(inProps: ToolbarPluginProps): JSX.Element {
  // PROPS
  const props: ToolbarPluginProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {uploadImage = false} = props;

  // STATE
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockIcon>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [isLink, setIsLink] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [formats, setFormats] = useState<TextFormatType[]>([]);
  const [alignment, setAlignment] = useState<ElementFormatType>(ALIGNMENTS[0]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setFormats(FORMATS.filter((f: TextFormatType) => selection.hasFormat(f)));
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      setAlignment(ALIGNMENTS.find((a: ElementFormatType) => element.getFormatType?.() === a) || ALIGNMENTS[0]
      );

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type as keyof typeof blockTypeToBlockIcon);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockIcon) {
            setBlockType(type as keyof typeof blockTypeToBlockIcon);
          }
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, activeEditor, editor]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              node = node.splitText(focus.offset)[0] || node;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (node.__style !== '') {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              node.setStyle('');
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (node.__format !== 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              node.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(node).setFormat('');
            }
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <Root className={classes.root}>
      {blockType in blockTypeToBlockIcon && activeEditor === editor && (
        <BlockFormatIconButton className={classes.blockFormat} disabled={!isEditable} blockType={blockType} editor={editor} />
      )}
      <IconButton
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(
            FORMAT_ELEMENT_COMMAND,
            ALIGNMENTS[(ALIGNMENTS.findIndex((a: ElementFormatType) => alignment === a) + 1) % ALIGNMENTS.length]
          );
        }}>
        <Tooltip title={<FormattedMessage id={`ui.editor.toolbarPlugin.${alignment}`} defaultMessage={`ui.editor.toolbarPlugin.${alignment}`} />}>
          <Icon>{`format_align_${alignment}`}</Icon>
        </Tooltip>
      </IconButton>
      <ToggleButtonGroup value={formats}>
        {FORMATS.map((format) => (
          <ToggleButton
            key={format}
            value={format}
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
            }}>
            <Tooltip title={<FormattedMessage id={`ui.editor.toolbarPlugin.${format}`} defaultMessage={`ui.editor.toolbarPlugin.${format}`} />}>
              <Icon>{`format_${format}`}</Icon>
            </Tooltip>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <IconButton disabled={!isEditable} onClick={clearFormatting}>
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.clear" defaultMessage="ui.editor.toolbarPlugin.clear" />}>
          <Icon>format_clear</Icon>
        </Tooltip>
      </IconButton>
      <IconButton
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        }}>
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.horizontalRule" defaultMessage="ui.editor.toolbarPlugin.horizontalRule" />}>
          <Icon>format_horizontal_rule</Icon>
        </Tooltip>
      </IconButton>
      {uploadImage && <ImagePlugin />}
      <IconButton disabled={!isEditable} onClick={insertLink}>
        <Tooltip title={<FormattedMessage id="ui.editor.toolbarPlugin.link" defaultMessage="ui.editor.toolbarPlugin.link" />}>
          <Icon>format_link</Icon>
        </Tooltip>
      </IconButton>
      <EmojiPlugin />
    </Root>
  );
}
