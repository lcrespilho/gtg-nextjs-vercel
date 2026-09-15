import { createRouteHandler } from '@/lib/gtg-sgtm-route'

const handleRequest = createRouteHandler({
  upstreamHostname: 'gtmss-prod-804453080160.us-central1.run.app',
})

export const GET = handleRequest
export const POST = handleRequest
export const OPTIONS = handleRequest
