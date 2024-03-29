import React from "react"
import { StatusBar, Appearance } from "react-native"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/lib/integration/react"
import { get } from "lodash"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ActionSheetProvider } from "@expo/react-native-action-sheet"

import palette from "./utils/palette"
import { isAndroid } from "./utils/os-utils"
import { persistor, store } from "./store"
import AppNavigator from "./navigators/app-navigator"
import "intl"
import "intl/locale-data/jsonp/en"

// get the appTheme from store, and if set to "system", update the status bar to provided systemTheme prop
const updateStatusBarStyle = systemTheme => {
  const state = store.getState()
  const appTheme = get(state, "common.theme")

  if (appTheme === "system") {
    if (systemTheme === "dark") {
      StatusBar.setBarStyle("light-content", true)
      isAndroid && StatusBar.setBackgroundColor(palette.darkGreyHex, true)
      changeNavigationBarColor(palette.darkGreyHex)
    } else {
      StatusBar.setBarStyle("dark-content", true)
      isAndroid && StatusBar.setBackgroundColor(palette.light, true)
      changeNavigationBarColor(palette.light)
    }
  }
}

// set initial status bar color
const systemTheme = Appearance.getColorScheme()
updateStatusBarStyle(systemTheme)

// register event listener for system changes.
Appearance.addChangeListener(event => {
  updateStatusBarStyle(event.colorScheme)
})

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </ActionSheetProvider>
    </PersistGate>
  </Provider>
)
