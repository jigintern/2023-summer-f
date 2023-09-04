// pemファイルを受け取って、DIDとパスワードを取得
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const pemFile = document.getElementById("pemFile").files[0];
    if (!pemFile) {
      document.getElementById("error").innerText =
        "ファイルを選択してください。";
    }

    const [did, password] = await DIDAuth.getDIDAndPasswordFromPem(pemFile);

    // サーバーにユーザー情報を問い合わせる
    const path = "/users/login";
    const method = "POST";
    // 電子署名とメッセージの作成
    const [message, sign] = DIDAuth.genMsgAndSign(did, password, path, method);

    // 公開鍵・電子署名をサーバーに渡す
    try {
      const resp = await fetch(path, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ did, sign, message }),
      });

      // サーバーから成功ステータスが返ってこないときの処理
      if (!resp.ok) {
        const errMsg = await resp.text();
        document.getElementById("error").innerText = "エラー：" + errMsg;
        return;
      }

      // レスポンスが正常ならローカルストレージに保存
      const json = await resp.json();
      localStorage.setItem("did", did);
      localStorage.setItem("password", password);
      localStorage.setItem("name", json.user.name);

      document.getElementById("status").innerText = "ログイン成功";
      document.getElementById("name").innerText = json.user.name;
      document.getElementById("did").innerText = did;
      document.getElementById("password").innerText = password;
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });