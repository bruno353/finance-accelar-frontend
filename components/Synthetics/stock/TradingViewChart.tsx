/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-new */
import React, { useEffect, useRef, memo } from 'react'
// import './tradingview-custom.css'; // Importa o arquivo de estilo

interface TradingViewChartProps {
  symbol: string
}

function TradingViewChart({ symbol }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const widgetOptions = {
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      toolbar_bg: '#f1f3f6',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      calendar: false,
      hide_side_toolbar: false,
      show_popup_button: true,
      withdateranges: true,
      support_host: 'https://www.tradingview.com',
    }

    if (
      container.current &&
      !container.current.querySelector('.tradingview-widget-script')
    ) {
      const script = document.createElement('script')
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = JSON.stringify(widgetOptions)
      script.classList.add('tradingview-widget-script')
      container.current.appendChild(script)
    } else if (container.current) {
      // Se o script já existe, atualize apenas o símbolo
      const existingWidget = container.current.querySelector(
        '.tradingview-widget-container__widget',
      )
      if (existingWidget) {
        // @ts-ignore
        existingWidget.innerHTML = ''
        // @ts-ignore
        new window.TradingView.widget(widgetOptions)
      }
    }
  }, [symbol])

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

export default TradingViewChart
