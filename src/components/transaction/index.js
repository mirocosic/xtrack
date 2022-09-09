import { connect } from "react-redux"
import Component from "./component"

export default connect(
  state => ({
    darkMode: state.common.darkMode,
    baseCurrency: state.common.currency,
    categories: state.categories.items,
    accounts: state.accounts.items,
  }),

  dispatch => ({
    selectTransaction: transaction => dispatch({ type: "SELECT_TRANSACTION", transaction }),
    deleteTransaction: transaction => dispatch({ type: "DELETE_TRANSACTION", transaction }),
    removeAllRecurring: transaction => dispatch({ type: "REMOVE_ALL_RECURRING_TRANSACTIONS", transaction }),
    removeFutureRecurring: transaction => dispatch({ type: "REMOVE_FUTURE_RECURRING_TRANSACTIONS", transaction }),
  }),
)(Component)
