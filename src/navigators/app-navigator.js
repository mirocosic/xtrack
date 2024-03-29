import React from "react"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Host } from "react-native-portalize"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import BottomBarNavigator from "./bottom-bar-navigator"
import { TransactionForm, Dashboard, Settings, Categories, Accounts, Labels, CategoryEdit, Splash, Overview, AccountEdit, AccountDetails, LabelEdit, Backup, Onboarding } from "../screens"
import DrawerContent from "../components/drawer"
import { useDarkTheme } from "../utils/ui-utils"
import { isIos } from "../utils/os-utils"

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()
const Drawer = createDrawerNavigator()

const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Main" component={BottomBarNavigator} options={{ gestureEnabled: false, headerShown: false }} />
    <MainStack.Screen name="Splash" component={Splash} />
    <MainStack.Screen name="Onboarding" component={Onboarding} />
    <MainStack.Screen name="Dashboard" component={Dashboard} />
    <MainStack.Screen name="Overview" component={Overview} />
    <MainStack.Screen name="Categories" component={Categories} />
    <MainStack.Screen name="Accounts" component={Accounts} />
    <MainStack.Screen name="Settings" component={Settings} />
    <MainStack.Screen name="Labels" component={Labels} />
    <MainStack.Screen name="Backup" component={Backup} />
  </MainStack.Navigator>
)

const transitionPreset = isIos ? TransitionPresets.ModalPresentationIOS : TransitionPresets.ScaleFromCenterAndroid

const Main = () => (
  <Host>
    <RootStack.Navigator
      initialRouteName="App"
      screenOptions={{
        cardOverlayEnabled: true,
        presentation: "modal",
        headerShown: false,
        ...transitionPreset,
      }}>
      <RootStack.Screen name="App" component={MainStackScreen} />
      <RootStack.Screen name="TransactionForm" component={TransactionForm} />

      <MainStack.Screen name="CategoryEdit" component={CategoryEdit} />
      <MainStack.Screen name="AccountEdit" component={AccountEdit} />
      <MainStack.Screen name="LabelEdit" component={LabelEdit} />

      <MainStack.Screen name="AccountDetails" component={AccountDetails} />
    </RootStack.Navigator>
  </Host>
)

export default () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer theme={useDarkTheme() ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator
        defaultStatus="closed"
        screenOptions={{
          drawerPosition: "right",
          drawerType: "front",
          headerShown: false,
          gestureEnabled: true,
          swipeEnabled: true,
        }}
        drawerContent={({ navigation }) => <DrawerContent navigation={navigation} />}>
        <Drawer.Screen name="Main" component={Main} />
      </Drawer.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
)
