export interface Rooms {
    room_id: number
    theater_id: number
    room_name: string
    layout_id: number
    created_at: string 
}

export type CreateRooms= Omit<Rooms, 'room_id' | 'created_at'>;
export type UpdateRooms= Omit<Rooms, 'room_id' | 'created_at'>;
