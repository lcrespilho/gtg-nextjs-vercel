export async function GET(request: Request, ctx: RouteContext<'/gtg/[[...slug]]'>) {
  const upstreamRequest: Request = buildUpstreamRequest(request)
  const response = await fetch(upstreamRequest)
  const headers = new Headers(response.headers)

  // O fetch/Runtime já descomprime o body automaticamente. Se o upstream responder com "Content-Encoding"
  // e mantivermos esse header, o browser receberá texto já descomprimido e tentará descomprimir de novo,
  // causando net::ERR_CONTENT_DECODING_FAILED. Também removemos Content-Length para evitar inconsistências
  // entre o payload e os metadados do response final.
  // Nota: em produção, a camada CDN da Vercel compacta novamente o body e inclui o header 'content-encoding' correto.
  headers.delete('content-encoding')
  headers.delete('content-length')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: { ...headers, 'cache-control': 'public, max-age=30' },
  })
}

function buildUpstreamRequest(request: Request) {
  const requestUrl = new URL(request.url)
  if (requestUrl.href.endsWith('/gtg')) {
    requestUrl.href += '/'
  }
  requestUrl.hostname = 'gtm-wrknvs.fps.goog'
  requestUrl.protocol = 'https:'
  requestUrl.port = ''
  const newRequest = new Request(requestUrl, request)
  return newRequest
}
