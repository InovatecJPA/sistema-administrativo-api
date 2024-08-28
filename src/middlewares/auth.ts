import jwt from '../config/jwt';
import Grant from '../apps/Auth/model/Grant';
import ProfileGrant from '../apps/Auth/model/ProfileGrant';
import Profile from '../apps/Auth/model/Profile';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import AppDataSource from '../database/dbConnection';

interface UserInfo {
    path: string;
    isAtivo: boolean;
    profile: Profile;
    isAllowed?: boolean;
}

const profileGrantRepository: Repository<ProfileGrant> = AppDataSource.getRepository(ProfileGrant);

// Função para filtrar rotas
const filterRoute = (userInfo: UserInfo, profileGrants: ProfileGrant[]) => {
    const uuidRegex: RegExp = /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/;
    const matches: RegExpMatchArray = userInfo.path.match(uuidRegex);
    const uuid: string = matches && matches.length >= 1 && matches[0];

    const grants: Grant[] = profileGrants.map(profileGrant => {
        if (profileGrant.grant.route.includes(':id') && uuid) {
            return profileGrant.grant.route.replace(':id', uuid);
        }
        if (profileGrant.grant.route.includes('?page') && uuid) {
            return profileGrant.grant.route.replace(':id', uuid);
        }
        return profileGrant.grant.route;
    });

    const index: number = grants.indexOf(userInfo.path);
    console.log(userInfo.path);
    console.log(grants);

    const filterableRoutes: string[] = profileGrants.map(profileGrant => profileGrant.grant.routeFilter);

    if (index !== -1 && index < filterableRoutes.length) {
        userInfo.isAllowed = true;
    }
};

// Middleware de autenticação
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }

    const parts: string[] = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).send({ error: "Token error" });
    }

    let scheme: string;
    let token: string;
    [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: "Token malformatted" });
    }

    const userInfo = jwt.verify(token);

    if (!userInfo) {
        return res.status(401).send({ error: "Token invalid" });
    }

    console.log(req.query);

    req.userInfo = userInfo;

    const startParams = req.originalUrl.indexOf('?');
    req.userInfo.path = req.originalUrl.substring(0, startParams === -1 ? req.originalUrl.length : startParams);

    console.log(userInfo);

    if (userInfo.isAdmin === true) {
        return next();
    } else {
        // Encontre o perfil e grants associados
        const profileGrants = await profileGrantRepository.find({
            relations: ['grant'],
            where: { profile: { id: userInfo.profile.id } },
        });

        filterRoute(req.userInfo, profileGrants);

        if (req.userInfo.isAllowed) {
            return next();
        } else {
            return res.status(401).send({ error: "Sem permissão" });
        }
    }
};

export default authMiddleware;
