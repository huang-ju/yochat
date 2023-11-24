"use client";
import { useState, useEffect } from "react";
import EosApi from "eosjs-api";

const options = {
  httpEndpoint: "https://api.web3name.one",
  verbose: false,
  fetchConfiguration: {},
};

const eos = EosApi(options);

export default function Login() {
  const [account, setAccount] = useState("");

  /**
   * 创建账号
   */
  const createAccount = async () => {};

  const handleRegister = async () => {
    if (!account) {
      return;
    }
    try {
      await checkAvailability(account);
      console.log();
    } catch (error) {}
  };

  /**
   * 确认账号是否注册
   */
  const checkAvailability = async () => {
    try {
      const res = await eos.getAccount(account);
      return false;
    } catch (error) {
      if (error.json.code == 500) {
        return true;
      } else {
        alert(error);
      }
    }
  };

  return (
    <main className="min-h-screen">
      <h2>登录/注册</h2>
      <input value={account} onChange={(e) => setAccount(e.target.value)} />
      <div onClick={handleRegister}>注册</div>
    </main>
  );
}
