// import { delay } from "redux-saga"
import { all } from "redux-saga/effects"

function* initApp() {
  console.log("app started...")
}

function* setLanguage() {}

export default function* commonSaga() {
  yield all([initApp()])
}
