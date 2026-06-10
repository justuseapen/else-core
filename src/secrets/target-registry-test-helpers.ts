<<<<<<< HEAD
=======
/**
 * Canonicalize legacy coverage IDs to current registry IDs so historical tests
 * can compare the same target surface after web tools moved under plugins.
 */
>>>>>>> upstream/main
export function canonicalizeSecretTargetCoverageId(id: string): string {
  if (id === "tools.web.x_search.apiKey") {
    return "plugins.entries.xai.config.webSearch.apiKey";
  }
<<<<<<< HEAD
=======
  if (id === "tools.web.fetch.firecrawl.apiKey") {
    return "plugins.entries.firecrawl.config.webFetch.apiKey";
  }
>>>>>>> upstream/main
  return id;
}
