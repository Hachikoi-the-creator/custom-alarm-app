import EditAddAlarm from "@/components/edit-add-alarm"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/router"

export default function EditAlarmPage() {
  const router = useRouter()
  const { id: alarmId } = router.query
  
  return <EditAddAlarm isNew={false} alarmId={alarmId as string} />
}

// // Disable static generation since this component uses router
// export const getServerSideProps = async () => {
//   return {
//     props: {}
//   }
// }
