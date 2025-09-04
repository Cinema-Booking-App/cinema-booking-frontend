import { Movies } from "./movies"
import { Rooms } from "./rooms"
import { Theaters } from "./theaters"

export interface Showtimes {
    showtime_id: number
    movie_id: number
    movie: Movies
    theater_id: number
    theater: Theaters
    room_id: number
    room: Rooms
    show_datetime: string
    format: string
    ticket_price: number
    status: string
    language: string
    created_at: string
    updated_at: string
}
export interface CreateShowtime {
    movie_id: number
    theater_id: number
    room_id: number
    show_datetime: string
    format: string
    ticket_price: number
    status: string
    language: string

}
