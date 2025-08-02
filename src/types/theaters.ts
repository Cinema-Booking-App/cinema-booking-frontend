import { Rooms } from "./rooms"

export interface Theaters {
    theater_id: number
    name: string
    address: string
    city: string
    phone: string
    created_at: string
}

export type CreateTheaters = Omit<Theaters, 'theater_id' | 'created_at'>;
export type UpdateTheaters = Omit<Theaters, 'theater_id' | 'created_at'>;

export interface CombinedTheater extends Theaters {
  rooms: Rooms[]
}