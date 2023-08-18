import Link from "next/link";
import React from "react";

const MainNav = () => {
  const menuItems = [
    { id: 1, path: "/", title: "Home" },
    { id: 2, path: "/", title: "Home" },
    { id: 3, path: "/", title: "Home" },
  ];
  return (
    <div className="flex flex-row items-center justify-center gap-x-3">
      {menuItems.map((item) => (
        <Link key={item.id} href={item.path}>
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default MainNav;
