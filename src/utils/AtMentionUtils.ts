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
