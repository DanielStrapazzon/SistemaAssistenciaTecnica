// Este arquivo é o que o Vercel realmente executa como função serverless.
// Ele só importa e reexporta o app Express que já está pronto em back/index.js.
export { default } from "../back/index.js";