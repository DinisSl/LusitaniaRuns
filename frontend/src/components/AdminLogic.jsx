import { useEffect, useState } from "react"
import axios from "axios"

import { DataTable } from "@/components/data-table"

import { runnerColumns } from "@/components/runnerColumns"
import { volunteerColumns } from "@/components/volunteerColumns"

const AdminLogic = () => {
  const [participantesCorredores, setParticipantes] = useState([])
  const [participantesVoluntarios, setVoluntarios] = useState([])

  const URL_RUNNERSIGUPS =
    "http://localhost:8000/race/api/runnersignups/"

  const URL_VOLUNTEERSIGUPS =
    "http://localhost:8000/race/api/volunteersignups/"

  useEffect(() => {
    axios
      .get(URL_RUNNERSIGUPS)
      .then((response) => setParticipantes(response.data))
      .catch(() =>
        console.log("erro ao ir buscar os participantes")
      )
  }, [])

  useEffect(() => {
    axios
      .get(URL_VOLUNTEERSIGUPS)
      .then((response) => setVoluntarios(response.data))
      .catch(() =>
        console.log("erro ao ir buscar os voluntários")
      )
  }, [])

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Participantes
        </h1>

        <DataTable
          columns={runnerColumns}
          data={participantesCorredores}
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">
          Voluntários
        </h1>

        <DataTable
          columns={volunteerColumns}
          data={participantesVoluntarios}
        />
      </div>
    </div>
  )
}

export default AdminLogic