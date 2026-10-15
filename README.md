# Proxy GTG + sGTM no Next.js @ Vercel

No Next.js, devemos utilizar [Route Handler](https://nextjs.org/docs/app/getting-started/route-handlers) na implementação do proxy GTG + sGTM.

O Next.js possui a funcionalidade de [proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) (antigo middleware), que é mais simples que o Route Handler, porém não é compatível com a resposta do tipo [HTTP Chunked Transfer Encoding do sGTM](https://stape.io/blog/set-cookie-requests-in-gtm#how-it-works-a-look-under-the-hood) quando usado a query _richsstsse_.

#### Diagrama da arquitetrura:

![arquitetura](<Diagrama GTG + sGTM.png>)

#### Diagrama do fluxo de requisições

Diagrama de sequência simplificado ilustrando a atuação do Next.js como proxy entre o navegador e os serviços de destino (Google Tag Gateway e Server-Side Tag Manager).

```mermaid
sequenceDiagram
    autonumber
    actor Browser
    participant NextProxy as Proxy Next.js (/gtg/ e /sgtm/)
    participant Google as Google Servers (GTG)
    participant sGTM as sGTM (Cloud Run)

    %% Fluxo 1: Scripts GTG
    Note over Browser,Google: 1. Carregamento de scripts de containers (GTM e GTAGs)
    Browser->>NextProxy: GET /gtg/ ou /gtg/<hash>
    NextProxy->>Google: Encaminha requisição (gtm-wrknvs.fps.goog)
    Google-->>NextProxy: Retorna script
    NextProxy-->>Browser: Entrega scripts como recurso 1st party

    %% Fluxo 2: Eventos sGTM
    Note over Browser,sGTM: 2. Envio de Eventos (GA4, W2S, MP, etc)
    Browser->>NextProxy: POST /sgtm/g/collect
    NextProxy->>sGTM: Encaminha evento (Cloud Run)
    sGTM-->>NextProxy: Confirmação + cookies 1st party
    NextProxy-->>Browser: Resposta HTTP de sucesso (200 / 204) <br>+ cookies 1st party
```

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`pnpm create next-app nextjs-vercel --empty`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

For development, run `pnpm dev` and open [http://localhost:3000](http://localhost:3000).

Obs: Dev mode is much different from Prod. In particular, these functions don't work in Dev mode:

- CDN/edge cache
- automatic edge resource compression/decompression
- /gtg/ proxy

So, basically it's not possible to test GTG proxy in Dev mode. It must be tested in production.

## Deploy on Vercel

Install vercel cli: `pnpm add -D vercel`

Link this project folder to a Vercel folder, or create a new Vercel project: `pnpm vercel link`

Publish to production: `pnpm vercel --prod`
