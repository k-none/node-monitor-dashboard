const express = require("express");
const axios = require("axios");
const app = express();

app.get("/health", async (req, res) => {
  const rpc = req.query.rpc;
  if (!rpc) return res.status(400).json({ error: "rpc query param required" });
  try {
    const r = await axios.post(rpc, { jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] });
    res.json({ ok: true, blockNumber: r.data.result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(3000, ()=> console.log("Monitor listening on :3000"));
