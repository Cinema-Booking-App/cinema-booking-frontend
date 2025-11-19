export interface Movies {
    movie_id: number
    title: string
    genre: string
    duration: number
    age_rating: string
    description: string
    release_date: string
    trailer_url: string
    poster_url: string
    status: string
    director: string
    actors: string
    created_at: string
}

export type CreateMovies = Omit<Movies, 'movie_id' | 'created_at'>;
export type UpdateMovies = Partial<Omit<Movies, 'movie_id' | 'created_at'>>;
