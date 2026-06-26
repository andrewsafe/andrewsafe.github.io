import { useEffect, useRef } from "react";
import AnimatedSection from "../animated-section/AnimatedSection";
import "./market-pulse.css";

const TICKER_TAPE_CONFIG = {
  symbols: [
    { proName: "NASDAQ:NVDA", title: "NVIDIA" },
    { proName: "NASDAQ:AAPL", title: "Apple" },
    { proName: "NASDAQ:TSLA", title: "Tesla" },
    { proName: "NASDAQ:MSFT", title: "Microsoft" },
    { proName: "NASDAQ:GOOGL", title: "Google" },
    { proName: "NASDAQ:META", title: "Meta" },
    { proName: "NASDAQ:AMZN", title: "Amazon" },
    { proName: "NASDAQ:AMD", title: "AMD" },
    { proName: "NASDAQ:PLTR", title: "Palantir" },
    { proName: "NYSE:SOFI", title: "SoFi" },
    { proName: "NYSE:TWLO", title: "Twilio" },
    { proName: "NYSE:SCHD", title: "SCHD" },
    { proName: "AMEX:SPY", title: "S&P 500 ETF" },
    { proName: "NASDAQ:QQQ", title: "NASDAQ ETF" },
    { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
  ],
  showSymbolLogo: true,
  isTransparent: true,
  displayMode: "adaptive",
  colorTheme: "dark",
  locale: "en",
};

const MARKET_OVERVIEW_CONFIG = {
  colorTheme: "dark",
  dateRange: "1D",
  showChart: true,
  locale: "en",
  largeChartUrl: "",
  isTransparent: true,
  showSymbolLogo: true,
  showFloatingTooltip: false,
  width: "100%",
  height: "400",
  plotLineColorGrowing: "rgba(41, 98, 255, 1.0)",
  plotLineColorFalling: "rgba(41, 98, 255, 1.0)",
  gridLineColor: "rgba(42, 46, 57, 0)",
  scaleFontColor: "rgba(209, 212, 220, 1.0)",
  belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
  belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
  belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
  belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
  symbolActiveColor: "rgba(41, 98, 255, 0.12)",
  tabs: [
    {
      title: "Watchlist",
      symbols: [
        { s: "NASDAQ:NVDA", d: "NVIDIA" },
        { s: "NASDAQ:AAPL", d: "Apple" },
        { s: "NASDAQ:TSLA", d: "Tesla" },
        { s: "NASDAQ:MSFT", d: "Microsoft" },
        { s: "NASDAQ:META", d: "Meta" },
        { s: "NASDAQ:AMD", d: "AMD" },
        { s: "NASDAQ:PLTR", d: "Palantir" },
        { s: "NYSE:SOFI", d: "SoFi" },
        { s: "NYSE:TWLO", d: "Twilio" },
      ],
      originalTitle: "Watchlist",
    },
    {
      title: "Indices",
      symbols: [
        { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
        { s: "FOREXCOM:NSXUSD", d: "NASDAQ 100" },
        { s: "FOREXCOM:DJI", d: "Dow Jones" },
        { s: "INDEX:VIX", d: "VIX" },
      ],
      originalTitle: "Indices",
    },
    {
      title: "Crypto",
      symbols: [
        { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
        { s: "BINANCE:ETHUSDT", d: "Ethereum" },
      ],
      originalTitle: "Crypto",
    },
  ],
};

const TradingViewWidget = ({
  src,
  config,
  containerClass,
  widgetClass,
}: {
  src: string;
  config: object;
  containerClass?: string;
  widgetClass?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify(config);

    container.appendChild(script);

    return () => {
      if (container.contains(script)) {
        container.removeChild(script);
      }
      const iframes = container.querySelectorAll("iframe");
      iframes.forEach((f) => f.remove());
    };
  }, [src, config]);

  return (
    <div ref={containerRef} className={`tradingview-widget-container ${containerClass ?? ""}`}>
      <div className={`tradingview-widget-container__widget ${widgetClass ?? ""}`} />
    </div>
  );
};

const MarketPulse = () => {
  return (
    <section id="market-pulse">
      <div className="market-pulse__tape">
        <TradingViewWidget
          src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
          config={TICKER_TAPE_CONFIG}
        />
      </div>

      <div className="container">
        <AnimatedSection>
          <div className="market-pulse__header">
            <h2>Market Pulse</h2>
            <p className="text-light">Live watchlist — prices update in real time</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="market-pulse__overview-card">
            <TradingViewWidget
              src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
              config={MARKET_OVERVIEW_CONFIG}
              widgetClass="market-pulse__overview-widget"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default MarketPulse;
