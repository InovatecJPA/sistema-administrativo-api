import jwt from '../config/jwt';
import Grant from '../apps/Autenticacao/models/Grant';
import ProfileGrant from '../apps/Autenticacao/models/ProfileGrant';
import Profile from '../apps/Autenticacao/models/Profile';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

interface UserInfo {
    path: string;
    isAdmin?: boolean;
    profile_id?: string;
    isPremisons?: boolean;
}

interface ProfileGrantInstance {
    grant: Grant;
}

// Função para filtrar rotas
const filterRoute = (userInfo: UserInfo, profileGrants: ProfileGrantInstance[]) => {
    const uuidRegex = /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/;
    const matches = userInfo.path.match(uuidRegex);
    const uuid = matches && matches.length >= 1 && matches[0];

    const grants = profileGrants.map(profileGrant => {
        if (profileGrant.grant.route.includes(':id') && uuid) {
            return profileGrant.grant.route.replace(':id', uuid);
        }
        if (profileGrant.grant.route.includes('?page') && uuid) {
            return profileGrant.grant.route.replace(':id', uuid);
        }
        return profileGrant.grant.route;
    });

    const index = grants.indexOf(userInfo.path);
    console.log(userInfo.path);
    console.log(grants);

    const filterableRoutes = profileGrants.map(profileGrant => profileGrant.grant.filterableRoute);

    if (index !== -1 && index <= filterableRoutes.length) {
        userInfo.isPremisons = true;
    }
};

// Middleware de autenticação
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).send({ error: "Token error" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: "Token malformatted" });
    }

    const userInfo = jwt.verify(token) as UserInfo;

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
        const profileGrantRepository = getRepository(ProfileGrant);

        // Encontre o perfil e grants associados
        const profileGrants = await profileGrantRepository.find({
            relations: ['grant'],
            where: { profile: { id: userInfo.profile_id } },
        });

        filterRoute(req.userInfo, profileGrants);

        if (req.userInfo.isPremisons) {
            return next();
        } else {
            return res.status(401).send({ error: "Sem permissão" });
        }
    }
};

export default authMiddleware;
