import React from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { BorderlessButton } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { truncate } from "lodash"

import { Title, Subtitle, Copy } from "../typography"
import Icon from "../icon"
import styles from "./styles"
import { useDarkTheme } from "../../utils/ui-utils"

export default ({ withInsets, backBtn, backBtnPress, actionBtn, actionBtnPress, style, icon, title, subtitle, children }) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, style, useDarkTheme() && styles.containerDark, withInsets ? { paddingTop: 0 + insets.top } : { paddingTop: 10 }]}>
      {backBtn && (
        <BorderlessButton
          style={[styles.backBtn, withInsets ? { top: 0 + insets.top } : { top: 8 }]}
          onPress={() => {
            backBtnPress ? backBtnPress() : navigation.goBack()
          }}>
          <Icon type="chevronLeft" style={{ backgroundColor: "transparent" }} textStyle={{ color: "white" }} />
        </BorderlessButton>
      )}
      <View style={{ alignItems: "center", justifyContent: "center", marginHorizontal: 10 }}>
        <View style={{ flexDirection: "row" }}>
          {icon}
          <Title style={{ alignSelf: "center", color: "white" }}>{truncate(title)}</Title>
        </View>

        {subtitle ? <Subtitle style={{ textAlign: "center" }}>{subtitle}</Subtitle> : null}
      </View>

      {actionBtn && (
        <TouchableOpacity style={[styles.actionBtnWrap, withInsets ? { top: 0 + insets.top } : { top: 8 }]} onPress={actionBtnPress}>
          {actionBtn}
        </TouchableOpacity>
      )}

      {children}
    </View>
  )
}
