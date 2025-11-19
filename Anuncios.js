import express from "express";
import axios from "axios";
import { getToken } from "../Authteste.js"; // Usa o mesmo sistema de tokens já existente

const router = express.Router();

router.get("/produtos/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const token = await getToken(); // Usa a função existente

  try {
    const response = await axios.get(
      "https://www.bling.com.br/Api/v3/produtos",
      {
        params: {
          pesquisa: codigo,   // pesquisa por código ou descrição
          pagina: 1,
          limite: 50
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );

    res.json({
      sucesso: true,
      produtos: response.data.data
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.response?.data || error);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao consultar produtos no Bling",
      erro: error.response?.data || error
    });
  }
});

export default router;
