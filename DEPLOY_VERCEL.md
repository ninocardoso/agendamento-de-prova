# Guia de Deploy na Vercel

Siga os passos abaixo para colocar sua aplicação online na Vercel.

## 1. Instalação da Vercel CLI (Opcional)
Se você quiser fazer o deploy pelo terminal, instale a CLI:
```bash
npm install -g vercel
```

## 2. Realizando o Deploy

### Opção A: Pelo Terminal (CLI)
1. Na raiz do projeto, execute:
   ```bash
   vercel
   ```
2. Siga as instruções no terminal (pode dar "Yes" para as perguntas padrão).
3. Quando solicitado pelas Variáveis de Ambiente, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Opção B: Pelo Painel da Vercel (Recomendado)
1. Crie uma conta em [vercel.com](https://vercel.com).
2. Conecte seu repositório GitHub/GitLab.
3. Importe o projeto `agendamento_de_prova`.
4. Em **Environment Variables**, adicione as mesmas chaves do Supabase mencionadas acima.
5. Clique em **Deploy**.

## 3. Configurações Importantes
O arquivo `vercel.json` já foi criado para garantir que as rotas da sua aplicação funcionem corretamente (SPA).

> [!TIP]
> O comando de build na Vercel deve ser automaticamente detectado como `npm run build` e o diretório de saída como `dist`.
