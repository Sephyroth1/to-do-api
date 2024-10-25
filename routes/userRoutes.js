import userControllers from "../controllers/userControllers.js";
async function userRoutes(fastify) {
	// Route to get all users
	fastify.get("/user", userControllers.getAllUsers);

	// Route to get user by ID with validation
	fastify.get(
		"/user/:user_id",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "integer" }, // Ensuring the ID is an integer
					},
					required: ["user_id"],
				},
			},
		},
		userControllers.getUserById
	);

	// Route to create a new user
	fastify.post(
		"/user",
		{
			schema: {
				body: {
					type: "object",
					properties: {
						username: { type: "string" },
						email: { type: "string" },
						password: { type: "string" },
					},
					required: ["username", "email", "password"], // Ensure these fields are provided
				},
			},
		},
		userControllers.createUser
	);

	// Route to update user details with validation
	fastify.put(
		"/user/:user_id",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "integer" },
					},
					required: ["user_id"],
				},
				body: {
					type: "object",
					properties: {
						username: { type: "string" },
						email: { type: "string" },
						password: { type: "string" },
					},
				},
			},
		},
		userControllers.updateUserDetails
	);

	// Route to delete a user by ID with validation
	fastify.delete(
		"/user/:user_id",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "integer" },
					},
					required: ["user_id"],
				},
			},
		},
		userControllers.deleteUser
	);
}

export default userRoutes;
