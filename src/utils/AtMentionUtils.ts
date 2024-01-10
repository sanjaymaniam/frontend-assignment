// Finds the user object based on the selected option's ID.
export const findSelectedUser = (
  dataSource: AtMentionUserInfo[],
  userId: string,
): AtMentionUserInfo | undefined => {
  return dataSource.find((option) => option.id.toString() === userId);
};

// Wraps given text in a span tag, styled with given mentionTagStyle.
export const applyMentionStyle = (
  text: string,
  mentionTagStyle: string,
): string => {
  const mentionRegex = /@[^@]*$/;
  return text.replace(
    mentionRegex,
    (match) => `<span style="${mentionTagStyle}">${match}</span>`,
  );
};

// Moves the caret to the end of the contentEditable element.
export const moveCaretToEndOfEditor = (
  editorRef: React.RefObject<HTMLDivElement>,
) => {
  if (!editorRef.current) return;

  // Adds a non-breaking space if the last child is a SPAN element.
  if (
    editorRef.current.lastChild &&
    editorRef.current.lastChild.nodeName === "SPAN"
  ) {
    const textNode = document.createTextNode("\u00A0");
    editorRef.current.appendChild(textNode);
  }

  // Moves the caret to the end.
  // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
  const range = document.createRange();
  range.selectNodeContents(editorRef.current);
  range.collapse(false);
  const selection = window.getSelection();

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  } else if ((document as any).selection) {
    // For older IE versions
    const ieRange = (document.body as any).createTextRange();
    ieRange.moveToElementText(editorRef.current);
    ieRange.collapse(false);
    ieRange.select();
  }
};

// Checks if the current text contains a valid mention term.
export const hasValidMentionTerm = (value: string): boolean => {
  const atSymbolIndex = value.lastIndexOf("@");
  return atSymbolIndex !== -1 && !value.substring(atSymbolIndex).includes(" ");
};
