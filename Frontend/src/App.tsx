import { useState } from "react";
import Alert from "./Components/Alert";
import Button from "./Components/Button";
import DismissableAlert from "./Components/DismissableAlert";
import ListGroup from "./Components/ListGroup/ListGroup";

function App() {
  let items = ["Science", "Art", "Religion", "History", "Geography"];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const [alertVisible, setAlertVisiblity] = useState(false)

  return (
    <div>
      <ListGroup items={items} heading="Categories" onSelectItem={handleSelectItem} />
      {alertVisible && <DismissableAlert onClose={() => setAlertVisiblity(false)}>Alert</DismissableAlert>}
      <Button onClick={() => setAlertVisiblity(true)}> Select </Button>
    </div>
  );
}

export default App;
