import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import uploadReducer from "./uploadReducer";
import appReducer from "./appReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    files: fileReducer,
    upload: uploadReducer,
    app: appReducer,
  },
  // composeWithDevTools(applyMiddleware(thunk))
});
