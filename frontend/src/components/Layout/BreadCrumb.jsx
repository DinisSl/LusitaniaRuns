import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";

const routeNames = {
  signup: "Registo",
  login: "Login",
  profile: "Perfil",
  race: "Corrida",
  runnersignup: "Inscrição Corredor",
  volunteersignup: "Inscrição Voluntário",
  admin: "Minha Área",
  mysignups: "Minhas Inscrições",
};

const BreadCrumb = () => {
  const location = useLocation();

  // Divide o caminho do URL pelo "/" e remove espaços vazios
  const pathnames = location.pathname.split("/").filter((x) => x !== "");

  // Criar uma lista vazia onde vamos guardar os itens e separadores
  const breadcrumbElements = [];

  // Ciclo for tradicional
  for (let i = 0; i < pathnames.length; i++) {
    const value = pathnames[i];
    const to = `/${pathnames.slice(0, i + 1).join("/")}`;
    const isLast = i === pathnames.length - 1;

    // Descobrir o título correto com if/else normal
    let title = value;
    if (!isNaN(value)) {
      title = `Detalhes #${value}`;
    } else if (routeNames[value]) {
      title = routeNames[value];
    }

    // 1. Adiciona sempre o separador primeiro
    breadcrumbElements.push(
      <BreadcrumbSeparator key={`sep-${to}`} />
    );

    // 2. Adiciona o item com if/else
    if (isLast) {
      // Se for o último elemento, não é um link
      breadcrumbElements.push(
        <BreadcrumbItem key={`item-${to}`}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      // Se não for o último, cria um link
      breadcrumbElements.push(
        <BreadcrumbItem key={`item-${to}`}>
          <BreadcrumbLink asChild>
            <Link to={to}>{title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    }
  }

  return (
    <Breadcrumb className="px-4 py-2">
      <BreadcrumbList>

        {/* Item inicial fixo */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Renderiza a lista construída no ciclo for */}
        {breadcrumbElements}

      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;