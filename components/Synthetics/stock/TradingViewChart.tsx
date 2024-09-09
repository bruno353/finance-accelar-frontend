import React, { useEffect, useRef, memo } from 'react'
// import './tradingview-custom.css'; // Importa o arquivo de estilo

function TradingViewChart() {
  const container = useRef()

  useEffect(() => {
    // Verificar se o script já existe
    if (!document.querySelector('.tradingview-widget-script')) {
      const script = document.createElement('script')
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "toolbar_bg": "#f1f3f6",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "hide_side_toolbar": false,
          "show_popup_button": true,
          "withdateranges": true,
          "allow_symbol_change": false,
          "support_host": "https://www.tradingview.com"
        }`
      script.classList.add('tradingview-widget-script')
      container?.current?.appendChild(script)
    }
  }, [])

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{
          height: 'calc(100% - 32px)',
          width: '100%',
        }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
}

export default memo(TradingViewChart)
