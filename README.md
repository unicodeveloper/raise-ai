# RaiseAI - Smart Funding, Grant & VC Analyst AI Assistant

<div align="center">
  <a href="https://github.com/unicodeveloper/raise-ai">
    <img src="public/opengraph-image.png" alt="RaiseAI - AI Chatbot" width="100%">
  </a>
</div>

<p align="center">
  <br/>
  <strong>The Best Open Source AI VC Analyst built with Next.js, Vercel AI SDK, and Valyu Deep Search API.</strong>
  <br/>
  Specialized in financial analysis, academic research, and funding insights.
  <br/>
  <br/>
  <a href="https://github.com/unicodeveloper/raise-ai"><strong>Explore the code »</strong></a>
  <br/>
  <br/>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Funicodeveloper%2Fraise-ai&env=OPENAI_API_KEY,AUTH_SECRET,VALYU_API_KEY"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
</p>

## 🚀 Overview

**RaiseAI** is a production-ready AI chatbot designed for professionals who need more than just generic AI responses. It integrates **Deep Search** capabilities to provide real-time, authoritative data from financial markets, regulatory filings (SEC), academic papers (ArXiv, PubMed), and healthcare databases (FDA).

### Key Capabilities

- **Multi-Model Support**: Seamlessly switch between top-tier models like **Claude 3.5 Sonnet**, **GPT-4o**, **Gemini 2.0 Flash**, and **Grok 2**.
- **Artifacts UI**: Generate and render code, spreadsheets, and documents side-by-side with your conversation.
- **Valyu Deep Search Integration**: Access real-time, structured data that standard LLMs cannot provide.
- **Persistent History**: Save and organize your chats with secure authentication via NextAuth.
- **Modern UI**: A beautiful, responsive interface built with Tailwind CSS and Framer Motion.

---

## 🔍 Valyu Deep Search

This is the core superpower of RaiseAI. Unlike standard web search, Valyu Deep Search connects directly to specialized, high-integrity data sources.

**What you can do with it:**

- **💰 Financial Analysis**: "Compare Tesla vs GM stock performance over the last year, including P/E ratios and market cap."
- **📜 Regulatory Research**: "Find mentions of 'AI safety' in Microsoft's latest 10-K SEC filing."
- **🔬 Academic Research**: "Search ArXiv for the latest papers on 'Transformer architecture optimization' from 2024."
- **💊 Healthcare Insights**: "Search FDA drug labels for interactions between Metformin and Lisinopril."

**How it works:**
When you ask a complex question, RaiseAI automatically (or manually via toggle) engages the Valyu tool. It queries specific indexes (e.g., `valyu-stocks-US`, `valyu-pubmed`), retrieves the raw data, and synthesizes a comprehensive answer with citations, charts, and data tables.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs) for unified model access.
- **Database**: [Postgres](https://vercel.com/postgres) (via Drizzle ORM) for chat history.
- **Authentication**: [NextAuth.js](https://next-auth.js.org) (v5).
- **Styling**: [Tailwind CSS](https://tailwindcss.com) & [shadcn/ui](https://ui.shadcn.com).
- **Search Provider**: [Valyu](https://valyu.com) for deep specialized data retrieval.

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- A generic Postgres database (e.g., Vercel Postgres, Neon, Supabase)
- API Keys for:
  - OpenAI (or your preferred model provider)
  - Valyu (for Deep Search)
  - Auth Secret (for NextAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/unicodeveloper/raise-ai.git
cd raise-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:

```env
# Database (Postgres)
POSTGRES_URL="postgres://..."

# Authentication (Generate a random string: openssl rand -base64 32)
AUTH_SECRET="your-secret-key"

# AI Model Provider (Vercel AI Gateway or Direct)
OPENAI_API_KEY="sk-..."

# Valyu Deep Search (Required for search features)
VALYU_API_KEY="valyu-..."
```

### 4. Database Migration

Run the database migrations to set up your schema:

```bash
pnpm db:migrate
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment

The easiest way to deploy is via Vercel.

1.  Click the **Deploy** button at the top of this README.
2.  Connect your GitHub repository.
3.  Add your environment variables (`POSTGRES_URL`, `AUTH_SECRET`, `VALYU_API_KEY`, etc.) during the setup flow.
4.  Vercel will automatically build and deploy your application.

For database hosting, Vercel Postgres is the easiest integration, but any Postgres provider will work.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
