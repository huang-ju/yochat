"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import EosApi from "eosjs-api";
import _ from "lodash";
import Header from "@/components/header/index";

const options = {
  httpEndpoint: "https://api.web3name.one",
  verbose: false,
  fetchConfiguration: {},
};

const eos = EosApi(options);

export default function Home() {
  const [msgList, setMsgList] = useState([]);
  const [textid, setTextId] = useState(undefined);

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
      lower_bound: key, // 返回结果的起始行，按照表的主键排序
      upper_bound: key, // 返回结果的结束行，按照表的主键排序
      reverse: true, //从最后一行往前获取
    });
    const { next_key, rows = [] } = response;
    await getEosNewDetail(rows[0].author, Number(rows[0].textid));
    setTextId(next_key);
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
    setMsgList([...msgList, ...msgRes.rows]);
  };

  useEffect(() => {
    getEosNewKey();
  }, []);

  useEffect(() => {
    if (msgList.length < 100) {
      getEosNewKey(textid);
    }
  }, [textid]);

  return (
    <main className="min-h-screen">
      <Header />
      {msgList.map((msg, index) => {
        return (
          <div key={_.uniqueId("msg")} className="underline-offset-auto">
            <div>
              {msg.author}:{msg.title}
            </div>
            <div>{msg.chat}</div>
            <div>{msg.time}</div>
          </div>
        );
      })}
    </main>
  );
}
