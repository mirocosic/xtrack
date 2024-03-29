import React from "react"
import { View, TouchableOpacity, Keyboard, ScrollView } from "react-native"
import { Modalize } from "react-native-modalize"
import { get } from "lodash"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import Icon from "../../icon"
import { Copy } from "../../typography"
import { useDarkTheme } from "../../../utils/ui-utils"
import styles from "./styles"

export default React.forwardRef((props, ref) => {
  const { accounts, onSelect, navigation } = props
  const insets = useSafeAreaInsets()

  return (
    <Modalize onOpen={() => Keyboard.dismiss()} adjustToContentHeight modalStyle={[styles.modal, useDarkTheme() && styles.modalDark]} ref={ref}>
      <ScrollView style={{ minHeight: 200, maxHeight: 400, padding: 10 }} contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {accounts.map(account => (
          <TouchableOpacity key={account.id} onPress={() => onSelect(account)}>
            <View style={{ flexDirection: "row", alignItems: "center", margin: 5, flex: 1 }}>
              <Icon type={get(account, "icon", "")} style={{ marginRight: 10 }} textStyle={{ color: get(account, "color", "blue") }} />
              <Copy style={{ flex: 1 }}>{account.name}</Copy>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => ref.current.close()}>
          <Icon type="times" textStyle={{ color: "teal" }} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.inline, { justifyContent: "flex-start", paddingLeft: 5 }]} onPress={() => navigation.navigate("AccountEdit", {})}>
          <Icon type="plus" textStyle={{ color: "teal" }} />
          <Copy style={{ fontSize: 14 }}>Add new account</Copy>
        </TouchableOpacity>
      </ScrollView>
    </Modalize>
  )
})
