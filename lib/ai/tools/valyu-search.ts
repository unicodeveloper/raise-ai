import { tool } from "ai";
import { z } from "zod";
import { Valyu } from 'valyu-js';

export const valyuSearch = tool({
  description: `Search for real-time information using Valyu DeepSearch API.
  Use this when you need up-to-date information about:
  - Current events, news, or recent developments
  - Financial data (stock prices, market data, earnings, SEC filings)
  - Academic research papers (arxiv, pubmed, scholarly articles)
  - Clinical trials and medical information
  - Any information that requires real-time web search

  This tool provides access to authoritative sources and is more accurate than relying on training data.`,
  inputSchema: z.object({
    query: z.string().describe("The FULL and EXACT search query as provided by the user. Do NOT summarize, truncate, or rephrase it. Pass it exactly as is."),
    category: z
      .enum(["general", "finance", "academic", "healthcare"])
      .optional()
      .describe("Optional category to focus the search. Use 'finance' for stocks/markets, 'academic' for research papers, 'healthcare' for medical info."),
    includedSources: z
      .array(z.string())
      .optional()
      .describe("Optional specific Valyu sources to search (e.g., ['valyu/valyu-stocks-US', 'valyu/valyu-arxiv'])"),
    maxResults: z
      .number()
      .optional()
      .describe("Maximum number of results to return (default: 10)"),
  }),
  execute: async ({ query, category, includedSources, maxResults }) => {
    console.log("🔍 [VALYU] Tool called with:", { query, category, includedSources, maxResults });

    const apiKey = process.env.VALYU_API_KEY;

    if (!apiKey) {
      console.error("❌ [VALYU] API key not found in environment");
      return {
        error: "Valyu API key is not configured. Please add VALYU_API_KEY to your environment variables.",
      };
    }

    console.log("✅ [VALYU] API key found, initializing Valyu client");

    try {
      const valyu = new Valyu(apiKey);

      // Build search options (query is the first parameter, options are second)
      const searchOptions: any = {};

      // Add category-specific sources if no custom sources provided
      if (!includedSources && category) {
        // Only restrict to proprietary sources for finance queries which need specific structured data
        if (category === "finance") {
          searchOptions.searchType = "proprietary";
          searchOptions.includedSources = [
            "valyu/valyu-stocks-US",
            "valyu/valyu-earnings-US",
            "valyu/valyu-sec-US",
          ];
        }
        // For healthcare, academic, and general - we default to a broad search (web + other sources)
        // We do NOT restrict to specific proprietary indexes to ensure we get FDA labels, news, and broader context.
      } else if (includedSources) {
        searchOptions.searchType = "proprietary";
        searchOptions.includedSources = includedSources;
      }

      if (maxResults) {
        searchOptions.maxNumResults = maxResults;
      }

      console.log("📤 [VALYU] Sending search request:");
      console.log("  Query:", query);
      console.log("  Options:", JSON.stringify(searchOptions, null, 2));

      // Perform the search (query as first parameter, options as second)
      const response = await valyu.search(query, searchOptions);

      console.log("📥 [VALYU] Search response received:");
      console.log(JSON.stringify(response, null, 2));

      const result = {
        success: true,
        query,
        category: category || "general",
        results: response,
        source: "Valyu DeepSearch API",
      };

      console.log("✅ [VALYU] Returning result to AI");

      return result;
    } catch (error: any) {
      console.error("❌ [VALYU] Search error:", error);
      console.error("Error stack:", error.stack);
      return {
        error: `Failed to perform Valyu search: ${error.message || "Unknown error"}`,
        query,
      };
    }
  },
});
