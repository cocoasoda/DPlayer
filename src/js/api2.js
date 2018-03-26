// import regeneratorRuntime from "regenerator-runtime";

async function Fetch(url, data) {
  let resp;
  try {
    resp = await fetch(url, {
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      method: data ? 'POST' : 'GET',
      body: data ? JSON.stringify(data) : undefined
    });
    let body;
    if (resp.ok) {
      try {
        body = await resp.json();
      }
      catch (e) {
        body = await resp.text();
        const err = new Error('NotJSON');
        err.status = resp.status;
        err.msg = body;
        throw err;
      }
      if (body.success === false) {
        throw new Error(body.msg);
      }
      return body;
    }
    const err = new Error('RequestFailed');
    err.status = resp.status;
    throw err;
  }
  catch (e) {
    throw e;
  }

}

export default {
  send(endpoint, danmakuData, callback) {
    Fetch(endpoint, danmakuData).then((r) => {
      console.log('Post danmaku:', r);
      if (callback instanceof Function) {
        callback();
      }
      return;
    }).catch((e) => {
      if (e.message === 'NotJSON') { alert(e.msg); }
      else { console.log('Request was unsuccessful: ' + e.status); }
    });
  },
  read(endpoint, callback) {
    Fetch(endpoint).then((r) => {
      callback(null, r);
      return;
    }).catch((e) => {
      if (e.message === 'NotJSON') { callback({ status: e.status, response: e.msg }); }
      else { callback({ status: e.status, response: null }); }
    });
  },

};
