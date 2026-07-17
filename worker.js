export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

   if (url.pathname === "/api" && request.method === "POST") {
      const { messages } = await request.json();

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            messages
          })
        }
      );

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};