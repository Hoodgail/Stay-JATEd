import { warmStrategyCache } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";

// Precache all the things!
precacheAndRoute(self.__WB_MANIFEST);

// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
const pageCache = new CacheFirst({
    cacheName: "page-cache",
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
    ],
});

warmStrategyCache({
    urls: ["/index.html", "/"],
    strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Register route for caching images
// The cache first strategy is often the best choice for images because it saves bandwidth and improves performance.
registerRoute(
    ({ request }) => ["style", "script", "worker"].includes(request.destination),
    new StaleWhileRevalidate({
        // Name of the cache storage.
        cacheName: "my-src-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, //30 Days
            }),
        ],
    })
);
