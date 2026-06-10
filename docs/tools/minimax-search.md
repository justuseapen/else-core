---
<<<<<<< HEAD
summary: "MiniMax Search via the Coding Plan search API"
read_when:
  - You want to use MiniMax for web_search
  - You need a MiniMax Coding Plan key
  - You want MiniMax CN/global search host guidance
title: "MiniMax Search"
---

# MiniMax Search

OpenClaw supports MiniMax as a `web_search` provider through the MiniMax
Coding Plan search API. It returns structured search results with titles, URLs,
snippets, and related queries.

## Get a Coding Plan key

<Steps>
  <Step title="Create a key">
    Create or copy a MiniMax Coding Plan key from
    [MiniMax Platform](https://platform.minimax.io/user-center/basic-information/interface-key).
=======
summary: "MiniMax Search via the Token Plan search API"
read_when:
  - You want to use MiniMax for web_search
  - You need a MiniMax Token Plan key or OAuth token
  - You want MiniMax CN/global search host guidance
title: "MiniMax search"
---

OpenClaw supports MiniMax as a `web_search` provider through the MiniMax
Token Plan search API. It returns structured search results with titles, URLs,
snippets, and related queries.

## Get a Token Plan credential

<Steps>
  <Step title="Create a key">
    Create or copy a MiniMax Token Plan key from
    [MiniMax Platform](https://platform.minimax.io/user-center/basic-information/interface-key).
    OAuth setups can reuse `MINIMAX_OAUTH_TOKEN` instead.
>>>>>>> upstream/main
  </Step>
  <Step title="Store the key">
    Set `MINIMAX_CODE_PLAN_KEY` in the Gateway environment, or configure via:

    ```bash
    openclaw configure --section web
    ```

  </Step>
</Steps>

<<<<<<< HEAD
OpenClaw also accepts `MINIMAX_CODING_API_KEY` as an env alias. `MINIMAX_API_KEY`
is still read as a compatibility fallback when it already points at a coding-plan token.
=======
OpenClaw also accepts `MINIMAX_CODING_API_KEY`, `MINIMAX_OAUTH_TOKEN`, and
`MINIMAX_API_KEY` as env aliases. `MINIMAX_API_KEY` should point at a
search-enabled Token Plan credential; ordinary MiniMax model API keys may not
be accepted by the Token Plan search endpoint.
>>>>>>> upstream/main

## Config

```json5
{
  plugins: {
    entries: {
      minimax: {
        config: {
          webSearch: {
<<<<<<< HEAD
            apiKey: "sk-cp-...", // optional if MINIMAX_CODE_PLAN_KEY is set
=======
            apiKey: "sk-cp-...", // optional if a MiniMax Token Plan env var is set
>>>>>>> upstream/main
            region: "global", // or "cn"
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "minimax",
      },
    },
  },
}
```

<<<<<<< HEAD
**Environment alternative:** set `MINIMAX_CODE_PLAN_KEY` in the Gateway environment.
=======
**Environment alternative:** set `MINIMAX_CODE_PLAN_KEY`, `MINIMAX_CODING_API_KEY`,
`MINIMAX_OAUTH_TOKEN`, or `MINIMAX_API_KEY` in the Gateway environment.
>>>>>>> upstream/main
For a gateway install, put it in `~/.openclaw/.env`.

## Region selection

MiniMax Search uses these endpoints:

- Global: `https://api.minimax.io/v1/coding_plan/search`
- CN: `https://api.minimaxi.com/v1/coding_plan/search`

If `plugins.entries.minimax.config.webSearch.region` is unset, OpenClaw resolves
the region in this order:

1. `tools.web.search.minimax.region` / plugin-owned `webSearch.region`
2. `MINIMAX_API_HOST`
3. `models.providers.minimax.baseUrl`
4. `models.providers.minimax-portal.baseUrl`

That means CN onboarding or `MINIMAX_API_HOST=https://api.minimaxi.com/...`
automatically keeps MiniMax Search on the CN host too.

Even when you authenticated MiniMax through the OAuth `minimax-portal` path,
web search still registers as provider id `minimax`; the OAuth provider base URL
<<<<<<< HEAD
is only used as a region hint for CN/global host selection.

## Supported parameters

MiniMax Search supports:

- `query`
- `count` (OpenClaw trims the returned result list to the requested count)
=======
is used as a region hint for CN/global host selection, and `MINIMAX_OAUTH_TOKEN`
can satisfy the MiniMax Search bearer credential.

## Supported parameters

| Parameter | Type    | Constraints | Description                                                                 |
| --------- | ------- | ----------- | --------------------------------------------------------------------------- |
| `query`   | string  | required    | Search query string.                                                        |
| `count`   | integer | 1-10        | Number of results to return. OpenClaw trims the returned list to this size. |
>>>>>>> upstream/main

Provider-specific filters are not currently supported.

## Related

- [Web Search overview](/tools/web) -- all providers and auto-detection
- [MiniMax](/providers/minimax) -- model, image, speech, and auth setup
