export default function robots() {
  return {
    rules: { userAgent:"*", allow:"/", disallow:"/api/" },
    sitemap:"https://www.dontsignthisyet.com/sitemap.xml"
  };
}
