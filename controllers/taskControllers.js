export const getAllTasksAllUsers = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const [rows] = await connection.query(
			"select title, description from tasks"
		);

		return reply
			.status(200)
			.send({ message: "Tasks Fetched Successfully", rows });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const getAllTasksOfUser = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { user_id } = req.query;
		const [rows] = await connection.query(
			"select title, description from tasks where user_id = ?",
			[user_id]
		);
		if (rows.length === 0) {
			return reply.status(400).send({ message: "Internal Error" });
		}
		return reply
			.status(200)
			.send({ message: "Task details fetched successfully", rows });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const getTaskById = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { task_id, user_id } = req.body;
		const [rows] = await connection.query(
			"select title, description from tasks where task_id = ? and user_id = ?",
			[task_id, user_id]
		);
		if (rows.length === 0) {
			return reply.status(404).send({ message: "Task not foun" });
		}
		return reply
			.status(200)
			.send({ message: "Task Fetched Successfully", rows });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const createTaskByUserId = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { user_id } = req.query;
		const { title, description } = req.body;
		const createdAt = new Date();
		const updatedAt = createdAt;
		if (!user_id || !title) {
			return reply
				.status(400)
				.send({ message: "Both User_Id and title are required" });
		}
		const [rows] = await connection.query(
			"insert into tasks (user_id, title, description, createdAt, updatedAt) values (?, ?, ?, ?, ?)",
			[user_id, title, description, createdAt, updatedAt]
		);
		if (rows.affectedRows <= 0) {
			return reply
				.status(400)
				.send({ message: "Task not inserted into database" });
		}

		return reply
			.status(201)
			.send({ message: "Task successfully Created", rows });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const updateTaskDetails = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { user_id } = req.query;
		const { task_id } = req.params;
		const { title, description } = req.body;
		const updatedAt = new Date();
		const [user] = await connection.query(
			"select title, description from tasks where task_id = ?",
			[task_id]
		);
		if (user.length === 0) {
			return reply.status(404).send({ message: "Task Cannot be found" });
		}
		const newTitle = title ? title : user[0].title;
		const newDescription = description ? description : user[0].description;
		const [rows] = await connection.query(
			"update tasks set title = ? description = ? updatedAt = ? where task_id = ? and user_id = ?",
			[newTitle, newDescription, updatedAt, task_id, user_id]
		);
		if (rows.affectedRows === 0) {
			return reply.status(400).send({ message: "Task Cannot be Updated" });
		}
		return reply.status(200).send({ message: "Task updated successfully" });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const deleteSingleTaskById = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { user_id } = req.query;
		const { task_id } = req.params;
		const [rows] = await connection.query(
			"delete from tasks where task_id = ? user_id = ?",
			[task_id, user_id]
		);
		if (rows.affectedRows === 0) {
			return reply.status(400).send({ message: "Task Deleted Successfully" });
		}
		return reply.status(200).send({ message: "Task Deleted Successfully" });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};

export const deleteAllTaskOfUser = async (req, reply) => {
	const connection = await req.server.mysql.getConnection();
	try {
		const { user_id } = req.query;
		const [query] = await connection.query(
			"delete from tasks where user_id = ?",
			[user_id]
		);
		if (query.length === 0) {
			return reply
				.status(400)
				.send({ message: "All Tasks of a user is not deleted" });
		}
		return reply.status(200).send({ message: "Tasks deleted Successfully" });
	} catch (error) {
		return reply
			.status(500)
			.send({ error: "Internal Server Error", details: error.message });
	} finally {
		connection.release();
	}
};
