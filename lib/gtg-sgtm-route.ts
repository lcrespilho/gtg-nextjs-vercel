import { geolocation } from '@vercel/functions'

type RouteConfig = {
  upstreamHostname: string // ex: "gtm-wrknvs.fps.goog" ou "gtmss-prod-804453080160.us-central1.run.app"
}

export function createRouteHandler(config: RouteConfig) {
  return async function handleRequest(request: Request) {
    const reqUrl = new URL(request.url)
    const reqUri = reqUrl.pathname + reqUrl.search + reqUrl.hash
    const routeBasePath = `/${reqUrl.pathname.split('/').filter(Boolean)[0]}/` // ex: "/gtg/" ou "/sgtm/"
    const reContainers = new RegExp(`${routeBasePath}(?!healthy)[a-zA-Z0-9-_]*$`) // só dá match com scripts/containers

    const upstreamRequest: Request = buildUpstreamRequest(request, config.upstreamHostname)
    const response = await fetch(upstreamRequest)
    const headers = new Headers(response.headers)

    // O fetch/Runtime já descomprime o body automaticamente. Se o upstream responder com "Content-Encoding"
    // e mantivermos esse header, o browser receberá texto já descomprimido e tentará descomprimir de novo,
    // causando net::ERR_CONTENT_DECODING_FAILED. Também removemos Content-Length para evitar inconsistências
    // entre o payload e os metadados do response final.
    // Nota: em produção, a camada CDN da Vercel compacta novamente o body e inclui o header 'content-encoding' correto.
    headers.delete('content-encoding')
    headers.delete('content-length')

    // Configura as políticas de cache da Vercel para forçar cache. Porém, somente dos containers. Motivo: o Google responde com
    // "cache-control: private, max-age=900", proibindo cache na CDN. Porém, não há problema em realizar esse cache.
    // As demais rotas (saúde, eventos, SW, iframe-SW e telemetria) já possuem os headers de cache corretos.
    if (reContainers.test(reqUri)) {
      headers.set('cache-control', 'public, max-age=900')
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * Constrói a requisição upstream reescrevendo o hostname de destino e enriquecendo-a
 * com os cabeçalhos de geolocalização (`X-Forwarded-*` / `X-Gclb-*`) providos pela Vercel.
 *
 * @param {Request} request - Requisição original
 */
function buildUpstreamRequest(request: Request, upstreamHostname: string) {
  const requestUrl = new URL(request.url)

  // Reescreve o hostname para o do upstream de destino
  requestUrl.hostname = upstreamHostname
  requestUrl.protocol = 'https:'
  requestUrl.port = ''

  const newRequest = new Request(requestUrl, request)

  const { country, latitude, longitude, city, countryRegion } = geolocation(request)
  if (country) {
    newRequest.headers.set('X-Forwarded-Country', country) // ex: "BR"
    newRequest.headers.set('X-Gclb-Country', country) // ex: "BR"
  }
  if (countryRegion) {
    newRequest.headers.set('X-Forwarded-Region', countryRegion) // ex: "SP"
    newRequest.headers.set('X-Gclb-Region', `${country}${countryRegion}`) // ex: "BRSP"
  }
  if (latitude && longitude && city) {
    newRequest.headers.set('X-Forwarded-Geolocation', `latlong=${latitude},${longitude};city=${city}`) // ex: "latlong=111,222;city=Cotia"
  }

  return newRequest
}
