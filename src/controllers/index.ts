import { ContactService } from "../services/contact.service";
import { RecoverPasswordService } from "../services/password.service";
import { SessionService } from "../services/session.service";
import { UserService } from "../services/user.service";
import { ContactController } from "./contact.controller";
import { RecoveryPasswordController } from "./password.controller";
import { SessionController } from "./session.controller";

import { UserController } from "./user.controller";

const userService = new UserService();
const userController = new UserController(userService);
const sessionService = new SessionService();
const sessionController = new SessionController(sessionService);
const contactService = new ContactService();
const contactController = new ContactController(contactService);
const recoveryPasswordService = new RecoverPasswordService();
const recoveryPasswordController = new RecoveryPasswordController(recoveryPasswordService);


export { userController, sessionController, contactController, recoveryPasswordController };
