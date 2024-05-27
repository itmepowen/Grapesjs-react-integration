import React from "react";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  const userProfile = {
    name: "pawan",
    email: "",
    avatar:
      "https://as1.ftcdn.net/v2/jpg/04/08/31/02/1000_F_408310281_PFcZmsZgWQiEohhN2xWe7y2j6Fj7rIi6.jpg",
  };
  return (
    <div>
      <header className="fixed-header">
        <div className="header-left">
          <img src="https://via.placeholder.com/50" alt="Logo" />
        </div>
        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/about">About</Link>
          </div>
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <Link to="/nothing-here">Nothing Here</Link>
          </div>
        </nav>
        {/* Profile */}
        <div className="header-right">
          {/* Placeholder profile information */}
          <div className="profile-info">
            <img src={userProfile.avatar} alt="Profile" />
            <div>
              <span>{userProfile.name}</span>
              <span>{userProfile.email}</span>
            </div>
          </div>
        </div>
      </header>

      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;
