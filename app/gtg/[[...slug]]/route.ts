export async function GET(request: Request, ctx: RouteContext<'/gtg/[[...slug]]'>) {
  const upstreamRequest: Request = buildUpstreamRequest(request)
  const response = await fetch(upstreamRequest)
  const headers = new Headers(response.headers)
  // headers.delete('content-encoding')
  // headers.delete('content-length')
  // console.log('>>> response headers sent to browser', JSON.stringify(Object.fromEntries(headers.entries()), null, 2))
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
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
  // console.log('>>> browser request headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))
  return newRequest
}
