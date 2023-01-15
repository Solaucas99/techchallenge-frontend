import { EditorView } from 'codemirror';
import { Offline_DB } from './offlineDB';

export const CodeMirrorDraft = (offline_db: Offline_DB, id: string) =>
  EditorView.updateListener.of(v => {
    if (v.docChanged) {
      offline_db.create_or_update({
        id,
        code: v.state.doc.toString(),
      });
    }
  });

export const ReadOnly = () =>
  EditorView.contentAttributes.of({ contenteditable: 'false' });

export const CodeMirrorCustomTheme = EditorView.theme(
  {
    '&': {
      color: 'white',
      backgroundColor: '#252525',
      fontSize: '16px',
      letterSpacing: '.1px',
      height: '95%',
      border: 'none',
      lineHeight: '22.5px',
      fontSmoothing: 'antialiased',
    },
    '.cm-content': {
      caretColor: '#0e9',
    },
    '.cm-scroller': {
      fontFamily: '"JetBrains Mono", monospace',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0e9',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#123',
    },
    '.cm-gutters': {
      backgroundColor: '#252525',
      color: '#3ec0d1',
      borderRight: '1px solid #343434',
    },
  },
  { dark: true }
);

export const CodeMirrorSolutionsTheme = EditorView.theme(
  {
    '&': {
      color: 'white',
      backgroundColor: 'transparent',
      fontSize: '16px',
      letterSpacing: '.1px',
      height: '95%',
      border: 'none',
      lineHeight: '22.5px',
      fontSmoothing: 'antialiased',
    },
    '.cm-content': {
      caretColor: 'transparent',
      backgroundColor: 'transparent',
    },
    '.cm-scroller': {
      fontFamily: '"JetBrains Mono", monospace',
    },
    '.cm-activeLine': {
      backgroundColor: 'transparent',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: 'transparent',
      backgroundColor: 'transparent',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      background: 'transparent',
    },
    '.cm-selectionBackground': {
      background: '#eeeeee4a',
    },
    '.cm-gutters': {
      display: 'none',
    },
  },
  { dark: true }
);
