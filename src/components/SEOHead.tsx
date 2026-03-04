import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
}

const BASE_TITLE = "Scholar Educational Campus Nanded";
const BASE_URL = "https://scholareducationalcampus.com";

const SEOHead = ({ title, description, keywords, path = "/" }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} | Best School in Nanded | Nursery to 12th`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }
    if (keywords) setMeta("keywords", keywords);
    
    setMeta("og:title", fullTitle, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("og:url", `${BASE_URL}${path}`, "property");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${BASE_URL}${path}`);
  }, [title, description, keywords, path]);

  return null;
};

export default SEOHead;
