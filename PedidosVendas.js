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

router.get("/vendas", async (req, res) => {
    try {

        const { DataInicial, DataFinal } = req.query;
        if (!DataInicial || !DataFinal) {
            return res.status(400).json({ error: "Parâmetros 'DataInicial' e 'DataFinal' são obrigatórios." });
        }

                const url = `https://www.bling.com.br/Api/v3/pedidos/vendas?dataInicial=${DataInicial}&dataFinal=${DataFinal}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                        Accept: "application/json"
                    },
                    timeout: 15000
                });
        
                return res.json({
                    message: "Pedidos de vendas listados com sucesso!",
                    data: response.data
                });
            } catch (error) {
                console.error("❌ Erro ao buscar os pedidos:");
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
                    error: "Erro ao consultar os pedidos de vendas",
                    details
                });
            }
        });
        
        export default router;