import { createRouteHandler } from '@/lib/gtg-sgtm-route'

const handleRequest = createRouteHandler({
  upstreamHostname: 'gtm-wrknvs.fps.goog',
})

export const GET = handleRequest
export const POST = handleRequest
export const OPTIONS = handleRequest
