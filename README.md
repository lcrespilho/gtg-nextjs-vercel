# Proxy GTG + sGTM no Next.js @ Vercel

No Next.js, devemos utilizar [Route Handler]https://nextjs.org/docs/app/getting-started/route-handlers) na implementação do proxy GTG + sGTM.

O Next.js possui a funcionalidade de [proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) (antigo middleware), que é mais simples que o Route Handler, porém não é compatível com a resposta do tipo [HTTP Chunked Transfer Encoding do sGTM](https://stape.io/blog/set-cookie-requests-in-gtm#how-it-works-a-look-under-the-hood) quando usado a query _richsstsse_.

Diagrama da arquitetrura:

![arquitetura](<Diagrama GTG + sGTM.png>)



## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`pnpm create next-app nextjs-vercel --empty`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

First, install vercel cli: `pnpm add -D vercel`

Next, if it is Friday, publish to test in production: `pnpm vercel --prod`
