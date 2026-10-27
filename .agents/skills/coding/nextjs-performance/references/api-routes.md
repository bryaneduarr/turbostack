# Route Handlers Ottimizzati

## Overview

Route handlers in `app/` directory per API endpoints con supporto streaming e edge runtime.

These are conceptual fragments, not complete application handlers. Helpers such as `db`, `fetchData`, and `checkRateLimit` are integration placeholders, not bundled local resources. Mandatory repository rules still require concrete schema-package contracts, request and response validation, server-side authorization, direct alias imports, and canonical HTTP status constants before adapting these patterns. Route groups, caching, and proxy checks do not replace authorization inside handlers.

---

## Pattern Base

### GET Handler

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}
```

### POST Handler

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { CREATED, INTERNAL_SERVER_ERROR } from '@workspace/utils/http/status-codes/http-status-code.constant'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const user = await db.user.create({
      data: body,
    })

    return NextResponse.json(user, { status: CREATED })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}
```

---

## Edge Runtime

```typescript
// app/api/edge/route.ts
export const runtime = 'edge'
export const preferredRegion = 'iad1' // US East

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Edge runtime: minore cold start, distribuito globalmente
  const result = await fetch(`https://api.example.com/search?q=${query}`)

  return new Response(await result.text(), {
    headers: { 'content-type': 'application/json' },
  })
}
```

---

## Streaming Response

```typescript
// app/api/stream/route.ts
export const runtime = 'edge'

export async function POST(request: Request) {
  const { prompt } = await request.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  })

  // Stream la response direttamente
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

---

## Caching Headers

```typescript
// app/api/data/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await fetchData()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
```

Alternativa con ETag:

```typescript
// app/api/data/route.ts
import { NextResponse } from 'next/server'
import { NOT_MODIFIED } from '@workspace/utils/http/status-codes/http-status-code.constant'

export async function GET(request: Request) {
  const data = await fetchData()
  const etag = generateETag(data)

  // Check If-None-Match
  if (request.headers.get('If-None-Match') === etag) {
    return new Response(null, { status: NOT_MODIFIED })
  }

  return NextResponse.json(data, {
    headers: {
      ETag: etag,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

---

## Proxy (Next.js 16)

Next.js 16 usa `proxy.ts` e la funzione `proxy`. Il limiter deve ricavare l'identità da metadati attendibili del deployment o dall'autenticazione; `NextRequest.ip` non è disponibile e gli header inoltrati dal client non sono attendibili senza una configurazione proxy verificata.

```typescript
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOO_MANY_REQUESTS } from '@workspace/utils/http/status-codes/http-status-code.constant'

export async function proxy(request: NextRequest) {
  // CORS headers
  const response = NextResponse.next()

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  const limit = await checkRateLimit(request)

  if (!limit.success) {
    return new NextResponse('Rate limit exceeded', { status: TOO_MANY_REQUESTS })
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## Error Handling

```typescript
// src/services/http/error-handling/api-error.handler.ts
import { NextResponse } from 'next/server'
import { INTERNAL_SERVER_ERROR } from '@workspace/utils/http/status-codes/http-status-code.constant'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = INTERNAL_SERVER_ERROR,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
  }
}

export function handleError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  console.error(error)
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: INTERNAL_SERVER_ERROR }
  )
}
```

Uso in un Route Handler, adattando l'alias al modulo effettivo:

```typescript
// app/api/data/route.ts
import { NextResponse } from 'next/server'
import { APIError, handleError } from '@/services/http/error-handling/api-error.handler'
import { NOT_FOUND } from '@workspace/utils/http/status-codes/http-status-code.constant'

export async function GET() {
  try {
    const data = await fetchData()
    if (!data) {
      throw new APIError('Not found', NOT_FOUND, 'NOT_FOUND')
    }
    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}
```

---

## Route Groups

```typescript
// app/api/(public)/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: Date.now() })
}
```

```typescript
// app/api/(private)/admin/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Autorizzare esplicitamente prima di restituire dati sensibili.
  return NextResponse.json({ data: 'sensitive' })
}
```
