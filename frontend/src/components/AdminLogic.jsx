// src/pages/AdminLogic.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CreateRace from "@/components/CreateRace";

// Função para obter o token CSRF
const obterTokenCSRF = () => {
  const cookieCSRF = document.cookie
    .split("; ")
    .find((linha) => linha.startsWith("csrftoken="));
  return cookieCSRF ? cookieCSRF.split("=")[1] : null;
};

const AdminLogic = () => {
  // Estado para listas de inscrições
  const [inscricoesCorredores, setInscricoesCorredores] = useState([]);
  const [inscricoesVoluntarios, setInscricoesVoluntarios] = useState([]);

  // Estado para o diálogo de comentário
  const [dialogAberto, setDialogAberto] = useState(false);
  const [comentarioDialog, setComentarioDialog] = useState("");
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [isCorredorSelecionado, setIsCorredorSelecionado] = useState(true);


  const URL_CORREDORES = "http://localhost:8000/race/api/runnersignups/";
  const URL_VOLUNTARIOS = "http://localhost:8000/race/api/volunteersignups/";


  const buscarInscricoesCorredores = async () => {
    try {
      const resposta = await axios.get(URL_CORREDORES, { withCredentials: true });
      const dados = resposta.data.results || resposta.data;
      setInscricoesCorredores(dados);
    } catch (erro) {
      console.error("Erro ao buscar corredores:", erro);
    }
  };

  const buscarInscricoesVoluntarios = async () => {
    try {
      const resposta = await axios.get(URL_VOLUNTARIOS, { withCredentials: true });
      const dados = resposta.data.results || resposta.data;
      setInscricoesVoluntarios(dados);
    } catch (erro) {
      console.error("Erro ao buscar voluntários:", erro);
    }
  };


  useEffect(() => {
    buscarInscricoesCorredores();
    buscarInscricoesVoluntarios();
  }, []);

  // Função genérica para atualizar um campo qualquer (estado, classificação, comentário)
  const atualizarInscricao = async (id, dadosAtualizados, isCorredor) => {
    const url = isCorredor ? `${URL_CORREDORES}${id}/` : `${URL_VOLUNTARIOS}${id}/`;
    try {
      await axios.put(url, dadosAtualizados, {
        withCredentials: true,
        headers: { "X-CSRFToken": obterTokenCSRF() },
      });
      return true;
    } catch (erro) {
      console.error("Erro ao atualizar inscrição:", erro);
      return false;
    }
  };

  // Atualizar estado (APROVADO/REJEITADO)
  const atualizarEstado = async (id, novoEstado, isCorredor) => {
    const sucesso = await atualizarInscricao(id, { state: novoEstado }, isCorredor);
    if (sucesso) {
      if (isCorredor) {
        setInscricoesCorredores((listaAtual) =>
          listaAtual.map((item) => {
            if (item.id === id) {
              return { ...item, state: novoEstado };
            }
            return item;
          })
        );
      } else {
        setInscricoesVoluntarios((listaAtual) =>
          listaAtual.map((item) => {
            if (item.id === id) {
              return { ...item, state: novoEstado };
            }
            return item;
          })
        );
      }
    }
  };

  // Atualizar classificação (apenas corredores)
  const atualizarClassificacao = async (id, novaClassificacao) => {
    const sucesso = await atualizarInscricao(id, { classification: novaClassificacao }, true);
    if (sucesso) {
      setInscricoesCorredores((listaAtual) =>
        listaAtual.map((item) => {
          if (item.id === id) {
            return { ...item, classification: novaClassificacao };
          }
          return item;
        })
      );
    }
  };

  // Atualizar comentário
  const atualizarComentario = async (id, novoComentario, isCorredor) => {
    const sucesso = await atualizarInscricao(id, { adminComment: novoComentario }, isCorredor);
    if (sucesso) {
      if (isCorredor) {
        setInscricoesCorredores((listaAtual) =>
          listaAtual.map((item) => {
            if (item.id === id) {
              return { ...item, adminComment: novoComentario };
            }
            return item;
          })
        );
      } else {
        setInscricoesVoluntarios((listaAtual) =>
          listaAtual.map((item) => {
            if (item.id === id) {
              return { ...item, adminComment: novoComentario };
            }
            return item;
          })
        );
      }
    }
  };

  // editar comentário
  const abrirDialogComentario = (id, comentarioAtual, isCorredor) => {
    setIdSelecionado(id);
    setComentarioDialog(comentarioAtual || "");
    setIsCorredorSelecionado(isCorredor);
    setDialogAberto(true);
  };

  // Salvar comentário
  const salvarComentario = () => {
    if (idSelecionado !== null) {
      atualizarComentario(idSelecionado, comentarioDialog, isCorredorSelecionado);
      setDialogAberto(false);
    }
  };

  // Componente para exibir o badge
  const BadgeEstado = ({ estado }) => {
    if (estado === "APROVADO") return <Badge className="bg-green-600 text-white">Aprovado</Badge>;
    if (estado === "REJEITADO") return <Badge variant="destructive">Rejeitado</Badge>;
    return <Badge variant="secondary">Pendente</Badge>;
  };

  // Contar quantos aprovados existem numa corrida (para gerar opções de classificação)
  const contarAprovadosPorCorrida = (nomeCorrida) => {
    return inscricoesCorredores.filter(
      (inscricao) => inscricao.race_name === nomeCorrida && inscricao.state === "APROVADO"
    ).length;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Formulário para criar nova corrida */}
      <CreateRace />

      {/* Seção de Corredores */}
      <div>
        <h2 className="text-xl font-bold mb-4">Inscrições de Corredores</h2>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Comentário Admin</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscricoesCorredores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum participante encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                inscricoesCorredores.map((corredor) => (
                  <TableRow key={corredor.id}>
                    <TableCell className="font-medium">{corredor.user_name}</TableCell>
                    <TableCell>{corredor.race_name}</TableCell>
                    <TableCell>
                      {corredor.state === "APROVADO" ? (
                        <Select
                          value={corredor.classification ? String(corredor.classification) : undefined}
                          onValueChange={(valor) => atualizarClassificacao(corredor.id, valor)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="N/A" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: contarAprovadosPorCorrida(corredor.race_name) }, (_, i) => i + 1).map(
                              (num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num}º
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <BadgeEstado estado={corredor.state} />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{corredor.adminComment || "—"}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => abrirDialogComentario(corredor.id, corredor.adminComment, true)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => atualizarEstado(corredor.id, "APROVADO", true)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => atualizarEstado(corredor.id, "REJEITADO", true)}
                      >
                        Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Seção de Voluntários */}
      <div>
        <h2 className="text-xl font-bold mb-4">Inscrições de Voluntários</h2>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voluntário</TableHead>
                <TableHead>Corrida</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Comentário Admin</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscricoesVoluntarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum voluntário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                inscricoesVoluntarios.map((voluntario) => (
                  <TableRow key={voluntario.id}>
                    <TableCell className="font-medium">{voluntario.user_name}</TableCell>
                    <TableCell>{voluntario.race_name}</TableCell>
                    <TableCell>{voluntario.role}</TableCell>
                    <TableCell>
                      <BadgeEstado estado={voluntario.state} />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{voluntario.adminComment || "—"}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => abrirDialogComentario(voluntario.id, voluntario.adminComment, false)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => atualizarEstado(voluntario.id, "APROVADO", false)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => atualizarEstado(voluntario.id, "REJEITADO", false)}
                      >
                        Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo de edição de comentário */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar comentário administrativo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={comentarioDialog}
              onChange={(e) => setComentarioDialog(e.target.value)}
              placeholder="Escreva aqui o comentário sobre a inscrição..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarComentario}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogic;