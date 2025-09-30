export type Movie = {
  id: number;
  title: string;
  poster: string;
  trailer?: string | null;
  badge: string;
  badgeColor: string;
  age: number;
  genre: string;
  duration: string;
  country: string;
  subtitle: string;
  status: "showing" | "upcoming";
};

// Type cho dữ liệu từ API backend
export type MovieFromAPI = {
  movie_id: number;
  title: string;
  genre: string;
  duration: number;
  age_rating: string;
  description: string;
  release_date: string;
  trailer_url: string;
  poster_url: string;
  status: string;
  director: string;
  actors: string;
  created_at: string;
};

// Utility function để chuyển đổi dữ liệu từ API sang format hiện tại
export function transformMovieFromAPI(apiMovie: MovieFromAPI): Movie {
  // Chuẩn hóa URL trailer về dạng có thể embed (YouTube, youtu.be, shorts)
  const toEmbeddableUrl = (url?: string | null): string | null => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");

      // YouTube watch URL: https://youtube.com/watch?v=VIDEO_ID
      if (host.includes("youtube.com")) {
        // shorts: https://youtube.com/shorts/VIDEO_ID
        if (u.pathname.startsWith("/shorts/")) {
          const id = u.pathname.split("/")[2];
          if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        }
        // embed already
        if (u.pathname.startsWith("/embed/")) {
          return `https://www.youtube-nocookie.com${u.pathname}${u.search}`;
        }
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      }

      // youtu.be short link: https://youtu.be/VIDEO_ID
      if (host === "youtu.be") {
        const id = u.pathname.replace("/", "");
        if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      }

      // Trường hợp khác: trả về nguyên bản (có thể là nguồn khác hỗ trợ iframe)
      return url;
    } catch {
      return url ?? null;
    }
  };
  // Chuyển đổi age_rating thành format hiện tại
  const getAgeRating = (ageRating: string) => {
    switch (ageRating) {
      case 'P': return { badge: 'P', age: 0 };
      case 'C13': return { badge: 'T13', age: 13 };
      case 'C16': return { badge: 'T16', age: 16 };
      case 'C18': return { badge: 'T18', age: 18 };
      default: return { badge: 'P', age: 0 };
    }
  };

  // Chuyển đổi status
  const getStatus = (status: string): "showing" | "upcoming" => {
    switch (status) {
      case 'now_showing': return 'showing';
      case 'upcoming': return 'upcoming';
      case 'ended': return 'upcoming'; // Ended movies hiển thị như upcoming
      default: return 'upcoming';
    }
  };

  const ageRating = getAgeRating(apiMovie.age_rating);
  
  return {
    id: apiMovie.movie_id,
    title: apiMovie.title,
    poster: apiMovie.poster_url || '/placeholder-movie.jpg',
    trailer: toEmbeddableUrl(apiMovie.trailer_url),
    badge: ageRating.badge,
    badgeColor: ageRating.age >= 16 ? 'bg-red-600' : ageRating.age >= 13 ? 'bg-red-500' : 'bg-orange-400',
    age: ageRating.age,
    genre: apiMovie.genre || 'Chưa xác định',
    duration: `${apiMovie.duration}'`,
    country: 'Việt Nam', // Có thể lấy từ API nếu có
    subtitle: 'Phụ đề', // Có thể lấy từ API nếu có
    status: getStatus(apiMovie.status),
  };
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "BỘ PHIM THÁM TỬ CONAN (K) LỒNG GHÉP: HỒI TƯỞNG MẮT ONE-EYED",
    poster: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F07-2025%2Fconan-2025.jpg&w=1920&q=75",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hồi Hộp, Phiêu Lưu, Hành Động",
    duration: "169'",
    country: "Hoa Kỳ",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 2,
    title: "MANG MẸ ĐI BỎ",
    poster: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F08-2025%2Fmang-me-di-bo-poster.jpg&w=1920&q=75",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hài, Hành Động",
    duration: "120'",
    country: "Việt Nam",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 3,
    title: "HỌNG SÚNG VÔ HÌNH",
    poster: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F08-2025%2Fhong-sung-vo-hinh.png&w=1920&q=75",
    badge: "T13",
    badgeColor: "bg-red-500",
    age: 13,
    genre: "Hoạt Hình, Gia Đình",
    duration: "100'",
    country: "Mỹ",
    subtitle: "Lồng Tiếng",
    status: "upcoming",
  },
  {
    id: 4,
    title: "KUNG FU PANDA 4 (K)",
    poster: "https://api-website.cinestar.com.vn/media/wysiwyg/Posters/06-2025/ma-khong-dau.jpg",
    badge: "K",
    badgeColor: "bg-orange-400",
    age: 0,
    genre: "Hoạt Hình, Hài Hước",
    duration: "95'",
    country: "Mỹ",
    subtitle: "Phụ Đề",
    status: "upcoming",
  },
  {
    id: 5,
    title: "NHIỆM VỤ: BẤT KHẢ THI - NGHIỆP BÁO CUỐI CÙNG (T16)",
    poster: "https://upload.wikimedia.org/wikipedia/vi/b/b6/Nhi%E1%BB%87m_v%E1%BB%A5_b%E1%BA%A5t_kh%E1%BA%A3_thi_%E2%80%93_Nghi%E1%BB%87p_b%C3%A1o_%E2%80%93_Ph%E1%BA%A7n_1_-_Vietnam_poster.jpg",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hồi Hộp, Phiêu Lưu, Hành Động",
    duration: "169'",
    country: "Hoa Kỳ",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 6,
    title: "BỘ 5 SIÊU ĐẲNG CẤP (T16) LT",
    poster: "https://upload.wikimedia.org/wikipedia/vi/b/b6/Nhi%E1%BB%87m_v%E1%BB%A5_b%E1%BA%A5t_kh%E1%BA%A3_thi_%E2%80%93_Nghi%E1%BB%87p_b%C3%A1o_%E2%80%93_Ph%E1%BA%A7n_1_-_Vietnam_poster.jpg",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hài, Hành Động",
    duration: "120'",
    country: "Việt Nam",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 7,
    title: "INSIDE OUT 2 (T13)",
    poster: "https://api-website.cinestar.com.vn/media/wysiwyg/Posters/06-2025/ma-khong-dau.jpg",
    badge: "T13",
    badgeColor: "bg-red-500",
    age: 13,
    genre: "Hoạt Hình, Gia Đình",
    duration: "100'",
    country: "Mỹ",
    subtitle: "Lồng Tiếng",
    status: "upcoming",
  },
  {
    id: 8,
    title: "KUNG FU PANDA 4 (K)",
    poster: "https://api-website.cinestar.com.vn/media/wysiwyg/Posters/06-2025/ma-khong-dau.jpg",
    badge: "K",
    badgeColor: "bg-orange-400",
    age: 0,
    genre: "Hoạt Hình, Hài Hước",
    duration: "95'",
    country: "Mỹ",
    subtitle: "Phụ Đề",
    status: "upcoming",
  },
  {
    id: 9,
    title: "NHIỆM VỤ: BẤT KHẢ THI - NGHIỆP BÁO CUỐI CÙNG (T16)",
    poster: "https://upload.wikimedia.org/wikipedia/vi/b/b6/Nhi%E1%BB%87m_v%E1%BB%A5_b%E1%BA%A5t_kh%E1%BA%A3_thi_%E2%80%93_Nghi%E1%BB%87p_b%C3%A1o_%E2%80%93_Ph%E1%BA%A7n_1_-_Vietnam_poster.jpg",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hồi Hộp, Phiêu Lưu, Hành Động",
    duration: "169'",
    country: "Hoa Kỳ",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 10,
    title: "BỘ 5 SIÊU ĐẲNG CẤP (T16) LT",
    poster: "https://upload.wikimedia.org/wikipedia/vi/b/b6/Nhi%E1%BB%87m_v%E1%BB%A5_b%E1%BA%A5t_kh%E1%BA%A3_thi_%E2%80%93_Nghi%E1%BB%87p_b%C3%A1o_%E2%80%93_Ph%E1%BA%A7n_1_-_Vietnam_poster.jpg",
    badge: "T16",
    badgeColor: "bg-red-600",
    age: 16,
    genre: "Hài, Hành Động",
    duration: "120'",
    country: "Việt Nam",
    subtitle: "Phụ Đề",
    status: "showing",
  },
  {
    id: 11,
    title: "INSIDE OUT 2 (T13)",
    poster: "https://api-website.cinestar.com.vn/media/wysiwyg/Posters/06-2025/ma-khong-dau.jpg",
    badge: "T13",
    badgeColor: "bg-red-500",
    age: 13,
    genre: "Hoạt Hình, Gia Đình",
    duration: "100'",
    country: "Mỹ",
    subtitle: "Lồng Tiếng",
    status: "upcoming",
  },
  {
    id: 12,
    title: "KUNG FU PANDA 4 (K)",
    poster: "https://api-website.cinestar.com.vn/media/wysiwyg/Posters/06-2025/ma-khong-dau.jpg",
    badge: "K",
    badgeColor: "bg-orange-400",
    age: 0,
    genre: "Hoạt Hình, Hài Hước",
    duration: "95'",
    country: "Mỹ",
    subtitle: "Phụ Đề",
    status: "upcoming",
  },
  // ... thêm nhiều phim showing và upcoming ...
]; 