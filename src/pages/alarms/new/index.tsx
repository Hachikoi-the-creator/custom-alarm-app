import EditAddAlarm from "@/components/edit-add-alarm"
import { useRouter } from "next/router"

export default function NewAlarmPage() {
  const router = useRouter()
  const path = router.pathname
  const alarmId = path.split("/").pop()

  return (
    <EditAddAlarm isNew={true} alarmId={alarmId || ""} />
  )
}

// // Disable static generation since this component uses router
// export const getServerSideProps = async () => {
//   return {
//     props: {}
//   }
// }