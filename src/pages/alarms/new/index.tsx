import EditAddAlarm from "@/components/edit-add-alarm"

export default function NewAlarmPage() {
  return (
    <EditAddAlarm isNew={true} />
  )
}

// // Disable static generation since this component uses router
// export const getServerSideProps = async () => {
//   return {
//     props: {}
//   }
// }