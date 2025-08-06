export interface Rooms {
    room_id: number
    theater_id: number
    room_name: string
    room_status: string
    layout_id: number
    created_at: string
    updated_at: string
}

export type CreateRooms = Omit<Rooms, 'room_id' | 'created_at' | 'updated_at'>;
export type UpdateRooms = Omit<Rooms, 'room_id' | 'created_at' | 'updated_at'>;
