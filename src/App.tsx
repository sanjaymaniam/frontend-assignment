import './App.css'
import AtMentionControl from './component/AtMentionControl'
import userInfos from '../data.json';

function App() {
  const handleChange = (inputText: string, selectedUser?: AtMentionUserInfo) => {
    console.log(`Input Text: ${inputText}, Selected User: ${selectedUser}`);
  };

  return (
    <div>
      <AtMentionControl 
        dataSource={userInfos}
        shouldHighlight={true}
        onChange={handleChange} />
    </div>
  )
}

export default App;