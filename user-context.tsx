"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  gender: "male" | "female" | "other"
  height: number
  weight: number
  fitnessGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "flexibility"
  workoutPreference: "home" | "gym" | "outdoor" | "mixed"
  workoutIntensity: "beginner" | "intermediate" | "advanced"
  workoutTime: number
  strengthLevel: "beginner" | "intermediate" | "advanced"
  flexibilityLevel: "beginner" | "intermediate" | "advanced"
  enduranceLevel: "beginner" | "intermediate" | "advanced"
}

export interface DailyProgress {
  date: string
  workoutCompleted: boolean
  dietCompleted: boolean
  waterIntake: number
  notes?: string
}

export interface WorkoutPlan {
  id: string
  generatedAt: string
  days: {
    day: number
    dayName: string
    exercises: {
      name: string
      sets: number
      reps: string
      duration?: string
      instructions: string
      difficulty: "easy" | "medium" | "hard"
      injuryPrevention?: string
    }[]
    warmup: string[]
    cooldown: string[]
    isRestDay: boolean
  }[]
  feedback?: string
}

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: Partial<UserProfile> & { password: string }) => Promise<boolean>
  logout: () => void
  progress: DailyProgress[]
  addProgress: (progress: DailyProgress) => void
  updateProgress: (date: string, updates: Partial<DailyProgress>) => void
  workoutPlan: WorkoutPlan | null
  setWorkoutPlan: (plan: WorkoutPlan | null) => void
  weeklyScore: number
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<DailyProgress[]>([])
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("fitsmart_user")
    const savedProgress = localStorage.getItem("fitsmart_progress")
    const savedPlan = localStorage.getItem("fitsmart_workout_plan")
    
    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedProgress) setProgress(JSON.parse(savedProgress))
    if (savedPlan) setWorkoutPlan(JSON.parse(savedPlan))
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("fitsmart_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("fitsmart_user")
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("fitsmart_progress", JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    if (workoutPlan) {
      localStorage.setItem("fitsmart_workout_plan", JSON.stringify(workoutPlan))
    }
  }, [workoutPlan])

  const login = async (email: string, _password: string): Promise<boolean> => {
    const defaultUser: UserProfile = {
      id: "1",
      name: "Fitness User",
      email,
      age: 25,
      gender: "male",
      height: 175,
      weight: 70,
      fitnessGoal: "muscle_gain",
      workoutPreference: "gym",
      workoutIntensity: "intermediate",
      workoutTime: 60,
      strengthLevel: "intermediate",
      flexibilityLevel: "beginner",
      enduranceLevel: "intermediate",
    }
    setUser(defaultUser)
    return true
  }

  const register = async (data: Partial<UserProfile> & { password: string }): Promise<boolean> => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: data.name || "New User",
      email: data.email || "",
      age: data.age || 25,
      gender: data.gender || "male",
      height: data.height || 175,
      weight: data.weight || 70,
      fitnessGoal: data.fitnessGoal || "maintenance",
      workoutPreference: data.workoutPreference || "mixed",
      workoutIntensity: data.workoutIntensity || "beginner",
      workoutTime: data.workoutTime || 45,
      strengthLevel: data.strengthLevel || "beginner",
      flexibilityLevel: data.flexibilityLevel || "beginner",
      enduranceLevel: data.enduranceLevel || "beginner",
    }
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fitsmart_user")
  }

  const addProgress = (newProgress: DailyProgress) => {
    setProgress((prev) => {
      const filtered = prev.filter((p) => p.date !== newProgress.date)
      return [...filtered, newProgress]
    })
  }

  const updateProgress = (date: string, updates: Partial<DailyProgress>) => {
    setProgress((prev) =>
      prev.map((p) => (p.date === date ? { ...p, ...updates } : p))
    )
  }

  const calculateWeeklyScore = () => {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weekProgress = progress.filter((p) => {
      const date = new Date(p.date)
      return date >= weekAgo && date <= today
    })

    if (weekProgress.length === 0) return 0

    let score = 0
    weekProgress.forEach((p) => {
      if (p.workoutCompleted) score += 40 / 7
      if (p.dietCompleted) score += 35 / 7
      if (p.waterIntake >= 8) score += 25 / 7
      else if (p.waterIntake >= 5) score += 15 / 7
    })

    return Math.round(Math.min(100, score))
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        progress,
        addProgress,
        updateProgress,
        workoutPlan,
        setWorkoutPlan,
        weeklyScore: calculateWeeklyScore(),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
