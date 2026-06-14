import Script from "next/script";
import { Suspense } from "react";

import { YandexMetrikaTracker } from "@/components/analytics/yandex-metrika-tracker";

const DEFAULT_COUNTER_ID = 109849077;

function getCounterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YM_COUNTER_ID?.trim() || String(DEFAULT_COUNTER_ID);
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function YandexMetrika() {
  const counterId = getCounterId();
  if (!counterId) return null;

  const tagSrc = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;

  return (
    <>
      <Script id="yandex-metrika" strategy="beforeInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "${tagSrc}", "ym");

          ym(${counterId}, "init", {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <YandexMetrikaTracker counterId={counterId} />
      </Suspense>
    </>
  );
}
