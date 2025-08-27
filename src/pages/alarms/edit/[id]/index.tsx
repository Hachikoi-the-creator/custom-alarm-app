import EditAddAlarm from "@/components/edit-add-alarm"

export default function EditAlarmPage() {
  return <EditAddAlarm isNew={false} />
}

// Disable static generation since this component uses router
export const getServerSideProps = async () => {
  return {
    props: {}
  }
}
