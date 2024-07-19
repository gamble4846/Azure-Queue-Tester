import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

type Props = {};

const CommonLayout = (_props: Props) => {
  return (
    <div className="App">
      <div className="top">
        <Header />
      </div>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
};

export default CommonLayout;
