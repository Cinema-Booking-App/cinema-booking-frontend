import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, image, url }: SEOProps) {
  return (
    <Head>
      <title>{title || 'Cinema Booking App'}</title>
      <meta name="description" content={description || 'Đặt vé xem phim trực tuyến, cập nhật lịch chiếu, ưu đãi và thông tin rạp.'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Open Graph */}
      <meta property="og:title" content={title || 'Cinema Booking App'} />
      <meta property="og:description" content={description || 'Đặt vé xem phim trực tuyến, cập nhật lịch chiếu, ưu đãi và thông tin rạp.'} />
      <meta property="og:image" content={image || '/og-image.png'} />
      <meta property="og:url" content={url || 'https://ryon.website.com'} />
      <meta property="og:type" content="website" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'Cinema Booking App'} />
      <meta name="twitter:description" content={description || 'Đặt vé xem phim trực tuyến, cập nhật lịch chiếu, ưu đãi và thông tin rạp.'} />
      <meta name="twitter:image" content={image || '/og-image.png'} />
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/logo-cinema.png" />
      <link rel="apple-touch-icon" href="/logo-cinema.png" />
    </Head>
  );
}
