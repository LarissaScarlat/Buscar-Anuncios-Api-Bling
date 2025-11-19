import express from "express";
import axios from "axios";
import fs from "fs";

const router = express.Router();

function loadTokens() {
  try {
    const raw = fs.readFileSync("tokens.json", "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

router.get("produtos/:sku", async (req, res) => {
  try {
    const sku = req.params.sku;

    if (!sku) {
      return res.status(400).json({ error: "Você deve informar o SKU do produto na URL." });
    }

    const tokens = loadTokens();
    if (!tokens || !tokens.access_token) {
      return res.status(401).json({ error: "Access token não encontrado. Faça a autenticação novamente." });
    }

    // ----- API DO BLING (buscar produto por SKU) -----
    const url = `https://www.bling.com.br/Api/v3/produtos?codigo=${sku}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/json"
      },
      timeout: 15000
    });

    const produtos = response.data.data;

    if (!produtos || produtos.length === 0) {
      return res.json({
        message: "Produto NÃO encontrado na Bling",
        existe: false,
        produtos: []
      });
    }

    return res.json({
      message: "Produto encontrado com sucesso!",
      existe: true,
      produtos: produtos
    });

  } catch (error) {
    console.error("❌ Erro ao buscar produto:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    const details = error.response?.data || error.message;
    const statusCode = error.response?.status || 500;

    return res.status(statusCode).json({
      error: "Erro ao consultar produto",
      details
    });
  }
});

export default router;
