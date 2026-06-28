import { getStoreSettings } from "@/lib/settings-store"
import AnnouncementBar from "@/components/AnnouncementBar"

export default async function AnnouncementBarWrapper() {
  const settings = await getStoreSettings().catch(() => null)
  return <AnnouncementBar messages={settings?.announcements ?? []} />
}
