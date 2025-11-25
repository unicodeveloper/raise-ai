"use client";

import {
  ChevronDownIcon,
  ClockIcon,
  DatabaseIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileTextIcon,
  SearchIcon,
  TrendingUpIcon,
  TypeIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Response } from "./elements/response";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ValyuResultItem {
  id?: string;
  title: string;
  url: string;
  content: any;
  description?: string;
  source: string;
  data_type?: string;
  source_type?: string;
  publication_date?: string;
  relevance_score?: number;
  image_url?: Record<string, string> | null;
  metadata?: Record<string, any>;
}

interface ValyuSearchResultProps {
  toolName?: string;
  result: {
    success: boolean;
    query: string;
    category?: string;
    results: {
      results?: Array<ValyuResultItem>;
      total_deduction_dollars?: number;
      results_by_source?: {
        web?: number;
        proprietary?: number;
      };
    };
    source: string;
  };
}

export function ValyuSearchResult({ toolName, result }: ValyuSearchResultProps) {
  const results = result.results?.results || [];
  const totalResults = results.length;

  // Metrics Calculation
  const totalWords = results.reduce((acc, item) => {
    if (typeof item.content === "string") {
      return acc + item.content.split(/\s+/).length;
    }
    return acc;
  }, 0);

  const uniqueSources = new Set(results.map((r) => r.source)).size;

  // Heuristic: 5 mins per source found + 1 min per 200 words read/analyzed
  const timeSavedMinutes = Math.round(totalResults * 5 + totalWords / 200);

  // Heuristic: Value based on $60/hour ($1/minute) productivity rate
  const estimatedValue = timeSavedMinutes * 1;

  const searchCost = result.results?.total_deduction_dollars || 0;

  if (!result.success || totalResults === 0) {
    return (
      <Card className="border-muted p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <SearchIcon className="size-4" />
          <span>No results found for "{result.query}"</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <SearchIcon className="size-3.5 text-primary" />
        </div>
        <span className="font-medium text-sm">{toolName || "Search Results"}</span>
        <Badge variant="secondary" className="ml-auto">
          {totalResults} {totalResults === 1 ? "result" : "results"}
        </Badge>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        {results.map((item, index) => (
          <ValyuResultCard key={item.id || index} result={item} index={index} />
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={ClockIcon}
          label="Time Saved"
          value={`~${timeSavedMinutes} min`}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <MetricCard
          icon={DatabaseIcon}
          label="Sources"
          value={uniqueSources.toString()}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <MetricCard
          icon={FileTextIcon}
          label="Words Processed"
          value={totalWords.toLocaleString()}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
        <MetricCard
          icon={DollarSignIcon}
          label="Est. Value"
          value={`$${estimatedValue.toFixed(2)}`}
          color="text-green-500"
          bgColor="bg-green-500/10"
        />
      </div>
      
      {/* Cost Transparency */}
      <div className="text-right text-[10px] text-muted-foreground">
        Search Cost: ${searchCost.toFixed(4)}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1.5 rounded-lg border border-muted bg-card p-3 transition-colors hover:bg-muted/50">
      <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", bgColor)}>
        <Icon className={cn("size-3.5", color)} />
      </div>
      <div className="mt-1 font-semibold text-sm">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ValyuResultCard({
  result,
  index,
}: {
  result: ValyuResultItem;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0); // First result expanded by default
  const isStructured = result.data_type === "structured";
  const hasChart = isStructured && Array.isArray(result.content);

  return (
    <Card className="overflow-hidden border-muted transition-all hover:border-border">
      {/* Header */}
      <div
        className="group flex cursor-pointer items-start gap-3 p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <SearchIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-medium text-sm leading-tight"
              dangerouslySetInnerHTML={{ __html: result.title }}
            />
            {result.relevance_score && (
              <Badge variant="outline" className="flex shrink-0 items-center gap-1 text-xs">
                <TrendingUpIcon className="size-3" />
                {Math.round(result.relevance_score * 100)}% match
              </Badge>
            )}
          </div>

          {result.description && (
            <p
              className="mt-1 text-muted-foreground text-xs line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.description }}
            />
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <DatabaseIcon className="size-3 opacity-70" />
              {result.data_type || "unstructured"}
            </Badge>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-xs dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              {result.source}
            </Badge>
            {typeof result.content === "string" && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <TypeIcon className="size-3 opacity-70" />
                {result.content.length} chars
              </Badge>
            )}
            {result.publication_date && (
              <span className="text-muted-foreground text-xs">• {result.publication_date}</span>
            )}
            <span className="hidden text-[10px] text-muted-foreground/70 transition-opacity group-hover:inline-block">
              {expanded ? "Click to collapse" : "Click to expand"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {(result.source_type === "paper" || result.data_type === "paper" || result.source.toLowerCase().includes("arxiv") || result.source.toLowerCase().includes("pubmed")) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              title="Copy Citation"
              onClick={(e) => {
                e.stopPropagation();
                const citation = `${result.title}. ${result.source}. ${result.publication_date || ""}. ${result.url}`;
                navigator.clipboard.writeText(citation);
                // You might want to trigger a toast here, but we'll keep it simple for now
              }}
            >
              <FileTextIcon className="size-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
          <div className="flex h-6 w-6 items-center justify-center">
            <ChevronDownIcon
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                expanded && "rotate-180",
              )}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-muted p-4">
          {/* Images */}
          {result.image_url && Object.keys(result.image_url).length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {Object.values(result.image_url)
                .filter(Boolean)
                .slice(0, 4)
                .map((url, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={url as string}
                    alt={`${result.title} - Image ${idx + 1}`}
                    className="aspect-video h-24 w-full rounded-md border border-border object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ))}
            </div>
          )}

          {/* Chart for structured data */}
          {hasChart ? (
            <StockChart data={result.content} metadata={result.metadata} />
          ) : (
            /* Text content */
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {typeof result.content === "string" ? (
                <Response>{result.content}</Response>
              ) : typeof result.content === "number" ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold">${result.content}</span>
                  {result.metadata?.currency && (
                    <span className="text-muted-foreground text-sm">{result.metadata.currency}</span>
                  )}
                </div>
              ) : (
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                  {JSON.stringify(result.content, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Metadata */}
          {result.metadata && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-muted pt-3">
              {Object.entries(result.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs"
                >
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {/* View Source Link */}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
          >
            View Source
            <ExternalLinkIcon className="size-3" />
          </a>
        </div>
      )}
    </Card>
  );
}

function StockChart({
  data,
  metadata,
}: {
  data: Array<{
    datetime: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  metadata?: Record<string, any>;
}) {
  if (!data || data.length === 0) return null;

  // Calculate price change
  const firstClose = data[data.length - 1]?.close || 0;
  const lastClose = data[0]?.close || 0;
  const priceChange = lastClose - firstClose;
  const priceChangePercent = firstClose ? (priceChange / firstClose) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Format data for chart
  const chartData = [...data].reverse().map((item) => ({
    date: new Date(item.datetime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: item.close,
    volume: item.volume,
  }));

  return (
    <div className="space-y-3">
      {/* Stock info header */}
      <div className="flex items-start justify-between">
        <div>
          {metadata?.name && (
            <div className="font-semibold text-sm">{metadata.name}</div>
          )}
          {metadata?.ticker && (
            <div className="text-muted-foreground text-xs">{metadata.ticker}</div>
          )}
        </div>
        <div className="text-right">
          <div className="font-mono text-xl font-bold">
            ${lastClose.toFixed(2)}
          </div>
          <div
            className={cn("text-sm font-medium", {
              "text-green-600 dark:text-green-400": isPositive,
              "text-red-600 dark:text-red-400": !isPositive,
            })}
          >
            {isPositive ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "currentColor", opacity: 0.5 }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor", opacity: 0.5 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Data points info */}
      <div className="text-muted-foreground text-xs">
        Click to expand • {data.length} data points
      </div>
    </div>
  );
}
