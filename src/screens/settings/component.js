import React, { useRef } from "react"
import { View, Alert, TouchableOpacity } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { connectActionSheet } from "@expo/react-native-action-sheet"
import ToggleSwitch from "toggle-switch-react-native"
import { Modalize } from "react-native-modalize"

import Icon from "../../components/icon"
import Screen from "../../components/screen"
import { Copy } from "../../components/typography"
import __ from "../../utils/translations"
import styles from "./styles"
import { useDarkTheme } from "../../utils/ui-utils"
import { appVersion } from "../../utils/os-utils"
import palette from "../../utils/palette"

const Settings = props => {
  const darkMode = useDarkTheme()

  const currencyModal = useRef()

  const selectLanguage = () => {
    const { setLanguage } = props
    Alert.alert(__("Select language"), __("Please choose your preferred language"), [
      {
        text: "English",
        onPress: () => {
          setLanguage({ code: "eng", shortCode: "en", longCode: "en-US", name: "English" })
        },
      },
      {
        text: "Hrvatski",
        onPress: () => {
          setLanguage({ code: "hrv", shortCode: "hr", longCode: "hr-HR", name: "Hrvatski" })
        },
      },
    ])
  }

  const selectTheme = () => {
    const { setTheme, theme } = props

    props.showActionSheetWithOptions(
      {
        options: [__("Light"), __("Dark"), __("System"), __("Cancel")],
        cancelButtonIndex: 3,
        title: __("Select app theme"),
        userInterfaceStyle: theme,
        containerStyle: { backgroundColor: darkMode ? palette.dark : palette.light },
        textStyle: { color: darkMode ? palette.light : palette.dark },
        titleTextStyle: { color: darkMode ? palette.lightGray : palette.gray },
      },
      btnIdx => {
        switch (btnIdx) {
          case 0:
            setTheme("light")
            break
          case 1:
            setTheme("dark")
            break
          case 2:
            setTheme("system")
            break
          default:
            break
        }
      },
    )
  }

  const generateTransactions = () => {
    const { accounts, categories, add } = props
    const defaultAccount = accounts.find(acc => acc.defaultAccount)
    const defaultCategory = categories.find(cat => cat.defaultCategory)

    for (let i = 0; i < 300; i++) {
      add({
        timestamp: Date.now() - i * 86400000,
        type: "expense",
        categoryId: defaultCategory?.id,
        accountId: defaultAccount?.id,
        amount: 37,
        labels: [],
      })
    }
  }

  const { navigation, openOnForm, toggleOpenOnForm, theme, language, allTrans, toggleAllTrans, currency, setBaseCurrency, hrkConverted, convertTransactions } = props

  const insets = useSafeAreaInsets()

  return (
    <Screen style={{ paddingTop: insets.top, justifyContent: "space-between" }}>
      <View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => navigation.navigate("Categories")} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View>
              <Copy>Categories</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Customize categories to group your transactions</Copy>
            </View>

            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => navigation.navigate("Accounts")} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View>
              <Copy>Accounts</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Create separate accounts for your transactions</Copy>
            </View>
            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => navigation.navigate("Labels")} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View>
              <Copy>Tags</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Tag your transactions with labels for easy tracking</Copy>
            </View>
            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => navigation.navigate("Backup")} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View style={{ maxWidth: 300 }}>
              <Copy>Backup/Restore</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Make a local backup of your data and restore it if you delete the app</Copy>
            </View>
            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => navigation.navigate("Onboarding")} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View>
              <Copy>Onboarding</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Check out the onboarding carousel!</Copy>
            </View>

            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        <View style={styles.settingWrap}>
          <RectButton onPress={() => generateTransactions()} activeOpacity={useDarkTheme() ? 0.5 : 0.1} rippleColor={useDarkTheme() ? palette.darkGray : palette.lightBlue} style={styles.settingContent}>
            <View>
              <Copy>Dummy Data</Copy>
              <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Generate Demo Dummy Transactions (x100)</Copy>
            </View>

            <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
          </RectButton>
        </View>
        {!hrkConverted ? (
          <View style={styles.settingWrap}>
            <RectButton onPress={() => convertTransactions()} style={styles.settingContent}>
              <View>
                <Copy>One time data HRK->EUR conversion</Copy>
                <Copy style={{ fontSize: 12, color: "gray", marginTop: 5 }}>Convert HRK -> EUR (7,53)</Copy>
              </View>

              <Icon type="chevronRight" style={{ backgroundColor: "transparent" }} textStyle={{ color: "gray" }} />
            </RectButton>
          </View>
        ) : null}

        <View style={{ padding: 20 }}>
          <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Copy>Open app on transaction form</Copy>
            <ToggleSwitch isOn={openOnForm} onColor={palette.blue} offColor={darkMode ? palette.gray : palette.lightGray} onToggle={toggleOpenOnForm} />
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Copy>Display transfer transactions</Copy>
            <ToggleSwitch isOn={allTrans} onColor={palette.blue} offColor={darkMode ? palette.grey : palette.lightGray} onToggle={toggleAllTrans} />
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Copy>Language</Copy>
            <TouchableOpacity onPress={selectLanguage}>
              <Copy>{language.name}</Copy>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Copy>Theme</Copy>
            <TouchableOpacity onPress={selectTheme}>
              <Copy style={{ textTransform: "capitalize" }}>{__(theme)}</Copy>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Copy>Currency</Copy>
            <TouchableOpacity onPress={() => currencyModal.current.open()}>
              <Copy style={{ fontSize: 16 }}>{currency || "HRK"}</Copy>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Copy style={{ textAlign: "right", marginBottom: 10, marginRight: 10 }}>{appVersion}</Copy>

      <Modalize adjustToContentHeight modalStyle={[styles.modal, darkMode && styles.modalDark]} ref={currencyModal}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{ margin: 20 }}
            onPress={() => {
              setBaseCurrency("EUR")
              currencyModal.current.close()
            }}>
            <Copy style={{ fontSize: 14 }}>EUR - European Euro</Copy>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ margin: 20 }}
            onPress={() => {
              setBaseCurrency("USD")
              currencyModal.current.close()
            }}>
            <Copy style={{ fontSize: 14 }}>USD - United States Dollar</Copy>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Screen>
  )
}

export default connectActionSheet(Settings)
