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
        />
      </div>
    );
  }
}

SimpleTable.defaultProps = {
  filterable: false
};

export default SimpleTable;
