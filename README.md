# Setting Up the Project

1. **Clone the Repository**

   Clone the project repository to your local machine:

```
git clone https://github.com/sanjaymaniam/frontend-assignment.git
cd frontend-assignment
````
   
   2. **Install Dependencies**

Run the following command in the project root directory to install the required dependencies:

```
npm install
```


3. **Start the Development Server**

To start the Vite development server, run:
```
npm run dev
```

# Component Documentation

## AtMentionControl

### Overview

`AtMentionControl` integrates a custom text editor and a dropdown for @mentions.

### Props

- `dataSource`: `AtMentionUserInfo[]`  
Array of user information objects for @mentions.

- `shouldHighlight`: `boolean` (optional)  
  Indicates whether @mentions should be highlighted.

- `mentionChar`: `string` (optional)  (not implemented yet)
  The character used to trigger @mentions. Defaults to '@'.

- `onChange`: `(inputText: string, selectedOption?: AtMentionUserInfo) => void` (optional)  
  Callback function triggered when the input changes or an option is selected.

- `value`: `string` (optional)  
  The controlled value of the text editor.

### Usage

```tsx
<AtMentionControl
  dataSource={users}
  onChange={(text, user) => console.log(text, user)}
  value={editorContent}
/>
```

## AtMentionTextEditor

A custom text editor for typing and displaying @mentions. Since input fields do not allow us to render parts of the field in a different style, this component was built. It wraps up the @ mentions in a span and renders them in a highlighted manner.

### Props

- `value`: `string`
The current text in the editor.

- `onChange`: `(value: string) => void`
Callback for text changes.

- `onKeyDown`: `(event: React.KeyboardEvent<HTMLDivElement>) => void (optional)`
Callback for key down events.

- `onInitiateSearch`: `(searchString: string) => void`
Callback to initiate @ mention search.

- `mentionHtmlToAdd`: `string`
HTML to be added when a mention is selected. When a user is selected, their user name is wrapped inside a span tag and stored here.

- `placeholder`: `string` (optional)
Placeholder text for the editor.

Usage:
```tsx
<AtMentionTextEditor
  value={editorText}
  onChange={handleEditorTextChange}
  onInitiateSearch={handleInitiateSearch}
  mentionHtmlToAdd={mentionHtml}
  placeholder="Mention something here..."
/>
```

## AtMentionDropDown

Displays a dropdown list of users based on the editor input.

### Props

- `options`: `AtMentionUserInfo[]`
 Options for the dropdown.
 
- `onSelect`: `(e: React.ChangeEvent<HTMLSelectElement>) => void`
Callback for when an option is selected.

- `isShown`: `boolean`
Whether the dropdown is visible.

- `dropdownRef`: `React.RefObject<HTMLSelectElement>`
Ref to the dropdown element.


## TO DO
Items to take up if there's more time:
- [ ] Support for searching users by email ID  
- [ ] Error handling for cases where no results are found in the @mention search.
- [ ] Write tests
- [ ] Custom sort Order and search filters: Allow consumers of the component to pass custom sort orders and search filters to support different use cases.
- [ ] Add/implement more options for customizing the control:
```
interface AtMentionControlProps {
  // 
  dataSource: AtMentionUserDetail[];
  onTextChanged: (value: string) => void;
  // on fetch error
  // allowSpaces
  // enablePersistance
  // filterType: StartsWith, EndsWith, Contains
  // shouldHighlight: should the selected item be highlighted
  // ignoreCase
  // mentionChars- default is @, but others can be set
  // minLength- set to 1
  // sortOrder
  // pass custom filter
  // max number of items to show
}
```
