import { Link } from "../../routes";

const SheetView = props => (
  <div className="page animated fadeInUp faster">
    <div className="header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between">
          <div className="h5 my-1">
            <Link route={props.routeBack}>
              <a className="back-button">
                <i className="fe fe-x ml-2 h3" />
              </a>
            </Link>
          </div>
          <div className="text-center">
            <h3 className="my-1">{props.title}</h3>
          </div>
          <div>{props.footer}</div>
        </div>
      </div>
    </div>
    <div className="sheet-body px-3 flex-grow-1">{props.content}</div>
    <style jsx>{`
      .sheet-body {
        overflow: auto;
      }

      .back-button {
        text-decoration: none;
      }
    `}</style>
  </div>
);

export default SheetView;
