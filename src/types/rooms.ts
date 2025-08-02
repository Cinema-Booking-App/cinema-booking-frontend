export interface Rooms {
    room_id: number
    theater_id: number
    room_name: string
    layout_id: number
    created_at: string 
}

export type CreateTheaters = Omit<Rooms, 'room_id' | 'created_at'>;
export type UpdateTheaters = Omit<Rooms, 'moviroom_ide_id' | 'created_at'>;
