export interface Rank {
    rank_id: number
    rank_name: string
    spending_target: number
    ticket_percent: number
    combo_percent: number
    is_default: boolean
    created_at: string
    updated_at: string 
}

export type CreateRank = Omit<Rank, 'rank_id' | 'created_at' | 'updated_at'>
export type UpdateRank = Omit<Rank, 'rank_id' | 'created_at' | 'updated_at'>