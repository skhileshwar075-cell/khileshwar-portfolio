import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import experienceRouter from "./experience";
import educationRouter from "./education";
import certificatesRouter from "./certificates";
import blogRouter from "./blog";
import contactsRouter from "./contacts";
import analyticsRouter from "./analytics";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(skillsRouter);
router.use(experienceRouter);
router.use(educationRouter);
router.use(certificatesRouter);
router.use(blogRouter);
router.use(contactsRouter);
router.use(analyticsRouter);
router.use(settingsRouter);
router.use(dashboardRouter);
router.use(publicRouter);

export default router;
