import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaChartLine,
  FaClock,
  FaCloudSun,
  FaCommentDots,
  FaExternalLinkAlt,
  FaFire,
  FaGoogle,
  FaNewspaper,
  FaPlus,
  FaRedo,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import "./market-button.css";

const STORAGE_KEY = "market-button-watchlist";
const TICKER_KEY = "sb-selected-ticker";
const RANGE_KEY = "sb-selected-range";
const SMCI_MIGRATION_KEY = "market-button-smci-added-v2";
const DASHBOARD_OWNER = "Sonny Saifnoorian";

const DEFAULT_WATCHLIST = ["NVDA", "AAPL", "TSLA", "SMCI", "MSFT", "AMD"];
const INDEX_SHORTCUTS = ["SPY", "QQQ", "IWM"];
const MARKET_INDEXES = [
  { label: "Dow", ticker: "DJI", name: "Dow Jones", symbol: "DJ:DJI" },
  { label: "S&P", ticker: "SPX", name: "S&P 500", symbol: "SP:SPX" },
  { label: "Nasdaq", ticker: "IXIC", name: "Nasdaq Composite", symbol: "NASDAQ:IXIC" },
] as const;
const MARKET_ACTIONS = [
  { label: "AI Overview", type: "overview", icon: FaGoogle },
  { label: "Google News", type: "news", icon: FaNewspaper },
  { label: "Stock Search", type: "finance", icon: FaSearch },
  { label: "Pre/Post", type: "premarket", icon: FaBolt },
  { label: "Earnings", type: "earnings", icon: FaCalendarAlt },
  { label: "Options", type: "options", icon: FaChartLine },
] as const;
const FORT_LEE_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=40.8509&longitude=-73.9701&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1";
const BREAKING_NEWS_TERMS = [
  "breaking",
  "surges",
  "plunges",
  "jumps",
  "falls",
  "slides",
  "beats",
  "misses",
  "earnings",
  "guidance",
  "lawsuit",
  "investigation",
  "acquisition",
  "merger",
  "recall",
  "sec",
  "downgrade",
  "upgrade",
  "forecast",
];
const RANGE_OPTIONS = [
  { label: "1D", range: "1D", interval: "5" },
  { label: "5D", range: "5D", interval: "15" },
  { label: "1M", range: "1M", interval: "60" },
  { label: "6M", range: "6M", interval: "D" },
  { label: "YTD", range: "YTD", interval: "D" },
  { label: "1Y", range: "12M", interval: "D" },
] as const;

type RangeOption = (typeof RANGE_OPTIONS)[number];
type SearchType = "overview" | "news" | "finance" | "premarket" | "earnings" | "options";
type MarketAction = (typeof MARKET_ACTIONS)[number];
type WeatherState = {
  current: number;
  high: number;
  low: number;
  summary: string;
} | null;
type NewsAlert = {
  ticker: string;
  title: string;
  link: string;
  source: string;
} | null;

// ── Pure helpers ─────────────────────────────────────────────────────────

const normalizeTicker = (value: string) =>
  value
    .replace(/[^a-zA-Z.]/g, "")
    .toUpperCase()
    .slice(0, 8);

const uniqueTickers = (tickers: string[]) => Array.from(new Set(tickers));

const toTradingViewSymbol = (ticker: string) => {
  const marketIndex = MARKET_INDEXES.find((idx) => idx.ticker === ticker);
  if (marketIndex) return marketIndex.symbol;
  if (ticker.includes(".")) return ticker;
  return `NASDAQ:${ticker}`;
};

const isMarketIndexTicker = (ticker: string) =>
  MARKET_INDEXES.some((idx) => idx.ticker === ticker);

const buildGoogleUrl = (ticker: string, searchType: SearchType | MarketAction["type"]) => {
  const queries: Record<string, string> = {
    overview: `${ticker} stock AI overview`,
    news: `${ticker} stock news today`,
    finance: `${ticker} stock price`,
    premarket: `${ticker} stock premarket after hours`,
    earnings: `${ticker} earnings date stock`,
    options: `${ticker} options chain stock`,
  };
  const params = new URLSearchParams({ q: queries[searchType] });
  if (searchType === "news") params.set("tbm", "nws");
  return `https://www.google.com/search?${params.toString()}`;
};

const buildNewsFeedUrl = (ticker: string) => {
  const feedUrl = `https://news.google.com/rss/search?${new URLSearchParams({
    q: `${ticker} stock when:1d`,
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  }).toString()}`;
  return `https://api.allorigins.win/raw?${new URLSearchParams({ url: feedUrl }).toString()}`;
};

