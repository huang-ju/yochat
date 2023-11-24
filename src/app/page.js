"use client";
import { useState, useEffect } from "react";
import EosApi from "eosjs-api";
import _ from "lodash";

import Header from "@/components/header/index";
import MsgCard from "@/components/msgCard/index";

const options = {
  httpEndpoint: "https://api.web3name.one",
  verbose: false,
  fetchConfiguration: {},
};

const eos = EosApi(options);
let textid = "";

export default function Home() {
  const [msgList, setMsgList] = useState([]);
  const [msgData, setMsgData] = useState(null);

  /**
   * 获取消息key
   */
  const getEosNewKey = async (key = undefined) => {
    const response = await eos.getTableRows({
      code: "name.w3n", // 合约账户名
      scope: "name.w3n", // 表的作用域（一般为合约账户名）
      table: "chatidtable", // 表名
      json: true, // 返回结果是否以 JSON 格式
      limit: 10, // 返回结果的最大行数限制
      lower_bound: key ? Number(key) : undefined, // 返回结果的起始行，按照表的主键排序
      upper_bound: key ? Number(key) : undefined, // 返回结果的结束行，按照表的主键排序
      reverse: true, //从最后一行往前获取
    });
    const { next_key, rows = [] } = response;
    if (next_key) {
      textid = next_key;
    }
    rows.forEach((item) => {
      getEosNewDetail(item.author, item.textid);
    });
  };

  const getEosNewDetail = async (author, textid) => {
    const msgRes = await eos.getTableRows({
      code: "name.w3n", // 合约账户名
      scope: author, // 表的作用域（一般为合约账户名）
      table: "chattable", // 表名
      json: true, // 返回结果是否以 JSON 格式
      limit: 1, // 返回结果的最大行数限制
      lower_bound: textid, // 返回结果的起始行，按照表的主键排序
      upper_bound: textid, // 返回结果的结束行，按照表的主键排序
    });

    msgRes.rows[0]["author"] = author;
    setMsgData(msgRes.rows[0]);
  };

  useEffect(() => {
    getEosNewKey();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!msgData) {
      return;
    }
    setMsgList([...msgList, msgData]);
  }, [msgData]);

  /**
   * 监听是否滚动到底部继续加载
   * @returns
   */
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    // 触发滚动到底部的事件
    if (!textid) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      getEosNewKey(textid);
      textid = textid - 1;
    }
  }

  return (
    <div>
      <main>
        <div className="flex flex-col items-center gap-5 py-5">
          {msgList.map((msg) => {
            return MsgCard(msg);
          })}
        </div>
      </main>
    </div>
  );
}
