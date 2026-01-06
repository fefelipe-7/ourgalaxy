<div align="center">
<h1>🌌 Our Galaxy</h1>
<p>Um espaço privado, lento e consciente para registrar sentimentos e memórias.</p>
</div>

# Our Galaxy

Um aplicativo web e mobile para preservar memórias e comunicação entre duas pessoas. Construído com React, TypeScript, Supabase e Capacitor.

## Recursos

- 💌 **Cartas**: Escreva e eternize mensagens especiais
- 💭 **Saudades**: Registre momentos de saudade
- 📸 **Momentos**: Guarde memórias com fotos e vídeos
- 🗺️ **Localizações**: Marque lugares especiais
- 📱 **Mobile First**: Otimizado para dispositivos móveis com Capacitor

## Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Mobile**: Capacitor (Android/iOS)
- **Icons**: Lucide React

## Instalação

**Pré-requisitos**: Node.js 18+

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente em `.env.local`:
   ```
   VITE_SUPABASE_URL=seu_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Build

Para criar a distribuição de produção:
```bash
npm run build
```

## Build Android

Para compilar para Android:
```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## Estrutura do Projeto

```
our-galaxy/
├── src/
│   ├── pages/          # Páginas da aplicação
│   ├── components/     # Componentes reutilizáveis
│   ├── services/       # Serviços (Supabase, API)
│   └── lib/            # Utilitários e hooks
├── android/            # Projeto Android nativo
├── dist/               # Build de produção
└── public/             # Arquivos estáticos
```

## Licença

Privado - Projeto pessoal
