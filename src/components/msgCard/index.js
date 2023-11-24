import _ from "lodash";
import * as DOMPurify from "dompurify";

import styles from "./index.module.scss";

export default function MsgCard(msg) {
  const convertLinksToHTML = (chat_html) => {
    chat_html = DOMPurify.sanitize(chat_html)
    // 正则表达式匹配网页链接
    var linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

    // 将匹配到的链接替换为HTML超链接
    let htmlWithLinks = chat_html.replace(linkRegex, function (match) {
      // 检查是否以 "http" 或 "https" 开头，如果不是则添加 "http://" 前缀
      if (!match.startsWith("http")) {
        match = "https://" + match;
      }
      return '<a href="' + match + '" target="_blank">' + match + "</a>";
    });

    return htmlWithLinks;
  };

  return (
    <div
      key={_.uniqueId("msg")}
      className="w-4/5 max-w-4xl rounded overflow-hidden shadow bg-white p-5 mx-5"
    >
      <div>
        <div className="font-bold text-xl mb-2 line-clamp-1">{msg.title}</div>
        <div
          className={styles.card_chat}
          dangerouslySetInnerHTML={{ __html: convertLinksToHTML(msg.chat) }}
        ></div>
      </div>
      <div className="py-2">
        <span className="inline-block text-gray-700 mr-2">{msg.author}</span>
      </div>
    </div>
  );
}
