import './App.css'
import AtMentionControl from './component/AtMentionControl'
import userInfos from '../data.json';

function App() {
  const handleChange = (value: string) => {
    // console.log("Current Value: ", value);
    // this should return and print-
    // total text
    // mentioned user ids
  };

  return (
    <div>
      <AtMentionControl 
        dataSource={userInfos}
        shouldHighlight={true} />
    </div>
  )
}

export default App;