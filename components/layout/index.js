import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";

const Layout = ({ children }) => (
  <div className="wrapper">
    <SideBar />
    <div className="container-fluid">{children}</div>
    <style jsx>
      {`
        .container-fluid {
          margin-left: 64px;
        }
      `}
    </style>
  </div>
);

const SideBar = () => (
  <SideNav>
    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home" />
    <NavItem eventKey="home">
      <NavIcon>
        <i className="fe fe-mail" />
      </NavIcon>
      <NavText>Home</NavText>
    </NavItem>
  </SideNav>
);

export default Layout;
