import fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyCors from "@fastify/cors";
import fastifyMysql from "@fastify/mysql";
import fastifyJwt from "@fastify/jwt";
import userRoutes from "./routes/userRoutes.js";
import { configDotenv } from "dotenv";

configDotenv();

const app = fastify({
	logger: true,
});
const PORT = process.env.PORT || 3000;

await app.register(fastifyMysql, {
	promise: true,
	host: "localhost",
	user: "Sudhamshu",
	password: "admin",
	database: "tododb",
});

await app.register(fastifyMiddie, {
	hook: "onRequest",
});

await app.register(fastifyCors, {
	origin: true,
});

await app.register(fastifyJwt, {
	secret: process.env.SECRET,
});

app.get("/", (req, res) => {
	res.send({ hello: "world" });
});

await app.register(userRoutes, { prefix: "/api/" });

const startServer = async () => {
	try {
		await app.listen({ port: PORT });
		app.log.info(`Server is running on the port: ${app.server.address().port}`);
	} catch (error) {
		app.log.error(error.message);
		process.exit(1);
	}
};

startServer();
