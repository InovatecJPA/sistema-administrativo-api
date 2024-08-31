import * as jwt from "../config/jwt";
import Grant from "../apps/Auth/model/Grant";
import ProfileGrant from "../apps/Auth/model/ProfileGrant";
import * as UserDTO from "../apps/Auth/dto/user.dto";
import { NextFunction, Request, Response } from "express";
import AppDataSource from "../database/dbConnection";

const checkRoutePermission = (
  userInfo: UserDTO.userInfo,
  profileGrants: ProfileGrant[]
) => {
  console.log(userInfo.path);
  // Verifica se o caminho atual é permitido por padrão
  const defaultAllowedPaths = [
    "/dev/accounts/users/profile",
    `/users/${userInfo.id}`,
  ];

  if (defaultAllowedPaths.includes(userInfo.path)) return true;

  // Expressões regulares para verificar permissões baseadas em padrões de caminho
  const regexPatterns = [
    /\/[a-zA-Z]+\/upload\//,
    /^\/upload\/get\//,
    /\/[a-zA-Z]+\/cpf\//,
  ];

  // Verifica se o caminho do usuário corresponde a qualquer um dos padrões regex
  if (regexPatterns.some((regex) => regex.test(userInfo.path))) return true;

  // Regex para UUIDs em caminhos
  const uuidRegex =
    /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const uuidMatches = userInfo.path.match(uuidRegex);
  const uuid = uuidMatches ? uuidMatches[0] : null;

  // Cria uma lista de rotas permitidas, substituindo :id pelo UUID se aplicável
  const grants = profileGrants.map((profileGrant) => {
    const { route } = profileGrant.grant;
    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Verifica se o caminho do usuário está nas rotas permitidas
  return grants.includes(userInfo.path);
};

const filterRoute = (
  userInfo: UserDTO.userInfo,
  profileGrants: ProfileGrant[]
) => {
  // Expressão regular para encontrar um UUID na rota do usuário
  const uuidRegex =
    /(\{)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\})?/;
  const matches = userInfo.path.match(uuidRegex);
  const uuid = matches ? matches[0] : null;

  // Mapeia as rotas de concessão, substituindo :id pelo UUID se aplicável
  const grants = profileGrants.map((profileGrant) => {
    const { route } = profileGrant.grant;
    return route.includes(":id") && uuid ? route.replace(":id", uuid) : route;
  });

  // Encontra o índice da rota do usuário na lista de rotas de concessão
  const index = grants.indexOf(userInfo.path);

  // Se a rota do usuário não for encontrada, não faz nenhuma modificação
  if (index === -1) return;

  // Mapeia todas as rotas filtráveis e define a rota filtrável correspondente no userInfo
  const filterableRoutes = profileGrants.map(
    (profileGrant) => profileGrant.grant.routeFilter
  );

  userInfo.routeFilter = filterableRoutes[index];
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatted" });
  }

  const userInfo = jwt.verifyToken(token);

  if (!userInfo) {
    return res.status(401).json({ error: "Token invalid" });
  }

  //console.log(req.query);

  req.userInfo = userInfo as UserDTO.userInfo;

  //console.log(userInfo);

  // Questão de grants e etc
  const startParams = req.originalUrl.indexOf("?");
  console.log(`\n StartParams: ${startParams} \n`);

  req.userInfo.path = req.originalUrl.substring(
    0,
    startParams === -1 ? req.originalUrl.length : startParams
  );

  //console.log(req.userInfo.path);

  // Era pra ser uma função do service de grant
  const profileGrantRepository = AppDataSource.getRepository(ProfileGrant);

  const profileGrants = await profileGrantRepository.find({
    where: { profile: { id: userInfo.profileId } }, // Filtra os ProfileGrant associados ao Profile especificado
    relations: ["grant"], // Inclui os dados da entidade Grant
    select: {
      grant: {
        route: true,
        routeFilter: true,
      },
    },
  });

  if (!userInfo.isAdmin && !checkRoutePermission(req.userInfo, profileGrants)) {
    return res.status(403).send();
  } else {
    try {
      filterRoute(req.userInfo, profileGrants);
      return next();
    } catch (error) {
      console.error(error);
      res.status(400).send();
    }
  }
};
