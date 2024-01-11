import "./App.css";
import AtMentionControl from "./component/AtMentionControl";
import userInfos from "../data.json";

function App() {
  const handleChange = (
    inputHtml: string,
  ) => {
    console.log(`Text in editor: ${inputHtml}`);
  };

  return (
    <div>
      <AtMentionControl
        dataSource={userInfos}
        onChange={handleChange}
        placeholder="Want to mention someone?"
        mentionTagStyle="color: #117AA7;"
      />
    </div>
  );
}

export default App;
