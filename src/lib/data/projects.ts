/* eslint-disable @typescript-eslint/no-unused-vars */
import { Project } from "@/types/database"

export async function getProjects(): Promise<Project[]> {
  return []
}

export async function getProjectBySlug(_slug: string): Promise<Project | null> {
  return null
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return []
}

export async function createProject(_data: Partial<Project>): Promise<Project | null> {
  return null
}

export async function updateProject(_id: string, _data: Partial<Project>): Promise<Project | null> {
  return null
}

export async function deleteProject(_id: string): Promise<void> {
}

export async function restoreProject(_id: string): Promise<void> {
}
