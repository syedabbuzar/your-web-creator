const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ya specific domain
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true", // ⭐ IMPORTANT
};

const BACKEND_BASE_URL = "https://scholar-backen.vercel.app/api";

Deno.serve(async (req) => {
  // ✅ FIX 1: Proper preflight response
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // ⭐ important
      headers: corsHeaders,
    });
  }

  try {
    const reqUrl = new URL(req.url);
    const requestedPath = reqUrl.searchParams.get("path") || "/";

    if (!requestedPath.startsWith("/") || requestedPath.includes("://")) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid proxy path" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const upstreamUrl = `${BACKEND_BASE_URL}${requestedPath}`;
    const method = req.method.toUpperCase();

    const headers = new Headers();

    // ✅ FIX 2: Forward all headers properly
    req.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    const body =
      ["GET", "HEAD"].includes(method) ? undefined : await req.text();

    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });

    const responseText = await upstreamResponse.text();

    const responseHeaders = new Headers(corsHeaders);

    // ✅ FIX 3: Preserve content-type
    const upstreamContentType =
      upstreamResponse.headers.get("content-type") || "application/json";

    responseHeaders.set("Content-Type", upstreamContentType);

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Proxy request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});