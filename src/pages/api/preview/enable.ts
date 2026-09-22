import type { APIRoute } from "astro";

export const prerender = false;

function isSafeRedirectPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const secret = import.meta.env.PUBLIC_SANITY_PREVIEW_SECRET;

  if (!secret) {
    return new Response(
      "La variable PUBLIC_SANITY_PREVIEW_SECRET est manquante sur le projet.",
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const providedSecret = url.searchParams.get("secret");

  if (providedSecret !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const redirectParam = url.searchParams.get("redirect") ?? "/";
  const destination = isSafeRedirectPath(redirectParam) ? redirectParam : "/";

  cookies.set("sanity-preview", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return redirect(destination);
};
