interface AtMentionUserInfo {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
  }

  interface AtMentionControlProps {
    dataSource: AtMentionUserInfo[];
    shouldHighlight?: boolean;
    mentionChar?: string;
  }

  interface AtMentionTextEditorProps {
    value: string;
    mentionHtmlToAdd: string;
    onChange: (value: string) => void;
    onInitiateSearch: (searchString: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    placeholder?: string;
    className?: string;
}

interface MentionDropdownProps {
  options: AtMentionUserInfo[];
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isShown: boolean;
  dropdownRef: React.RefObject<HTMLSelectElement>;
}