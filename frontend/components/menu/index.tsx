import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ThemeButton from "../ui/ThemeButton";
import Link from "next/link";

interface MenuProps {
  logout: () => any;
}

const Menu: React.FC<MenuProps> = ({ logout }) => {
  const [show, setShow] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        targetRef.current &&
        !targetRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  return (
    <div className="relative">
      <strong
        onClick={() => {
          setShow(!show);
        }}
        className="cursor-pointer relative flex items-center justify-center"
      >
        <Image
          alt=""
          src="/icons/user.png"
          height={30}
          width={30}
          className="border-2 rounded-full hover:cursor-pointer border-sky-300 relative"
          onClick={() => {}}
        />
      </strong>
      {show && (
        <div ref={targetRef}>
          <div className="p-3 mt-2 w-[10em] shadow right-2 text-lg rounded-md absolute shadow-gray-600">
            <div className="flex flex-col space-y-2 px-2">
              <div className="w-full flex justify-end">
                <ThemeButton />
                <br />
              </div>
              <Link
                href={"/profile"}
                className="flex flex-row items-center justify-start hover:shadow hover:shadow-sky-600 rounded-md py-1 w-full px-2"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                }}
                className="flex flex-row items-center justify-start hover:shadow hover:shadow-orange-600 rounded-md py-1 w-full px-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
