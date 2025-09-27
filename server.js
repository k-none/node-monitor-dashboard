import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_RPC = process.env.DEFAULT_RPC || "https://mainnet.infura.io/v3/YOUR_PROJECT_ID";

const rpcClient = axios.create({
  timeout: 5000, // 5s timeout
  headers: { "Content-Type": "application/json" },
});

// Health check route
app.get("/health", async (req, res) => {
  const rpc = req.query.rpc || DEFAULT_RPC;

  if (!rpc.startsWith("http")) {
    return res.status(400).json({ ok: false, error: "Invalid RPC URL" });
  }

  try {
    const response = await rpcClient.post(rpc, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_blockNumber",
      params: [],
    });

    const hexBlock = response?.data?.result;
    if (!hexBlock) {
      return res.status(502).json({ ok: false, error: "Invalid RPC response" });
    }

    const blockNumber = parseInt(hexBlock, 16);

    res.json({
      ok: true,
      rpc,
      blockNumber,
      hexBlockNumber: hexBlock,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`❌ RPC check failed: ${err.message}`);
    res.status(500).json({
      ok: false,
      rpc,
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Monitor listening on port ${PORT}`);
});
