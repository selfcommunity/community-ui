import {useEffect} from 'react';
import {$insertDataTransferForRichText} from '@lexical/clipboard';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createParagraphNode, $createRangeSelection, $getRoot, ParagraphNode} from 'lexical';

function DefaultHtmlValuePlugin({defaultValue}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      // Fake DataTransfer object which $insertDataTransferForRichText expects from clipboard
      // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
      const fakeDataTransfer = new DataTransfer();
      fakeDataTransfer.getData = (format) => {
        if (format === 'text/html') {
          console.log(defaultValue);
          return defaultValue;
        }
        return '';
      };

      const root = $getRoot();
      const rootChildren = root.getChildren();
      let paragraphNode = null;
      if (rootChildren.length === 1) {
        paragraphNode = rootChildren[0];
      } else {
        paragraphNode = $createParagraphNode();
        root.append(paragraphNode);
      }

      // we need selection to point out where to insert our html;
      const selection = $createRangeSelection();
      selection.anchor.set(paragraphNode.getKey(), 0, 'element');
      selection.focus.set(paragraphNode.getKey(), 0, 'element');

      $insertDataTransferForRichText(fakeDataTransfer, selection, editor);
    });
  }, []);

  return null;
}

export default DefaultHtmlValuePlugin;
