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

        // ============================
        // 🔵 CONFIGURAÇÃO DA PAGINAÇÃO
        // ============================
        let pagina = 1;
        const limite = 100;
        let todosProdutos = [];

        // ============================
        // 🔵 LOOP PARA PEGAR TODAS AS PÁGINAS
        // ============================
        while (true) {
            const url = `https://www.bling.com.br/Api/v3/produtos?criterio=${criterio}&tipo=${tipo}&pagina=${pagina}&limite=${limite}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: "application/json"
                },
                timeout: 15000
            });

            const lote = response.data?.data ?? [];

            // Adiciona produtos dessa página
            todosProdutos = todosProdutos.concat(lote);

            // Se voltou menos que o limite → última página
            if (lote.length < limite) {
                break;
            }

            pagina++;
        }

        // ============================
        // 🔵 RETORNO FINAL
        // ============================
        return res.json({
            message: "Todos os produtos foram listados com sucesso!",
            total: todosProdutos.length,
            data: todosProdutos
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
        const details = error.response?.data || error.message;
        const statusCode = error.response?.status || 500;
        return res.status(statusCode).json({
            error: "Erro ao consultar saldo do produto",
            details
        });
    }
});

export default router;

