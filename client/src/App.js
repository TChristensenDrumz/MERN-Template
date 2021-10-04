import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Page from "./pages/Page";
import "./style/main.css";
import "./style/variables.css";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Page}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
