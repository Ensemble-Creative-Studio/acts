import type { APIRoute } from "astro";

export const prerender = false;

type RevalidateWebhookBody = {
  tags?: string[];
  type?: string;
  slug?: string;
  _id?: string;
};

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function isAuthorized(request: Request) {
  const secret = import.meta.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          message:
            "La variable SANITY_REVALIDATE_SECRET est manquante sur le projet.",
        },
        500,
      ),
    };
  }

  const url = new URL(request.url);
  const providedSecret =
    url.searchParams.get("secret") ?? request.headers.get("x-webhook-secret");

  if (providedSecret !== secret) {
    return {
      ok: false,
      response: json({ ok: false, message: "Unauthorized" }, 401),
    };
  }

  return { ok: true as const };
}

export const POST: APIRoute = async ({ request }) => {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: RevalidateWebhookBody = {};

  try {
    body = (await request.json()) as RevalidateWebhookBody;
  } catch {
    body = {};
  }

  const tags = body.tags?.filter(Boolean) ?? [];

  return json({
    ok: true,
    message:
      "Webhook recu. Le site est servi en SSR, donc le prochain hit relira Sanity sans rebuild.",
    revalidatedAt: new Date().toISOString(),
    documentId: body._id ?? null,
    documentType: body.type ?? null,
    slug: body.slug ?? null,
    tags,
  });
};

export const GET: APIRoute = async ({ request }) => {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return auth.response;
  }

  return json({
    ok: true,
    message: "Route de revalidation disponible.",
  });
};
