		  // 送信時の処理
		  document.getElementById("submit").onclick = async (event) => {
        event.preventDefault();
        // 名前が入力されていなければエラー
        const name = document.getElementById("name").value;
        if (name === "") {
          document.getElementById("error").innerText = "名前は必須パラメータです";
          return;
        }
      };
      // DIDAuthを使うためインポート
    import { DIDAuth } from 'https://jigintern.github.io/did-login/auth/DIDAuth.js';

    document.getElementById("submit").onclick = async () => {
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
      } catch (err) {
        document.getElementById("error").innerText = err.message;
      }


    // DIDとパスワードの保存処理
    document.getElementById("saveBtn").onclick = async (event) => {
      event.preventDefault();

      const did = document.getElementById("did").value;
      const password = document.getElementById("password").value;
      DIDAuth.savePem(did, password);
    };
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
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
      // `DIDAuth` モジュールの `createNewUser` を使って DID、パスワード、メッセージ、電子署名を取得
      const [did, password, message, sign] = DIDAuth.createNewUser(name);

      // Formに反映
      document.getElementById("did").value = did;
      document.getElementById("password").value = password;
      document.getElementById("sign").value = sign;
      document.getElementById("message").value = message;
    };