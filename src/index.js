import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActiveFilterProvider } from "./providers/activeFilterProvider";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  fontFamily: "Roboto, sans-serif",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ActiveFilterProvider>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
        <Toaster />
      </ActiveFilterProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