const getNewsSource = (item: Element) =>
  item.querySelector("source")?.textContent?.trim() || "Google News";

const isBreakingStyleHeadline = (title: string) => {
  const lowered = title.toLowerCase();
  return BREAKING_NEWS_TERMS.some((term) => lowered.includes(term));
};

const fetchWithTimeout = async (url: string, timeoutMs = 3500) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
};

const getWeatherSummary = (code: number) => {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Clouds";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Storms";
  return "Weather";
};

const getNewYorkParts = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date);

const getNewYorkTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

const formatRefreshedTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

const getMarketSession = (date: Date) => {
  const parts = getNewYorkParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hourPart = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "AM";
  const hour =
    dayPeriod === "PM" && hourPart !== 12
      ? hourPart + 12
      : dayPeriod === "AM" && hourPart === 12
        ? 0
        : hourPart;
  const minutes = hour * 60 + minute;
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const open = 9 * 60 + 30;
  const close = 16 * 60;

  if (!isWeekend && minutes >= open && minutes < close) {
    return { label: "Market open", detail: "Closes at 4:00 PM ET", tone: "open" };
  }
  if (!isWeekend && minutes < open) {
    return { label: "Pre-market", detail: "Opens at 9:30 AM ET", tone: "pre" };
  }
  const nextOpen =
    weekday === "Fri" || weekday === "Sat" ? "Mon 9:30 AM ET" : "next session 9:30 AM ET";
  return { label: "Market closed", detail: `Opens ${nextOpen}`, tone: "closed" };
};

// ── TradingView chart widget ──────────────────────────────────────────────

const TradingViewChart = ({
  symbol,
  range,
  interval,
  theme,
  refreshToken,
}: {
  symbol: string;
  range: string;
  interval: string;
  theme: "light" | "dark";
  refreshToken: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      range,
      timezone: "America/New_York",
      theme,
      style: "3",
      locale: "en",
      backgroundColor: isDark ? "rgba(37, 44, 51, 1)" : "rgba(255, 255, 255, 1)",
      gridColor: isDark ? "rgba(230, 236, 240, 0.08)" : "rgba(35, 43, 52, 0.08)",
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: true,
      details: false,
      hotlist: false,
      studies: [],
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(widgetContainer);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol, range, interval, theme, refreshToken, isDark]);

  return (
    <div ref={containerRef} className="market-button__chart-widget tradingview-widget-container" />
  );
};

// ── Main component ────────────────────────────────────────────────────────

