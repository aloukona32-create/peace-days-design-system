import type { ProgramDay, Session, SessionType } from './content'
import { supabase } from './supabase'

const SESSION_TYPES: readonly string[] = ['foire', 'forum', 'art', 'sport', 'gala']

function isSessionType(type: string): type is SessionType {
  return SESSION_TYPES.includes(type)
}

export interface ProgramSession extends Session {
  id: string
  sortOrder: number
}

export interface AdminProgramDay extends Omit<ProgramDay, 'sessions'> {
  sessions: ProgramSession[]
  sortOrder: number
}

export interface ProgramDayInput {
  id?: string
  day: string
  weekday: string
  label: string
  sortOrder: number
}

export interface ProgramSessionInput {
  id?: string
  dayId: string
  time: string
  type: SessionType
  title: string
  place: string
  speaker: string
  blurb: string
  sortOrder: number
}

export async function getProgram(): Promise<AdminProgramDay[]> {
  const [{ data: days, error: daysError }, { data: sessions, error: sessionsError }] = await Promise.all([
    supabase.from('program_days').select('id,day,weekday,label,sort_order').order('sort_order').order('id'),
    supabase
      .from('program_sessions')
      .select('id,day_id,time,type,title,place,speaker,blurb,sort_order')
      .order('sort_order')
      .order('id'),
  ])
  if (daysError) throw daysError
  if (sessionsError) throw sessionsError

  const sessionsByDay = new Map<string, ProgramSession[]>()
  for (const row of sessions ?? []) {
    if (!isSessionType(row.type)) throw new Error(`Type de session invalide en base : ${row.type}`)
    const daySessions = sessionsByDay.get(row.day_id) ?? []
    daySessions.push({
      id: row.id,
      time: row.time,
      type: row.type,
      title: row.title,
      place: row.place,
      speaker: row.speaker ?? undefined,
      blurb: row.blurb,
      sortOrder: row.sort_order,
    })
    sessionsByDay.set(row.day_id, daySessions)
  }

  return (days ?? []).map((day) => ({
    id: day.id,
    day: day.day,
    weekday: day.weekday,
    label: day.label,
    sortOrder: day.sort_order,
    sessions: sessionsByDay.get(day.id) ?? [],
  }))
}

export async function saveProgramDay(input: ProgramDayInput): Promise<void> {
  const values = {
    id: input.id ?? crypto.randomUUID(),
    day: input.day,
    weekday: input.weekday,
    label: input.label,
    sort_order: input.sortOrder,
  }
  const { data, error } = await supabase.from('program_days').upsert(values).select('id').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('La journée n’a pas été enregistrée.')
}

export async function deleteProgramDay(id: string): Promise<void> {
  const { data, error } = await supabase.from('program_days').delete().eq('id', id).select('id')
  if (error) throw error
  if (!data?.length) throw new Error('Aucune journée supprimée. Vérifiez vos droits admin.')
}

export async function saveProgramSession(input: ProgramSessionInput): Promise<void> {
  const values = {
    ...(input.id ? { id: input.id } : { id: crypto.randomUUID() }),
    day_id: input.dayId,
    time: input.time,
    type: input.type,
    title: input.title,
    place: input.place,
    speaker: input.speaker || null,
    blurb: input.blurb,
    sort_order: input.sortOrder,
  }
  const { data, error } = await supabase.from('program_sessions').upsert(values).select('id').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('La session n’a pas été enregistrée.')
}

export async function deleteProgramSession(id: string): Promise<void> {
  const { data, error } = await supabase.from('program_sessions').delete().eq('id', id).select('id')
  if (error) throw error
  if (!data?.length) throw new Error('Aucune session supprimée. Vérifiez vos droits admin.')
}
