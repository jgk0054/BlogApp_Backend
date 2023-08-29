const db = require('../db');

class Blog {
  static async findAllBlogs() {
    try {
      const queryText = `SELECT blogs.id, blogs.title, blogs.body, 
                          users.id as "userId", users.username, users.author_name, users.author_url, 
                          users.avatar_url, users.role
                        FROM blogs 
                        INNER JOIN users ON blogs.user_id = users.id
                        `;
      const res = await db.query(queryText);
      return res.rows;
    } catch (error) {
      console.error('Error occurred during fetching all blogs:', error);
      return null;
    }
  }

  static async createBlog(title, body, userId) {
    try {
      const insertQueryText = 'INSERT INTO blogs (title, body, user_id) VALUES ($1, $2, $3) RETURNING id';
      const insertRes = await db.query(insertQueryText, [title, JSON.stringify(body), userId]);

      if (insertRes.rows.length > 0) {
        const blogId = insertRes.rows[0].id;
        const fetchQueryText = `SELECT blogs.id, blogs.title, blogs.body, users.id as "userId", users.username 
                                FROM blogs 
                                INNER JOIN users ON blogs.user_id = users.id 
                                WHERE blogs.id = $1`;

        const fetchRes = await db.query(fetchQueryText, [blogId]);

        if (fetchRes.rows.length > 0) {
          return fetchRes.rows[0];
        }
      }

      return null;
    } catch (error) {
      console.error('Error occurred during blog creation:', error);
      return null;
    }
  }

  static async updateBlog(id, title, body, userId) {
    try {
      // First, fetch the existing blog to check the userId
      const fetchQueryText = 'SELECT user_id FROM blogs WHERE id = $1';
      const fetchRes = await db.query(fetchQueryText, [id]);

      if (fetchRes.rows.length === 0) {
        // Blog not found
        return null;
      }

      const existingUserId = fetchRes.rows[0].user_id;

      if (existingUserId !== userId) {
        // Unauthorized: userId doesn't match the existing userId associated with the blog
        return { message: 'Unauthorized' };
      }

      // Proceed with the update
      const updateQueryText = 'UPDATE blogs SET title = $1, body = $2, user_id = $3 WHERE id = $4 RETURNING *';
      const updateRes = await db.query(updateQueryText, [title, JSON.stringify(body), userId, id]);

      if (updateRes.rows.length > 0) {
        return updateRes.rows[0];
      } else {
        return null;
      }

    } catch (error) {
      console.error('Error occurred during blog update:', error);
      return null;
    }
  }

  static async deleteBlog(id) {
    try {
      const queryText = 'DELETE FROM blogs WHERE id = $1 RETURNING *';
      const res = await db.query(queryText, [id]);

      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error occurred during blog deletion:', error);
      return null;
    }
  }

  static async findBlogById(id) {
    try {
      const queryText = `
            SELECT blogs.id, blogs.title, blogs.body, users.* as "user" 
            FROM blogs 
            INNER JOIN users ON blogs.user_id = users.id 
            WHERE blogs.id = $1
        `;
      const res = await db.query(queryText, [id]);

      if (res.rows.length > 0) {
        // Structuring the result to have the entire user object
        const blog = res.rows[0];
        const user = {
          id: blog.userId,
          username: blog.username,
          author_name: blog.author_name,
          avatar_url: blog.avatar_url
          // ... add other user fields here
        };

        return {
          id: blog.id,
          title: blog.title,
          body: blog.body,
          user: user,
          // ... add other blog fields if any
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error occurred during fetching the blog by id:', error);
      return null;
    }
  }

}


module.exports = Blog;
