import { NextFunction, Request, Response, Router } from "express";
import * as UserDTO from "../src/apps/Auth/dto/user.dto";
import Grant from "./apps/Auth/model/Grant";
import Profile from "./apps/Auth/model/Profile";
import { grantService } from "./apps/Auth/service/GrantService";
import { profileService } from "./apps/Auth/service/ProfileService";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlmNzU0YmE3LTVkYWItNDJmOC1iYWZjLTE4ZTUxYTU3NTZmZiIsImVtYWlsIjoibmFvc2VpMDkwMUBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwicHJvZmlsZV9pZCI6IjY0NmQ3OTdiLTdjNjMtNGNjOC05NGE3LTIzZDdjNjYxNTUxMCIsImlhdCI6MTcyODUwMDczMiwiZXhwIjoxNzYwMDM2NzMyfQ.ykR62UXvDlZaN51kFANR8eSkEYCMxPpejHB1P0glfBg
const checkoutUserGrants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo: UserDTO.userInfo = req.body; // Supondo que o userInfo esteja no corpo da requisição
    const currentPath: string = userInfo.path;
    const userProfileId: string = userInfo.profile_id;
    const userGrants: Grant[] = userInfo.grants;

    // Carrega os perfis e permissões de forma assíncrona
    const profiles: Profile[] = await profileService.findAll();
    const grants: Grant[] = await grantService.findAll();

    // Encontra o perfil do usuário com base no ID
    const userProfile: Profile | undefined = profiles.find(
      (profile) => profile.id === userProfileId
    );

    // Filtra as permissões associadas ao perfil do usuário
    if (userProfile) {
      const profileGrants: Grant[] = grants.filter((grant) =>
        grant.associatedProfiles.some(
          (profile) => profile.id === userProfile.id
        )
      );

      // Exibe as permissões filtradas
      console.log("here 1");
      profileGrants.forEach((element) => {
        console.log(element);
      });
    } else {
      console.log("User profile not found.");
    }
    console.log("here 2");

    // Envia a resposta
    res.status(200).json({ message: "Grants checked." });
  } catch (error) {
    console.error(error);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};

const testRouter: Router = Router();
testRouter.get("/", checkoutUserGrants);

export default testRouter;
