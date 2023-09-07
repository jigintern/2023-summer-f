import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { DIDAuth } from "https://jigintern.github.io/did-login/auth/DIDAuth.js";
import { addDID, checkIfIdExists, getUser, addtime, updatetime, checkIftimeExists, selectID } from "./db-controller.js";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  // if (req.method === "GET" && pathname === "/welcome-message") {
  //   return new Response("jigインターンへようこそ！");
  // }

  // 時間設定API
  if (req.method === "POST" && pathname === "/time_set") {
    const json = await req.json();
    const time = json.time;
    const did = json.did;


    //一度設定したことがあるかの確認
    try {
      const id = await selectID(did);
      const isExists = await checkIftimeExists(id);
      if (isExists) {
        //設定がある場合DBのtimeを更新
        try {
          await updatetime(time, id);
          return new Response(JSON.stringify({ user_id: id }));
        } catch (e) {
          return new Response(e.message, { status: 500 });
        }
      } else {
        //設定がない場合DBにtimeとidを追加
        try {
          await addtime(time, id);
          return new Response(JSON.stringify({ user_id: id }));
        } catch (e) {
          return new Response(e.message, { status: 500 });
        }
      }
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }



  // ユーザー新規登録API
  if (req.method === "POST" && pathname === "/users/register") {
    const json = await req.json();
    const userName = json.name;
    const sign = json.sign;
    const did = json.did;
    const message = json.message;

    // 電子署名が正しいかチェック
    try {
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }

    // 既にDBにDIDが登録されているかチェック
    try {
      const isExists = await checkIfIdExists(did);
      if (isExists) {
        return Response("登録済みです", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }

    // DBにDIDとuserNameを保存
    try {
      await addDID(did, userName);
      return new Response("ok");
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  // ユーザーログインAPI
  if (req.method === "POST" && pathname === "/users/login") {
    const json = await req.json();
    const sign = json.sign;
    const did = json.did;
    const message = json.message;

    // 電子署名が正しいかチェック
    try {
      const chk = DIDAuth.verifySign(did, sign, message);
      if (!chk) {
        return new Response("不正な電子署名です", { status: 400 });
      }
    } catch (e) {
      return new Response(e.message, { status: 400 });
    }

    // DBにdidが登録されているかチェック
    try {
      const isExists = await checkIfIdExists(did);
      if (!isExists) {
        return new Response("登録されていません", { status: 400 });
      }
      // 登録済みであればuser情報を返す
      const res = await getUser(did);
      const user = { did: res.rows[0].did, name: res.rows[0].name };
      return new Response(JSON.stringify({ user }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
