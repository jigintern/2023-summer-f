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

    const path = "/users/login";
    const method = "POST";
    const [message, sign] = DIDAuth.genMsgAndSign(did, password, path, method);

    try {
      const resp = await fetch(path, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ did, sign, message }),
      });

      if (!resp.ok) {
        const errMsg = await resp.text();
        document.getElementById("error").innerText = "エラー：" + errMsg;
        return;
      }

      const json = await resp.json();
      localStorage.setItem("did", did);
      localStorage.setItem("password", password);
      localStorage.setItem("name", json.user.name);
      window.location.href = "setting.html";
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });
