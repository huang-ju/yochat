"use client";
import { useState, useEffect } from "react";
import AnchorLinkBrowserTransport from "@amax/anchor-link-browser-transport";
import AnchorLink from "@amax/anchor-link";

const identifier = "w3n";
export default function Header() {
  let link;
  useEffect(() => {
    const transport = new AnchorLinkBrowserTransport();
    link = new AnchorLink({
      transport,
      chains: [
        {
          chainId:
            "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
          nodeUrl: "https://api.web3name.one",
        },
      ],
    });
  }, []);

  const handleLogin = () => {
    // link.login(identifier).then((res) => {
    //   console.log("啦啦啦啦", res);
    // });
  };

  /**
   * 获取登录状态
   */
  const restoreSession = () => {
    link
      .restoreSession(identifier)
      .then((result) => {
        // session = result;
        // if (session) {
        //   didLogin();
        //   return true;
        // } else {
        //   return false;
        // }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  /**
   * 登出
   */
  const handleLogOut = async () => {
    await link.current.clearSessions(identifier);
    setAccount(undefined);
    setSession(undefined);
  };

  return (
    <header className="bg-white h-10	flex items-center">
      {/* <div className="cursor-pointer" onClick={handleLogin}>登录</div> */}
    </header>
  );
}
