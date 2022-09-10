import React from "react"
import { View, ScrollView } from "react-native"
import { TouchableOpacity, BorderlessButton } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Screen, Header, Copy } from "../../components"
import Icon from "../../components/icon"
import Category from "../../components/category"
import { isAndroid } from "../../utils/os-utils"
import { useDarkTheme } from "../../utils/ui-utils"
import palette from "../../utils/palette"
import styles from "./styles"

const Categories = ({ categories, navigation, selectCategory }) => {
  const insets = useSafeAreaInsets()

  return (
    <Screen>
      <Header title="Categories" subtitle="Customize categories to group your transactions" withInsets />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}>
        <View>
          {categories
            .sort((a, b) => a.name < b.name)
            .map(cat => (
              <Category
                key={cat.id}
                data={cat}
                onPress={() => {
                  selectCategory(cat)
                  navigation.goBack()
                }}
                navigation={navigation}
              />
            ))
            .reverse()}
        </View>
      </ScrollView>

      {
        // todo: rewrite this better, just an exploration
      }
      <View style={[isAndroid && { paddingBottom: 10 }, { width: "90%", left: "5%", bottom: insets.bottom, position: "absolute", flexDirection: "row" }]}>
        <View style={[styles.addWrap, { marginRight: 10 }]}>
          <BorderlessButton onPress={() => navigation.goBack()}>
            <Icon
              type="chevron-left"
              textStyle={{ color: useDarkTheme() ? palette.light : palette.dark }}
              style={{
                borderColor: useDarkTheme() ? palette.light : palette.dark,
                borderWidth: 1,
                borderRadius: 10,
              }}
            />
          </BorderlessButton>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.navigate("CategoryEdit", { id: false })} style={styles.addWrap}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={["#2292f4", "#2031f4"]} style={[{ height: 50, width: 200 }, styles.add]}>
              <Copy style={{ color: "white" }}>Add new category</Copy>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

export default Categories
