import React from "react";
import ReactDOM from "react-dom";
import ChildComponent1 from "./components/ChildComponent1";
import ChildComponent2 from "./components/ChildComponent2";

const App = () => (
  <div>
    Hello, React with TypeScript! <ChildComponent1 />
    <ChildComponent2 />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
