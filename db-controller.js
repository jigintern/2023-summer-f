import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import "https://deno.land/std@0.192.0/dotenv/load.ts";

// SQLの設定
const connectionParam = {
  hostname: Deno.env.get("HOST_NAME"),
  username: Deno.env.get("SQL_USER"),
  password: Deno.env.get("SQL_PASSWORD"),
  db: Deno.env.get("DATABASE"),
  port: Number(Deno.env.get("PORT")),
};

// クライアントの作成
const client = await new Client().connect(connectionParam);

export async function checkIfIdExists(did) {
  // DBにDIDがあるか
  const res = await client.execute(
    `select count(*) from users where did = ?;`,
    [did],
  );
  // レスポンスのObjectから任意のDIDと保存されているDIDが一致している数を取得し
  // その数が1かどうかを返す
  // DBにはDIDが重複されない設計になっているので一致している数は0か1になる
  return res.rows[0][res.fields[0].name] === 1;
}

export async function addDID(did, userName) {
  // DBにDIDとuserNameを追加
  await client.execute(`insert into users (did, name) values (?, ?);`, [
    did,
    userName,
  ]);
}

export async function getUser(did) {
  // DBからsignatureが一致するレコードを取得
  const res = await client.execute(`select * from users where did = ?;`, [did]);
  return res;
}

// idの選択
export async function selectID(did) {
  let id = await client.query(
    `SELECT ?? FROM users WHERE ?? = ?;`,
    ["id", "did", did]
  );
  for (const row of id) {
    id = row.id;
  }
  return id;
}

// 設定したことがあるかの確認
export async function checkIftimeExists(id) {
  let res = await client.execute(
    `select count(*) from time_list where ?? = ?;`,
    ["user_id", id],
  );
  return res.rows[0][res.fields[0].name] === 1;
}

// DBにtimeを更新
export async function updatetime(time, id) {
  await client.execute(`
  UPDATE time_list 
  SET ?? = ?
  WHERE ?? = ?
  ;
`, [
  "wake_up_time", time,
  "user_id", id
  ]
  );
}

// DBにidとtimeを追加
export async function addtime(time, id) {
  await client.execute(`
  INSERT INTO time_list (
    ??, ??
  ) VALUES (
    ?, ?
  );
  `, [
  "user_id", "wake_up_time",
  id, time
  ]
  );
}

export async function selectTime(id) {
  let time = await client.query(
    `SELECT ?? FROM time_list WHERE ?? = ?;`,
    ["wake_up_time", "user_id", id]
  );
  for (const row of time) {
    time = row.wake_up_time;
  }
  return time;
}


