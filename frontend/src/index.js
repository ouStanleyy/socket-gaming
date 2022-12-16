import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import ModalProvider from "./context/Modal";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
