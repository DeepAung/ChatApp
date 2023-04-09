import React from "react";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import { Link } from "react-router-dom";

const Navbar = ({ func, name, to, attr }) => {

  return (
    <div className="nav-bar">
      <Link to={to}>
        <ArrowLeft className="arrow-left" />
      </Link>
      <button
        onClick={(attr) => {
          func(attr);
        }}
      >
        {name}
      </button>
    </div>
  );
};

export default Navbar;
