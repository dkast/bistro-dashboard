import AccountMenu from "../navigation/accountMenu";

const PageHeader = props => (
  <div className="header">
    <div className="container-fluid">
      <div className="row justify-content-between">
        <div className="col">
          <h3 className="my-1 mx-2">{props.title}</h3>
        </div>
        <div className="col">
          <AccountMenu />
        </div>
      </div>
    </div>
  </div>
);

export default PageHeader;
