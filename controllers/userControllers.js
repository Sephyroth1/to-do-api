import bcryptjs from "bcryptjs";

export const getAllUsers = async (request, reply) => {
	console.log(request.server.mysql);
	const connection = await request.server.mysql.getConnection();
	try {
		const [query] = await connection.query("SELECT * FROM user");
		return reply.status(200).send(query);
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

async function getUserById(request, reply) {
	const connection = await request.server.mysql.getConnection();
	try {
		const { user_id } = request.params; // Corrected destructuring
		const [query] = await connection.query(
			"SELECT * FROM user WHERE user_id = ?",
			[user_id]
		);
		if (query.length <= 0) {
			return reply.status(404).send({ message: "User not found" });
		}
		return reply.status(200).send(query[0]);
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
}

async function createUser(request, reply) {
	const connection = await request.server.mysql.getConnection();
	try {
		const { username, email, password } = request.body;

		// Hash the password before insertion
		const hashedPassword = await bcryptjs.hash(password, 10);

		const [result] = await connection.query(
			"INSERT INTO user (username, email, password) VALUES (?, ?, ?)", // Corrected SQL syntax
			[username, email, hashedPassword]
		);
		if (result.affectedRows <= 0) {
			return reply.status(400).send({ message: "Internal Insertion Error" });
		}
		return reply
			.status(201) // Use 201 for successful resource creation
			.send({ message: "User created successfully", userId: result.insertId });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
}

async function updateUserDetails(request, reply) {
	const connection = await request.server.mysql.getConnection();
	try {
		const { username, email, password } = request.body;
		const { user_id } = request.params;

		// Check if user exists
		const [userQuery] = await connection.query(
			"SELECT * FROM user WHERE user_id = ?",
			[user_id]
		);

		if (userQuery.length <= 0) {
			return reply.status(404).send({ message: "User not found" });
		}

		// Hash the new password if provided
		const newHashedPassword = password
			? await bcryptjs.hash(password, 10)
			: userQuery[0].password; // Keep the existing password if no new one is provided

		const newUsername = username || userQuery[0].username;
		const newEmail = email || userQuery[0].email;

		const [update] = await connection.query(
			"UPDATE user SET username = ?, email = ?, password = ? WHERE user_id = ?", // Corrected SQL syntax
			[newUsername, newEmail, newHashedPassword, user_id]
		);

		if (update.affectedRows <= 0) {
			return reply.status(204).send();
		}

		return reply.status(200).send({ message: "User updated successfully" });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
}

async function deleteUser(request, reply) {
	const connection = await request.server.mysql.getConnection();
	try {
		const { user_id } = request.params;

		const [deleteResult] = await connection.query(
			"DELETE FROM user WHERE user_id = ?",
			[user_id]
		);
		if (deleteResult.affectedRows <= 0) {
			return reply
				.status(400)
				.send({ message: "User not found or could not be deleted" });
		}
		return reply.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
}

export default {
	getAllUsers,
	getUserById,
	createUser,
	updateUserDetails,
	deleteUser,
};
