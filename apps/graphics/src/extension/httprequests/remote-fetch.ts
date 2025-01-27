import {NodeCG} from "nodecg-types/types/server";


export const create = (nodecg: NodeCG): void => {
    const router = nodecg.Router();

    router.get("/", (req, res) => {
        res.status(200).send("OK from remote-fetch! Please use a version endpoint.");

    })

    /**
     * Version 1 of the remote fetch client.
     *
     * The target url should be encoded with `encodeURIComponent()` and placed into the parameter `?url=`.
     *
     * Example: `/glimpse-graphics-fetch/v1?url=https://example.com`
     *
     * Optional path format can be specified to choose a specific header response:
     *
     * Example for json header: `/glimpse-graphics-fetch/v1/json?url=https://example.com`
     *
     */
    const v1_routes = [
        "/v1",
        "/v1/:format"
    ]

    router.get(v1_routes, (req, res) => {
        // ensures ?url= is present
        if (!(req.query && req.query.url)) {
            res.status(400).send("Missing target URL query parameter.")
            return;
        }

        // checks if user requested a specific MIME type
        let mimeFollow = false
        let mimeType = "text/pain"
        if (req.params.format) {
            switch (req.params.format) {
                case "json":
                    mimeType = "application/json"
                    break
                case "xml":
                    mimeType = "text/xml"
                    break
                case "js":
                case "javascript":
                    mimeType = "text/javascript"
                    break
                case "htm":
                case "html":
                    mimeType = "text/html"
                    break
                case "follow":
                    mimeFollow = true
                    break
                default:
                case "text":
                case "txt":
                    mimeType = "text/pain"
            }
        }

        // fetches the url from the server and send it back to the client
        try {
            const url = req.query.url
            const targetURL = decodeURIComponent((Array.isArray(url) ? url[0] : url).toString())
            let targetMime = mimeType

            fetch(targetURL)
                .then(targetRes => {
                    if (mimeFollow) {
                        targetMime = targetRes.headers.get("Content-Type") || mimeType
                    }
                    return targetRes.text()
                })
                .then(data => res.status(200).set("Content-Type", targetMime).send(data))
                .catch(err => {
                    console.log(err)
                    res.status(500).send("fetch failed: " + err);
                })
        } catch (e) {
            console.error(e);
            res.status(500).send("server error: " + e);
        }
    })

    nodecg.mount("/glimpse-graphics-fetch", router);
}
