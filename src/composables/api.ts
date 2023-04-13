import { ref } from "vue";
import type { ProfileHeader, LinkObject } from "@/types";

// const linkHeader = `<https://www.w3.org/TR/vocab-dcat/>; rel="profile", <http://www.w3.org/ns/dx/prof/Profile>; rel="type"; token="mem"; anchor=<https://w3id.org/profile/mem>, <http://www.w3.org/ns/dx/prof/Profile>; rel="type"; token="dcat"; anchor=<https://www.w3.org/TR/vocab-dcat/>, <https://kurrawong.net/prez/DatasetList?_profile=dcat&_mediatype=text/html>; rel="self"; type="text/html"; profile="https://www.w3.org/TR/vocab-dcat/", <https://kurrawong.net/prez/DatasetList?_profile=dcat&_mediatype=text/turtle>; rel="alternate"; type="text/turtle"; profile="https://www.w3.org/TR/vocab-dcat/", <https://kurrawong.net/prez/DatasetList?_profile=dcat&_mediatype=application/rdf+xml>; rel="alternate"; type="application/rdf+xml"; profile="https://www.w3.org/TR/vocab-dcat/", <https://kurrawong.net/prez/DatasetList?_profile=dcat&_mediatype=application/ld+json>; rel="alternate"; type="application/ld+json"; profile="https://www.w3.org/TR/vocab-dcat/", <https://kurrawong.net/prez/DatasetList?_profile=mem&_mediatype=text/html>; rel="alternate"; type="text/html"; profile="https://w3id.org/profile/mem", <https://kurrawong.net/prez/DatasetList?_profile=mem&_mediatype=application/ld+json>; rel="alternate"; type="application/ld+json"; profile="https://w3id.org/profile/mem", <https://kurrawong.net/prez/DatasetList?_profile=mem&_mediatype=application/rdf+xml>; rel="alternate"; type="application/rdf+xml"; profile="https://w3id.org/profile/mem", <https://kurrawong.net/prez/DatasetList?_profile=mem&_mediatype=text/turtle>; rel="alternate"; type="text/turtle"; profile="https://w3id.org/profile/mem", <https://kurrawong.net/prez/DatasetList?_profile=mem&_mediatype=application/json>; rel="alternate"; type="application/json"; profile="https://w3id.org/profile/mem"`;

export function useGetRequest() {
    const data = ref("");
    const loading = ref(false);
    const error = ref("");
    const profiles = ref<ProfileHeader[]>([]);

    function parseLinkHeader(link: string): LinkObject {
        const [, uriRef, attrs] = link.match(/<(.+)>; (.+)/)!;
        let linkObj: Partial<LinkObject> = { uriRef };

        attrs.split("; ").forEach(l => {
            const [, lhs, rhs] = l.match(/(.+)=[\"<](.+)[\">]/) as [string, keyof Omit<LinkObject, "uriRef">, string];
            linkObj[lhs] = rhs;
        });

        return linkObj as LinkObject;
    }

    function getProfilesFromHeaders(link: string): ProfileHeader[] {
        let profileObj: {[uri: string]: ProfileHeader} = {} ;

        const links = link.split(", ").map(l => parseLinkHeader(l));

        links.filter(l => l.rel === "type").forEach(l => {
            profileObj[l.anchor] = {
                default: false,
                token: l.token,
                mediatypes: [],
                title: l.title,
                description: "",
                uri: l.anchor
            };
        });

        const defaultProfile = links.find(l => l.rel === "self")!;
        profileObj[defaultProfile.profile].default = true;

        links.filter(l => l.rel === "alternate").forEach(l => {
            if (!profileObj[l.profile].mediatypes.map(m => m.mediatype).includes(l.type)) {
                profileObj[l.profile].mediatypes.push({ title: "", mediatype: l.type, default: false });
            }
        });

        // need to sort mediatypes by default first - need to use ui.profiles

        return Object.values(profileObj);
    }

    function doRequest(url: string, callback = () => {}, errorCallback = () => {}) {
        loading.value = true;

        fetch(url)
        .then(r => {
            // console.log("got response")
            // console.log("response", r)
            if (!r.ok) {
                // console.log("not ok", r)
                // console.log(r.status)
                // console.log(r.statusText)
                // console.log(r.text())
                // throw new Error(`Response was not OK: status ${r.status}`);
                return Promise.reject(r); // returns a Response object to catch() to access status, etc.
            }
            profiles.value = r.headers.get("link") ? getProfilesFromHeaders(r.headers.get("link")!) : [];
            return r.text();
        })
        .then(text => {
            data.value = text;
            callback();
        })
        .catch(e => {
            // console.log("error", e)
            if (e instanceof TypeError) { // generic JS network error
                // console.log("generic error")
                // console.log("message", e.message)
                error.value = e.message;
            } else if (e instanceof Response) {
                // console.log("response error")
                // console.log("status", e.status)
                error.value = e.statusText;
            }
            
            errorCallback();
        })
        .finally(() => {
            loading.value = false;
        });
    }

    return { data, profiles, loading, error, doRequest };
};