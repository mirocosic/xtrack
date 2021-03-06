import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


export default class ExpensesList extends React.Component {
  render(){

    const expenses = this.props.expenses || [];

    return(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Category</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Date/Time</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>

          { expenses.map( (expense, idx) => {
            const date = expense.date || new Date();
            return (<TableRow key={idx}>
              <TableRowColumn>{idx}</TableRowColumn>
              <TableRowColumn>{expense.category || ""}</TableRowColumn>
              <TableRowColumn>{expense.amount || ""}</TableRowColumn>
              <TableRowColumn>{date.toString()}</TableRowColumn>
            </TableRow>
          )
          })}

        </TableBody>
      </Table>
    );
  }
}
