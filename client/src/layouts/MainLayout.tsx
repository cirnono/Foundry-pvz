import React from "react";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="main-layout bg-main ">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
