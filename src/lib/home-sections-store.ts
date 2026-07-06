import "server-only"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { DEFAULT_HOME_SECTIONS, mergeHomeSections, type HomeSections } from "./home-sections"

const SECTIONS_FILE = path.join(process.cwd(), "data/home-sections.json")

export async function getHomeSections(): Promise<HomeSections> {
  try {
    const raw = await readFile(SECTIONS_FILE, "utf-8")
    return mergeHomeSections(JSON.parse(raw))
  } catch {
    return DEFAULT_HOME_SECTIONS
  }
}

export async function saveHomeSections(sections: HomeSections): Promise<void> {
  await mkdir(path.dirname(SECTIONS_FILE), { recursive: true })
  await writeFile(SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8")
}
