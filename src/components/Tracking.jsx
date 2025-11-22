import { useEffect } from 'react';
import { Helmet } from 'react-helmet'; // A library to manage document head

// IMPORTANT: Install react-helmet by running: npm install react-helmet

const FACEBOOK_PIXEL_ID = process.env.VITE_FACEBOOK_PIXEL_ID || 'YOUR_FB_PIXEL_ID';
const GA4_MEASUREMENT_ID = process.env.VITE_GA4_MEASUREMENT_ID || 'YOUR_GA4_ID';

const Tracking = () => {
  useEffect(() => {
    // Only run tracking scripts in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Facebook Pixel
    if (FACEBOOK_PIXEL_ID && !FACEBOOK_PIXEL_ID.includes('YOUR_')) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', FACEBOOK_PIXEL_ID);
      fbq('track', 'PageView');
    }
  }, []);

  // GA4 uses Helmet to inject the script tags into the head
  if (process.env.NODE_ENV !== 'production' || !GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID.includes('YOUR_')) {
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
        `}
      </script>
    </Helmet>
  );
};

export default Tracking;
