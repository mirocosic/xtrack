import React, { Component } from "react"
import { ScrollView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { get, isEmpty } from "lodash"
import { PieChart } from "react-native-chart-kit"

import { Screen, Icon, Copy, Title } from "../../components"
import __ from "../../utils/translations"
import { formatCurrency } from "../../utils/currency"
import { calcAmount, calculateIncome, calculateExpenses, calculateTransfers } from "../../utils/helper-gnomes"
import palette from "../../utils/palette"
import styles from "./styles"

const calcStartingBalance = account => {
  switch (account.currency) {
    case "EUR":
      return 7.55 * parseFloat(account.startingBalance)
    case "USD":
      return 6.66 * parseFloat(account.startingBalance)
    default:
      return parseFloat(account.startingBalance)
  }
}

const sum = transactions => transactions.reduce((acc, transaction) => acc + calcAmount(transaction), 0)

class Overview extends Component {
  state = {
    showExpensesChart: true,
  }

  static navigationOptions = () => ({ tabBarIcon: ({ tintColor }) => <Icon style={{ backgroundColor: "white" }} textStyle={{ fontSize: 26, color: tintColor }} type="tachometer-alt" /> })

  sortByCategory = expenses => {
    const result = {}
    const { categories } = this.props
    expenses.forEach(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId)
      const currExpenseSum = result[category.name] || 0
      result[category.name] = currExpenseSum + calcAmount(expense)
    })

    return result
  }

  prepDataForPieChart = expenses => {
    // rewrite this darkmode labels stupidity
    const { theme } = this.props
    const systemTheme = Appearance.getColorScheme()
    const darkMode = theme === "system" ? systemTheme === "dark" : theme === "dark"

    return Object.entries(expenses)
      .sort((a, b) => b[1] - a[1])
      .map(item => {
        const { categories } = this.props
        const cat = categories.find(c => c.name === item[0])
        return {
          name: item[0],
          amount: item[1],
          color: cat.color,
          legendFontColor: darkMode ? "white" : "black",
        }
      })
  }

  renderExpenses = (expenses, currency) =>
    Object.entries(expenses)
      .sort((a, b) => b[1] - a[1])
      .map(item => {
        const { categories } = this.props
        const cat = categories.find(c => c.name === item[0])
        return (
          <View key={item[0]} style={{ ...styles.row, paddingLeft: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 15 }}>
              <Icon type={get(cat, "icon", "")} textStyle={{ color: cat.color || "blue", fontSize: 12 }} style={{ marginRight: 5, width: 20, height: 20 }} />
              <Copy style={{ fontSize: 14 }}>{`${item[0]} `} </Copy>
            </View>
            <Copy style={{ fontSize: 14 }}>{` ${formatCurrency(item[1], currency)} `}</Copy>
          </View>
        )
      })

  changeAccountFilter = () => {
    const { accounts, changeAccountFilter } = this.props
    Alert.alert(__("Select account"), __("Please choose account"), [...accounts.map(account => ({ text: account.name, onPress: () => changeAccountFilter(account) })), { text: "All accounts", onPress: () => changeAccountFilter(false) }])
  }

  renderAccounts = callback => {
    const { accounts, changeAccountFilter } = this.props
    return accounts.map(account => (
      <TouchableOpacity
        key={account.id}
        onPress={() => {
          changeAccountFilter(account)
          callback()
        }}>
        <Text>{account.name}</Text>
      </TouchableOpacity>
    ))
  }

  calculateNetWorth = () => {
    const { transactions, accounts } = this.props
    let netWorth = 0

    accounts.forEach(acc => {
      const income = parseFloat(calculateIncome(transactions, { type: "account", value: acc }, true))
      const expenses = parseFloat(calculateExpenses(transactions, { type: "account", value: acc }, true))
      const startingBalance = acc.startingBalance ? calcStartingBalance(acc) : 0
      netWorth = netWorth + startingBalance + income - expenses
    })

    return netWorth
  }

  calcSavingsRate = () => {
    const { transactions } = this.props
    const income = parseFloat(calculateIncome(transactions))
    const expenses = parseFloat(calculateExpenses(transactions))
    if (income === 0 || income < expenses) {
      return "0%"
    }
    const rate = (((income - expenses) / income) * 100).toFixed(2)
    let emoji = ""
    if (rate > 75) {
      emoji = "😃"
    } else if (rate > 50) {
      emoji = "🙂"
    } else if (rate > 20) {
      emoji = "😐"
    } else {
      emoji = "😟"
    }
    return `${rate}% ${emoji}`
  }

  renderExpenses() {
    const { expensesByCategory } = this.props
    return Object.entries(expensesByCategory).map(item => (
      <View key={item.id} style={{ ...styles.row, paddingLeft: 20 }}>
        <Text>{`${item[0]} `}</Text>
        <Text>{`${item[1]} kn`}</Text>
      </View>
    ))
  }

  render() {
    const { accounts, transactions, theme, navigation, baseCurrency } = this.props
    const darkMode = theme === "system" ? Appearance.getColorScheme() === "dark" : theme === "dark"
    const sortedIncome = this.sortByCategory(transactions.filter(t => t.type === "income" && !t.isTransfer))
    const sortedExpenses = this.sortByCategory(transactions.filter(t => t.type === "expense" && !t.isTransfer))
    const sortedTransfers = this.sortByCategory(transactions.filter(t => t.type === "transfer" && !t.isTransfer))

    // todo: add insets to top margin
    return (
      <Screen>
        <ScrollView style={{ paddingTop: 20, marginTop: 40 }} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.inlineStart, { paddingHorizontal: 10 }]}>
            <Title>Net worth: </Title>
            <Copy style={{ fontWeight: "bold", fontSize: 20 }}>{formatCurrency(this.calculateNetWorth(), baseCurrency)}</Copy>
          </View>

          <View style={[styles.inlineStart, { paddingHorizontal: 10, paddingBottom: 20 }]}>
            <Copy style={{ marginLeft: 5 }}>Savings Rate: </Copy>
            <Copy style={{ fontWeight: "bold", fontSize: 16 }}> {this.calcSavingsRate()}</Copy>
          </View>

          <ScrollView contentContainerStyle={{ padding: 10 }} horizontal snapToInterval={320} decelerationRate="fast" showsHorizontalScrollIndicator={false}>
            {accounts.map(acc => {
              const income = parseFloat(calculateIncome(transactions, { type: "account", value: acc }))
              const expenses = parseFloat(calculateExpenses(transactions, { type: "account", value: acc }))
              const transfers = parseFloat(calculateTransfers(transactions, { type: "account", value: acc }))
              const startingBalance = acc.startingBalance ? parseFloat(acc.startingBalance) : 0

              return (
                <RectButton onPress={() => navigation.navigate("AccountDetails", { accountId: acc.id })} key={acc.id} style={[styles.accountWrap, darkMode && styles.accountWrapDark]}>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 15, flex: 1 }}>
                      <Icon type={acc.icon} textStyle={{ fontSize: 30, color: acc.color }} />
                      <Copy style={{ fontWeight: "bold", fontSize: 22, paddingBottom: 5, paddingLeft: 10, flex: 1 }}>{acc.name}</Copy>
                    </View>

                    <View>
                      {acc.startingBalance > 0 && (
                        <View style={styles.inlineBetween}>
                          <Copy style={{ fontSize: 14 }}>Starting</Copy>
                          <Copy style={{ marginVertical: 5, fontSize: 18 }}>+{formatCurrency(acc.startingBalance, baseCurrency)}</Copy>
                        </View>
                      )}

                      <View style={styles.inlineBetween}>
                        <Copy style={{ fontSize: 14 }}>Income</Copy>
                        <Copy style={{ marginVertical: 5, fontSize: 18, color: palette.green }}>+{formatCurrency(income, baseCurrency)}</Copy>
                      </View>

                      <View style={styles.inlineBetween}>
                        <Copy style={{ fontSize: 14 }}>Expenses</Copy>
                        <Copy style={{ marginVertical: 5, fontSize: 18, color: palette.red }}> -{formatCurrency(expenses, baseCurrency)}</Copy>
                      </View>

                      <View style={styles.inlineBetween}>
                        <Copy style={{ fontSize: 14 }}>Transfers</Copy>
                        <Copy style={{ fontSize: 18 }}>{formatCurrency(transfers, baseCurrency)}</Copy>
                      </View>

                      <View style={[styles.inlineBetween, { marginTop: 15 }]}>
                        <Copy style={{ fontSize: 14 }}>Total</Copy>
                        <Copy style={{ fontSize: 18, color: palette.blue }}>{formatCurrency(startingBalance + income - expenses + transfers, baseCurrency)}</Copy>
                      </View>
                    </View>
                  </View>
                </RectButton>
              )
            })}

            <TouchableOpacity onPress={() => navigation.navigate("AccountEdit")} style={[styles.accountWrap, darkMode && styles.accountWrapDark, { alignItems: "center", justifyContent: "center" }]}>
              <Title>Add account</Title>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ padding: 20 }}>
            <Title style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>All time breakdown</Title>

            <View style={[styles.inlineBetween, { marginBottom: 10 }]}>
              <Copy style={{ fontSize: 18 }}>Income: </Copy>
              <Copy style={{ fontSize: 18, color: palette.green }}>{formatCurrency(sum(transactions.filter(t => t.type === "income" && !t.isTransfer)), baseCurrency)}</Copy>
            </View>

            {this.renderExpenses(sortedIncome, baseCurrency)}

            <View style={[styles.inlineBetween, { marginBottom: 10, paddingTop: 20 }]}>
              <Copy style={{ fontSize: 18 }}>Expenses: </Copy>
              <Copy style={{ fontSize: 18, color: palette.red }}>{formatCurrency(sum(transactions.filter(t => t.type === "expense" && !t.isTransfer)), baseCurrency)}</Copy>
            </View>

            {this.renderExpenses(sortedExpenses, baseCurrency)}

            <View style={[styles.inlineBetween, { marginBottom: 10, paddingTop: 20 }]}>
              <Copy style={{ fontSize: 18 }}>Transfers: </Copy>
              <Copy style={{ fontSize: 18 }}>{formatCurrency(sum(transactions.filter(t => t.type === "transfer")), baseCurrency)}</Copy>
            </View>

            {this.renderExpenses(sortedTransfers, baseCurrency)}

            <View style={{ paddingVertical: 20 }}>
              <View style={[styles.inline]}>
                {!isEmpty(sortedExpenses) && (
                  <RectButton onPress={() => this.setState({ showExpensesChart: true })} style={[styles.chartTab, this.state.showExpensesChart && styles.chartTabSelected]}>
                    <Copy style={this.state.showExpensesChart && { color: "white" }}>Expenses</Copy>
                  </RectButton>
                )}

                {!isEmpty(sortedIncome) && (
                  <RectButton onPress={() => this.setState({ showExpensesChart: false })} style={[styles.chartTab, !this.state.showExpensesChart && styles.chartTabSelected, darkMode && styles.chartTabDark]}>
                    <Copy style={!this.state.showExpensesChart && { color: "white" }}>Income</Copy>
                  </RectButton>
                )}
              </View>

              <PieChart
                data={this.prepDataForPieChart(this.state.showExpensesChart ? sortedExpenses : sortedIncome)}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                accessor="amount"
                chartConfig={{
                  color: (opacity = 1) => `rgba(150, 215, 115, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    )
  }
}

export default Overview
