import axios from "axios"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const updateState = async (id, state) => {
  try {
    await axios.patch(
      `http://localhost:8000/race/api/runnersignups/${id}/`,
      {
        state: state,
      }
    )

    window.location.reload()
  } catch (error) {
    console.log("erro ao atualizar estado")
  }
}

const getBadgeVariant = (state) => {
  switch (state) {
    case "APROVADO":
      return "default"

    case "REJEITADO":
      return "destructive"

    default:
      return "secondary"
  }
}

export const runnerColumns = [
  {
    header: "Nome",

    cell: ({ row }) => {
      const user = row.original.user

      return `${user.user.first_name} ${user.user.last_name}`
    },
  },

  {
    header: "Corrida",

    cell: ({ row }) => {
      return row.original.race.name
    },
  },

  {
    accessorKey: "state",

    header: "Estado",

    cell: ({ row }) => {
      return (
        <Badge variant={getBadgeVariant(row.original.state)}>
          {row.original.state}
        </Badge>
      )
    },
  },

  {
    header: "Ações",

    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              updateState(row.original.id, "APROVADO")
            }
          >
            Aprovar
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              updateState(row.original.id, "REJEITADO")
            }
          >
            Rejeitar
          </Button>
        </div>
      )
    },
  },
]