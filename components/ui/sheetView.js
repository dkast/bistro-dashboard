import { Link } from "../../routes";

const SheetView = props => (
  <span>
    <div className="sheet-view d-flex flex-column">
      <div className="sheet-navbar bg-azure text-light pt-5 pb-2 px-3">
        <div className="row">
          <div className="col-2 h5">
            <Link route={props.routeBack}>
              <a className="back-button">
                <i className="fe fe-x ml-2 h3" />
                {/* <span>Regresar</span> */}
              </a>
            </Link>
          </div>
          <div className="col-7 text-center">
            <h4 className="m-0 animated fadeInDown faster">{props.title}</h4>
          </div>
        </div>
      </div>
      <div className="sheet-body px-3 flex-grow-1 animated fadeIn faster">
        {props.content}
      </div>
      <div className="sheet-footer bg-white py-3 border-top px-3 d-flex justify-content-end">
        {props.footer}
      </div>
    </div>
    <style jsx>
      {`
        .sheet-view {
          height: 100%;
          margin-right: -0.75rem;
          margin-left: -0.75rem;
        }

        .sheet-body {
          overflow: auto;
        }

        .back-button {
          text-decoration: none;
        }
      `}
    </style>
  </span>
);

export default SheetView;
