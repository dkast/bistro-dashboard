import NavLink from "./navLink";

const ItemsNavigation = props => (
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <NavLink route="items">Items</NavLink>
    </li>
    <li className="nav-item">
      <NavLink route="categories">Categorias</NavLink>
    </li>
  </ul>
);

export default ItemsNavigation;
