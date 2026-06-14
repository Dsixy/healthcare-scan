export type Gender = 'male' | 'female'

export interface UserProfile {
  gender: Gender
  age: number
  height: number
  weight: number
}

export const DEFAULT_PROFILE: UserProfile = {
  gender: 'male',
  age: 28,
  height: 175,
  weight: 70,
}

export function calcBmi(height: number, weight: number): number {
  const h = height / 100
  return Math.round((weight / (h * h)) * 10) / 10
}

export function genderLabel(gender: Gender): string {
  return gender === 'male' ? '男' : '女'
}
