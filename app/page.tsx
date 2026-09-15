'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const didRun = useRef(false)

  useEffect(() => {
    // Evita que rode 2x em dev.
    if (didRun.current) return
    didRun.current = true

    const routes = [
      { name: '/gtg/healthy', url: '/gtg/healthy' },
      { name: '/gtg/?validate_geo=healthy', url: '/gtg/?validate_geo=healthy' },
      { name: '/sgtm/healthy', url: '/sgtm/healthy' },
    ]

    const container = document.getElementById('statusContainer')
    if (!container) return

    async function checkRoute(route: { name: string; url: string }) {
      const box = document.createElement('div')
      box.className = 'status-box loading'
      box.id = `route-${routes.indexOf(route)}`

      box.innerHTML = `
        <div class="route-name">
          <span class="status-indicator loading"></span>${route.name}
        </div>
        <div class="status-text">Verificando...</div>
      `

      container!.appendChild(box)

      try {
        const response = await fetch(route.url, { cache: 'no-store' })
        const isHealthy = response.ok && response.status === 200
        const statusClass = isHealthy ? 'healthy' : 'unhealthy'
        const statusText = isHealthy ? 'OK' : `Erro ${response.status}`

        box.className = `status-box ${statusClass}`
        box.innerHTML = `
          <div class="route-name">
            <span class="status-indicator ${statusClass}"></span>${route.name}
          </div>
          <div class="status-text ${statusClass}">${statusText}</div>
        `
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido'
        box.className = 'status-box unhealthy'
        box.innerHTML = `
          <div class="route-name">
            <span class="status-indicator unhealthy"></span>${route.name}
          </div>
          <div class="status-text unhealthy">Erro: ${message}</div>
        `
      }
    }

    // Verificar rotas ao carregar
    routes.forEach(route => checkRoute(route))
  }, [])

  useEffect(() => {
    const entrypointLink = document.querySelector('#entrypointlink')
    entrypointLink?.setAttribute(
      'href',
      `${location.origin}/?server_container_url=${location.origin}/sgtm&disable_media`,
    )
  }, [])

  return (
    <>
      <h3>Next.js GTG + sGTM @ Vercel</h3>
      <a id="entrypointlink">Entrar por esse link</a>
      <br />
      <br />
      <br />
      <div className="status-container" id="statusContainer" />
    </>
  )
}
