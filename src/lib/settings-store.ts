import "server-only"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { DEFAULT_STORE_SETTINGS, mergeStoreSettings, type StoreSettings } from "./settings"

const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://api.vula.co.za"
const TENANT_ID = "off-the-hook"
const SETTINGS_FILE = path.join(process.cwd(), "data/store-settings.json")

async function fetchVulaSettings(): Promise<StoreSettings | null> {
  try {
    const res = await fetch(`${VULA_API}/v1/commerce/${TENANT_ID}/settings`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.VULA_API_KEY || "",
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return mergeStoreSettings(data.settings ?? data)
  } catch {
    return null
  }
}

async function readLocalSettings(): Promise<StoreSettings | null> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf-8")
    return mergeStoreSettings(JSON.parse(raw))
  } catch {
    return null
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const fromVula = await fetchVulaSettings()
  if (fromVula) return fromVula

  const fromFile = await readLocalSettings()
  if (fromFile) return fromFile

  return DEFAULT_STORE_SETTINGS
}

export async function saveStoreSettings(settings: StoreSettings): Promise<{ ok: boolean; source: string }> {
  try {
    const res = await fetch(`${VULA_API}/v1/commerce/${TENANT_ID}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.VULA_API_KEY || "",
      },
      body: JSON.stringify(settings),
    })
    if (res.ok) return { ok: true, source: "vula" }
  } catch {
    // fall through to local file
  }

  try {
    await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8")
    return { ok: true, source: "local" }
  } catch {
    return { ok: false, source: "none" }
  }
}
