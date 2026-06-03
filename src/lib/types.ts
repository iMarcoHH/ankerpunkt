export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  monthly_budget: number
  currency: string
  onboarding_completed: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string | null
  date: string
  is_recurring: boolean
  recurrence: 'monthly' | 'yearly' | null
  created_at: string
}

export interface Insurance {
  id: string
  user_id: string
  name: string
  provider: string | null
  amount: number
  recurrence: 'monthly' | 'yearly'
  next_due: string | null
  category: string | null
  notes: string | null
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  color: string
  icon: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string | null
  reminder_at: string | null
  created_at: string
}

export const INCOME_CATEGORIES = [
  'Gehalt', 'Freelance', 'Investments', 'Mieteinnahmen', 'Sonstiges'
]

export const EXPENSE_CATEGORIES = [
  'Wohnen', 'Lebensmittel', 'Transport', 'Gesundheit', 'Freizeit',
  'Kleidung', 'Abos', 'Bildung', 'Restaurantbesuche', 'Elektronik', 'Sonstiges'
]

export const INSURANCE_CATEGORIES = [
  'Haftpflicht', 'Hausrat', 'KFZ', 'Kranken', 'Leben', 'Berufsunfähigkeit',
  'Rechtsschutz', 'Unfall', 'Sonstiges'
]
