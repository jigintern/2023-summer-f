// DIDAuthを使うためインポート
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";

document.getElementById("submit").onclick = async (event) => {
  event.preventDefault();
  // 名前が入力されていなければエラー
  const name = document.getElementById("name").value;

  console.log(name);
  if (name === "") {
    document.getElementById("error").innerText = "名前は必須パラメータです";

    return;
  }
  // `DIDAuth` モジュールの `createNewUser` を使って DID、パスワード、メッセージ、電子署名を取得
  const [did, password, message, sign] = DIDAuth.createNewUser(name);

  // // Formに反映
  // document.getElementById("did").value = did;
  // document.getElementById("password").value = password;
  // document.getElementById("sign").value = sign;
  // document.getElementById("message").value = message;

  // 公開鍵・名前・電子署名をサーバーに渡す
  try {
    const resp = await fetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        did,
        sign,
        message,
      }),
    });
    // サーバーから成功ステータスが返ってこないときの処理
    if (!resp.ok) {
      const errMsg = await resp.text();
      document.getElementById("error").innerText = "エラー：" + errMsg;
      return;
    }
    // レスポンスが正常ならローカルストレージに保存
    localStorage.setItem("did", did);
    localStorage.setItem("password", password);
    localStorage.setItem("name", name);
    // DIDとパスワードの保存
    DIDAuth.savePem(did, password);
  } catch (err) {
    document.getElementById("error").innerText = err.message;
  }
};
