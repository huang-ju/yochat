"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
      limit: 1, // 返回结果的最大行数限制
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
    console.log("msgList", JSON.stringify(msgList));
  };

  useEffect(() => {
    getEosNewKey();
  }, []);

  useEffect(() => {
    if (msgList.length < 2) {
      getEosNewKey(textid);
    }
  }, [textid]);

  return (
    <div className="min-h-screen">
      <Header />
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
