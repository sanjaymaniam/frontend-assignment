/**
 * Defines the structure for user information in @mentions.
 * @param id - Unique identifier for the user.
 * @param first_name - User's first name.
 * @param last_name - User's last name.
 * @param email - User's email address.
 * @param gender - User's gender.
 */
interface AtMentionUserInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

/**
 * Props for AtMentionControl component.
 * @param dataSource - Array of user information for @mentions.
 * @param shouldHighlight - Optional flag to indicate if @mentions should be highlighted.
 * @param mentionChar - Optional character to trigger @mentions. Defaults to '@'.
 * @param onChange - Callback function that is triggered when the input changes or an option is selected.
 *                   It passes the current input text and the selected option.
 * @param value - The controlled value of the text editor.
 */
interface AtMentionControlProps {
  dataSource: AtMentionUserInfo[];
  shouldHighlight?: boolean;
  mentionChar?: string;
  onChange?: (inputText: string, selectedOption?: AtMentionUserInfo) => void;
  value?: string;
}


/**
 * Props for AtMentionTextEditor component.
 * @param value - The current value of the editor.
 * @param mentionHtmlToAdd - HTML string to be added when a mention is selected.
 * @param onChange - Callback for text change events.
 * @param onInitiateSearch - Callback to initiate search for mentions.
 * @param onKeyDown - Optional callback for key down events.
 * @param placeholder - Optional placeholder text for the editor.
 * @param className - Optional CSS class name for styling.
 */
interface AtMentionTextEditorProps {
  value: string;
  mentionHtmlToAdd: string;
  onChange: (value: string) => void;
  onInitiateSearch: (searchString: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Props for MentionDropdown component.
 * @param options - Array of options (users) to be shown in the dropdown.
 * @param onSelect - Callback function for selection events.
 * @param isShown - Flag to control the visibility of the dropdown.
 * @param dropdownRef - Reference to the dropdown element for focus management.
 */
interface AtMentionDropdownProps {
  options: AtMentionUserInfo[];
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isShown: boolean;
  dropdownRef: React.RefObject<HTMLSelectElement>;
}
