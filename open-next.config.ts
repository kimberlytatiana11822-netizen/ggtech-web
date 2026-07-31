// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	// R2 incremental cache so ISR (revalidate) persists across requests/deploys.
	// Requires an R2 bucket bound as NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc.
	// If the binding/bucket is missing it degrades gracefully to no caching.
	incrementalCache: r2IncrementalCache
});
