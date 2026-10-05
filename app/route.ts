import documentHtml from "../lib/document";
export function GET(){return new Response(documentHtml,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache"}})}
