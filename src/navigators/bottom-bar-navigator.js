import React from "react"
import { connect } from "react-redux"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TouchableOpacity } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"

import { Overview, Settings, Transactions, DashboardFL } from "../screens"
import Icon from "../components/icon"
import palette from "../utils/palette"
import { safePaddingBottom, useDarkTheme } from "../utils/ui-utils"
import __ from "../utils/translations"

const AddRedirector = ({ navigation }) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", e => {
      ReactNativeHapticFeedback.trigger("impactLight")
      e.preventDefault()
      navigation.navigate("TransactionForm", { clearForm: true })
    })

    return unsubscribe
  }, [navigation])

  return null
}

const Tab = createBottomTabNavigator()

const Component = () => (
  <Tab.Navigator
    screenOptions={{
      lazy: false,
      headerShown: false,
      tabBarActiveTintColor: "#2059f4",
      tabBarInactiveTintColor: useDarkTheme() ? palette.white : palette.black,
      tabBarLabelStyle: { fontSize: 12 },
      tabBarStyle: {
        justifyContent: "space-around",
        backgroundColor: useDarkTheme() ? palette.darkGray : "#ffffff",
        height: safePaddingBottom(70),
        paddingBottom: safePaddingBottom(10),
      },
    }}>
    {/* <Tab.Screen
      name={__("Dashboard")}
      component={Dashboard}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon style={{ backgroundColor: useDarkTheme() ? palette.darkGray : "white" }} textStyle={{ fontSize: 26, color }} type="tasks" />
        ),
      }}
    /> */}
    <Tab.Screen
      name={__("Dashboard")}
      component={DashboardFL}
      options={{
        tabBarIcon: ({ color }) => <Icon style={{ backgroundColor: useDarkTheme() ? palette.darkGray : "white" }} textStyle={{ fontSize: 26, color }} type="tasks" />,
      }}
    />
    <Tab.Screen
      name={__("Overview")}
      component={Overview}
      options={{
        tabBarIcon: ({ color }) => <Icon style={{ backgroundColor: useDarkTheme() ? palette.darkGray : "white" }} textStyle={{ fontSize: 26, color }} type="tachometer-alt" />,
      }}
    />
    <Tab.Screen
      name={__("Add")}
      component={AddRedirector}
      options={{
        tabBarIcon: () => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginBottom: 40,
              width: 60,
              height: 60,
              alignItems: "center",
              borderRadius: 40,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <LinearGradient
              colors={["#2292f4", "#2031f4"]}
              style={[
                {
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}>
              <Icon textStyle={{ fontSize: 30, color: "white" }} type="plus" />
            </LinearGradient>
          </TouchableOpacity>
        ),
      }}
    />
    <Tab.Screen
      name={__("Transactions")}
      component={Transactions}
      options={{
        tabBarIcon: ({ color }) => <Icon style={{ backgroundColor: useDarkTheme() ? palette.darkGray : "white" }} textStyle={{ fontSize: 26, color }} type="exchangeAlt" />,
      }}
    />
    <Tab.Screen
      name={__("Settings")}
      component={Settings}
      options={{
        tabBarIcon: ({ color }) => <Icon style={{ backgroundColor: useDarkTheme() ? palette.darkGray : "white" }} textStyle={{ fontSize: 26, color }} type="cog" />,
      }}
    />
  </Tab.Navigator>
)

export default connect(
  state => ({
    language: state.common.language,
  }),
  null,
)(Component)