const MarketButton = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_WATCHLIST;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return DEFAULT_WATCHLIST;
      const tickers = parsed.map((t: unknown) => normalizeTicker(String(t))).filter(Boolean);
      return tickers.length ? Array.from(new Set(tickers)) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  const [selectedTicker, setSelectedTicker] = useState<string>(() => {
    const saved = localStorage.getItem(TICKER_KEY);
    if (saved) {
      const t = normalizeTicker(saved);
      if (t) return t;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeTicker(String(parsed[0])) || DEFAULT_WATCHLIST[0];
      }
    } catch { /* ignore */ }
    return DEFAULT_WATCHLIST[0];
  });

  const [selectedRange, setSelectedRange] = useState<RangeOption>(() => {
    const saved = localStorage.getItem(RANGE_KEY);
    return RANGE_OPTIONS.find((r) => r.label === saved) ?? RANGE_OPTIONS[2];
  });

  const [tickerInput, setTickerInput] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [marketClock, setMarketClock] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>(null);
  const [weatherStatus, setWeatherStatus] = useState<"loading" | "ready" | "error">("loading");
  const [newsAlert, setNewsAlert] = useState<NewsAlert>(null);
  const [latestNewsAlert, setLatestNewsAlert] = useState<NewsAlert>(null);
  const [newsStatus, setNewsStatus] = useState<"idle" | "checking" | "quiet" | "error">("idle");
  const didInitialNewsCheck = useRef(false);

  const timeTheme = useMemo(() => {
    const hour = marketClock.getHours();
    return hour >= 7 && hour < 18 ? "day" : "night";
  }, [marketClock]);

  const tradingViewSymbol = useMemo(() => toTradingViewSymbol(selectedTicker), [selectedTicker]);
  const marketSession = useMemo(() => getMarketSession(marketClock), [marketClock]);
  const newYorkTime = useMemo(() => getNewYorkTime(marketClock), [marketClock]);
  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  // ── Side effects ──────────────────────────────────────────────────────

  useEffect(() => {
    document.body.classList.add("market-button-body");
    document.title = `${DASHBOARD_OWNER} | SonnySafe`;
    return () => {
      document.body.classList.remove("market-button-body");
      delete document.body.dataset.marketButtonTheme;
      document.title = "Andrew Saifnoorian";
    };
  }, []);

  useEffect(() => {
    document.body.dataset.marketButtonTheme = timeTheme;
  }, [timeTheme]);

  useEffect(() => {
    const interval = window.setInterval(() => setMarketClock(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Persist selected ticker and range
  useEffect(() => {
    localStorage.setItem(TICKER_KEY, selectedTicker);
  }, [selectedTicker]);

  useEffect(() => {
    localStorage.setItem(RANGE_KEY, selectedRange.label);
  }, [selectedRange]);

  // Persist watchlist + auto-correct selectedTicker if removed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    if (!watchlist.includes(selectedTicker) && !isMarketIndexTicker(selectedTicker)) {
      setSelectedTicker(watchlist[0] ?? "NVDA");
    }
  }, [selectedTicker, watchlist]);

  // One-time SMCI migration
  useEffect(() => {
    if (localStorage.getItem(SMCI_MIGRATION_KEY)) return;
    setWatchlist((current) =>
      current.includes("SMCI") ? current : uniqueTickers([...current, "SMCI"]),
    );
    localStorage.setItem(SMCI_MIGRATION_KEY, "true");
  }, []);

  // ── API calls ─────────────────────────────────────────────────────────

  const loadWeather = useCallback(async () => {
    setWeatherStatus("loading");
    try {
      const response = await fetch(FORT_LEE_WEATHER_URL);
      if (!response.ok) throw new Error("Weather request failed");
      const data = await response.json();
      const current = Number(data.current?.temperature_2m);
      const high = Number(data.daily?.temperature_2m_max?.[0]);
      const low = Number(data.daily?.temperature_2m_min?.[0]);
      const weatherCode = Number(data.current?.weather_code);
      if (![current, high, low, weatherCode].every(Number.isFinite)) {
        throw new Error("Weather response was incomplete");
      }
      setWeather({
        current: Math.round(current),
        high: Math.round(high),
        low: Math.round(low),
        summary: getWeatherSummary(weatherCode),
      });
      setWeatherStatus("ready");
    } catch {
      setWeather(null);
      setWeatherStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  const checkBreakingNews = useCallback(
    async (tickers = watchlist) => {
      setNewsStatus("checking");
      try {
        const scanList = uniqueTickers(tickers).slice(0, 8);
        for (const ticker of scanList) {
          const response = await fetchWithTimeout(buildNewsFeedUrl(ticker));
          if (!response.ok) continue;
          const xml = await response.text();
          const doc = new DOMParser().parseFromString(xml, "text/xml");
          const items = Array.from(doc.querySelectorAll("item")).slice(0, 4);
          const match = items.find((item) => {
            const title = item.querySelector("title")?.textContent?.trim() ?? "";
            return title && isBreakingStyleHeadline(title);
          });
          if (match) {
            const title =
              match.querySelector("title")?.textContent?.trim() ?? `${ticker} market news`;
            const link =
              match.querySelector("link")?.textContent?.trim() || buildGoogleUrl(ticker, "news");
            const alert = { ticker, title, link, source: getNewsSource(match) };
            setLatestNewsAlert(alert);
            setNewsAlert(alert);
            setNewsStatus("idle");
            return;
          }
        }
        setNewsStatus("quiet");
      } catch {
        setNewsStatus("error");
      }
    },
    [watchlist],
  );

  useEffect(() => {
    if (didInitialNewsCheck.current) return;
    didInitialNewsCheck.current = true;
    void checkBreakingNews();
  }, [checkBreakingNews]);

  // ── Actions ───────────────────────────────────────────────────────────

  const refreshMarket = useCallback(() => {
    setRefreshToken((n) => n + 1);
    const now = new Date();
    setLastUpdated(now);
    setMarketClock(now);
    void loadWeather();
  }, [loadWeather]);

  const addTicker = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const next = normalizeTicker(String(formData.get("ticker") ?? tickerInput));
      if (!next) return;
      setWatchlist((current) => uniqueTickers([next, ...current]));
      setSelectedTicker(next);
      setTickerInput("");
    },
    [tickerInput],
  );

  const removeTicker = useCallback((ticker: string) => {
    setWatchlist((current) => current.filter((t) => t !== ticker));
  }, []);

  const viewShortcut = useCallback((ticker: string) => {
    setWatchlist((current) => uniqueTickers([...current, ticker]));
    setSelectedTicker(ticker);
  }, []);

  const viewMarketIndex = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
  }, []);

  const dismissNewsAlert = useCallback(() => setNewsAlert(null), []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────

  const refreshMarketRef = useRef(refreshMarket);
  refreshMarketRef.current = refreshMarket;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Escape") {
        setNewsAlert(null);
        return;
      }
      if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) {
        refreshMarketRef.current();
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("market-button-ticker")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <main className="market-button">
      <section className="market-button__shell" aria-label="SonnySafe dashboard">
        <header className="market-button__hero">
          <div>
            <p className="market-button__eyebrow">{formattedDate}</p>
            <h1>
              Hello <span className="market-button__name-gradient">Sonny Saifnoorian</span>
            </h1>
            <p className="market-button__subhead">Your private market desk is ready.</p>
          </div>

          <button
            className="market-button__primary"
            type="button"
            onClick={refreshMarket}
            title="Refresh market data (R)"
            data-testid="market-refresh"
          >
            <FaRedo aria-hidden="true" />
            Update Market
          </button>
        </header>

        <div className="market-button__workspace">
          <aside className="market-button__panel market-button__watchlist" aria-label="Watchlist">
            <div className="market-button__panel-heading">
              <div>
                <span>Sonny's Watchlist</span>
                <strong>{watchlist.length} symbols</strong>
              </div>
              <FaChartLine aria-hidden="true" />
            </div>

            <form className="market-button__add-form" onSubmit={addTicker}>
              <label htmlFor="market-button-ticker">Add ticker&nbsp;<kbd>/</kbd></label>
              <div>
                <input
                  id="market-button-ticker"
                  name="ticker"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(normalizeTicker(e.target.value))}
                  placeholder="NVDA"
                  autoComplete="off"
                  inputMode="text"
                  data-testid="ticker-input"
                />
                <button type="submit" aria-label="Add ticker">
                  <FaPlus aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="market-button__ticker-list">
              {watchlist.map((ticker) => (
                <div
                  className={`market-button__ticker${ticker === selectedTicker ? " is-active" : ""}${newsAlert?.ticker === ticker ? " is-flashing" : ""}`}
                  key={ticker}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTicker(ticker)}
                    data-testid={`watchlist-${ticker}`}
                    aria-pressed={ticker === selectedTicker}
                  >
                    <span>{ticker}</span>
                    <small>{ticker === selectedTicker ? "Viewing" : "Select"}</small>
                  </button>
                  <button
                    className="market-button__remove"
                    type="button"
                    onClick={() => removeTicker(ticker)}
                    aria-label={`Remove ${ticker}`}
                    title={`Remove ${ticker}`}
                    disabled={watchlist.length === 1}
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="market-button__quick-indexes" aria-label="Index shortcuts">
              <span>Index pulse</span>
              <div>
                {INDEX_SHORTCUTS.map((ticker) => (
                  <button
                    type="button"
                    key={ticker}
                    onClick={() => viewShortcut(ticker)}
                    title={`View ${ticker}`}
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            </div>

            <div className="market-button__market-indexes" aria-label="Major market indexes">
              <span>Market indexes</span>
              <div>
                {MARKET_INDEXES.map((index) => (
                  <button
                    className={selectedTicker === index.ticker ? "is-active" : ""}
                    type="button"
                    key={index.ticker}
                    onClick={() => viewMarketIndex(index.ticker)}
                    data-testid={`market-index-${index.ticker}`}
                    aria-pressed={selectedTicker === index.ticker}
                    title={index.name}
                  >
                    <strong>{index.label}</strong>
                    <small>{index.name}</small>
                  </button>
                ))}
              </div>
            </div>

            <p className="market-button__kbd-hint" aria-hidden="true">
              <kbd>R</kbd> refresh &nbsp;·&nbsp; <kbd>/</kbd> add ticker &nbsp;·&nbsp; <kbd>Esc</kbd> close
            </p>
          </aside>

          <section
            className="market-button__main"
            aria-label={`${selectedTicker} chart and actions`}
          >
            <div className="market-button__stock-header">
              <div>
                <p>Selected symbol</p>
                <h2>{selectedTicker}</h2>
              </div>
              <div className="market-button__updated">
                <FaClock aria-hidden="true" />
                <span>Last refreshed</span>
                <strong>{formatRefreshedTime(lastUpdated)}</strong>
              </div>
            </div>

            <div className="market-button__session-strip" aria-label="Market session details">
              <div className={`market-button__session-card is-${marketSession.tone}`}>
                <FaFire aria-hidden="true" />
                <div>
                  <span>Session</span>
                  <strong>{marketSession.label}</strong>
                  <small>{marketSession.detail}</small>
                </div>
              </div>
              <div className="market-button__session-card">
                <FaClock aria-hidden="true" />
                <div>
                  <span>New York time</span>
                  <strong>{newYorkTime}</strong>
                  <small>US market clock</small>
                </div>
              </div>
              <div className="market-button__session-card market-button__weather-card">
                <FaCloudSun aria-hidden="true" />
                <div>
                  <span>Fort Lee weather</span>
                  <strong>
                    {weatherStatus === "ready" && weather
                      ? `${weather.current}° ${weather.summary}`
                      : weatherStatus === "error"
                        ? "Unavailable"
                        : "Loading"}
                  </strong>
                  <small>
                    {weatherStatus === "ready" && weather
                      ? `High ${weather.high}° / Low ${weather.low}°`
                      : "Updates with refresh"}
                  </small>
                </div>
              </div>
            </div>

            <div className="market-button__ranges" aria-label="Chart range">
              {RANGE_OPTIONS.map((option) => (
                <button
                  className={option.label === selectedRange.label ? "is-active" : ""}
                  key={option.label}
                  type="button"
                  onClick={() => setSelectedRange(option)}
                  data-testid={`range-${option.label}`}
                  aria-pressed={option.label === selectedRange.label}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="market-button__chart-frame">
              <TradingViewChart
                symbol={tradingViewSymbol}
                range={selectedRange.range}
                interval={selectedRange.interval}
                theme={timeTheme === "night" ? "dark" : "light"}
                refreshToken={refreshToken}
              />
            </div>

            <div className="market-button__actions" aria-label="Market searches">
              {MARKET_ACTIONS.map(({ icon: Icon, label, type }) => (
                <a
                  href={buildGoogleUrl(selectedTicker, type)}
                  target="_blank"
                  rel="noreferrer"
                  key={type}
                  title={`${label} for ${selectedTicker}`}
                  data-testid={`market-action-${type}`}
                >
                  <Icon aria-hidden="true" />
                  {label}
                  <FaExternalLinkAlt aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="market-button__news-scout">
              <div>
                <FaCommentDots aria-hidden="true" />
                <span>Market news scout</span>
                <strong>
                  {newsAlert || latestNewsAlert
                    ? `Headline found for ${(newsAlert ?? latestNewsAlert)?.ticker}`
                    : newsStatus === "checking"
                      ? "Checking watchlist..."
                      : newsStatus === "quiet"
                        ? "No big watchlist headlines found"
                        : newsStatus === "error"
                          ? "News check unavailable"
                          : "Watching for big headlines"}
                </strong>
              </div>
              <div className="market-button__news-actions">
                {latestNewsAlert && !newsAlert ? (
                  <button
                    type="button"
                    onClick={() => setNewsAlert(latestNewsAlert)}
                    data-testid="show-latest-news"
                  >
                    Show latest
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => void checkBreakingNews()}
                  disabled={newsStatus === "checking"}
                  data-testid="check-news"
                >
                  {newsStatus === "checking" ? "Checking" : "Check news"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      {newsAlert ? (
        <div
          className="market-button__comic-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && dismissNewsAlert()}
        >
          <article className="market-button__comic-card">
            <button
              className="market-button__comic-close"
              type="button"
              onClick={dismissNewsAlert}
              aria-label="Close news alert"
              title="Close (Esc)"
            >
              <FaTimes aria-hidden="true" />
            </button>
            <div className="market-button__comic-art" aria-hidden="true">
              <FaBolt />
              <span>{newsAlert.ticker}</span>
            </div>
            <div className="market-button__comic-copy">
              <p>
                <span />
                Market signal
              </p>
              <h3>
                <span>{newsAlert.ticker}</span>
                <small>News on Sonny's watchlist</small>
              </h3>
              <div className="market-button__speech-bubble">
                <strong>{newsAlert.title}</strong>
                <small>{newsAlert.source}</small>
              </div>
              <a href={newsAlert.link} target="_blank" rel="noreferrer">
                Open story
                <FaExternalLinkAlt aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
};

export default MarketButton;
