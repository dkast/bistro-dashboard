import React, { Component } from "react";
import ReactTable from "react-table";

class SimpleTable extends Component {
  render() {
    return (
      <div className="bg-white">
        <ReactTable
          className="-striped -highlight"
          data={this.props.data}
          columns={this.props.columns}
          minRows={3}
          filterable={this.props.filterable}
          showPagination={false}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                this.props.onRowClick(rowInfo);
                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
        />
        <style jsx global>{`
          .ReactTable .rt-tr {
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}

SimpleTable.defaultProps = {
  filterable: false
};

export default SimpleTable;
