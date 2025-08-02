export interface SeatLayouts {
    layout_id: number
    layout_name: string
    description: string
    total_rows: number
    total_columns: number
    aisle_positions: string
}

export interface SeatTemplates {
    template_id: number
    layout_id: number
    row_number: number
    column_number: number
    seat_code: string
    seat_type: string
    is_edge: boolean
    is_active: boolean
}