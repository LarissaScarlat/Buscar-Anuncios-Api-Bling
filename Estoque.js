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

router.get("/produtos", async (req, res) => {
    try {
        const { criterio = 5, tipo = "P" } = req.query;

        if (!criterio) {
            return res.status(400).json({ error: "Parâmetro 'criterio' é obrigatório." });
        }    

        const tokens = loadTokens();
        if (!tokens || !tokens.access_token) {
            return res.status(401).json({ error: "Access token não encontrado. Faça a autenticação novamente." });
        }

        let page = 1;
        let totalPages = 1;
        const allProducts = [];

        do {
            const url = `https://www.bling.com.br/Api/v3/produtos?criterio=${criterio}&tipo=${tipo}&pagina=${page}`;
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: "application/json"
                },
                timeout: 15000
            });

            const data = response.data;

            // adiciona produtos
            if (data?.data?.data?.length > 0) {
                allProducts.push(...data.data.data);
            }

            // Atualiza totalPages
            totalPages = data?.data?.totalPages || 1;
            page++;

        } while (page <= totalPages);

        return res.json({
            message: "Produtos Listados com Sucesso!",
            data: {
                data: allProducts  // <-- MANTÉM FORMATO ANTIGO
            }
        });

    } catch (error) {
        console.error("❌ Erro ao buscar os produtos:");

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }

        return res.status(error.response?.status || 500).json({
            error: "Erro ao consultar saldo do produto",
            details: error.response?.data || error.message
        });
    }
});

export default router;


