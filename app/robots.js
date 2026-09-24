export default function robots() {
  return {
    rules: { userAgent:"*", allow:"/", disallow:"/api/" },
    sitemap:"https://dontsignthisyet.com/sitemap.xml"
  };
}
