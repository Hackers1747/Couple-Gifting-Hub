import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cardsRouter from "./cards";
import paymentRouter from "./payment";
import aiRouter from "./ai";
import trackRouter from "./track";
import whatsappRouter from "./whatsapp";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/cards", cardsRouter);
router.use("/payment", paymentRouter);
router.use("/ai", aiRouter);
router.use("/track", trackRouter);
router.use("/whatsapp", whatsappRouter);

export default router;
