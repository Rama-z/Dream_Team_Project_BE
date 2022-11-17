const usersRepo = require("../repo/usersRepo");
const response = require("../helper/response");
const bcrypt = require("bcrypt");

const usersController = {
  editPassword: async (req, res) => {
    const body = req.body;
    const id = req.userPayload.user_id;
    console.log(id);

    try {
      const checkPwd = await usersRepo.getPassword(id);
      // console.log(checkPwd.rows[0]);
      const isValid = await bcrypt.compare(
        body.old_password,
        checkPwd.rows[0].password
      );
      //   console.log(isValid);

      if (isValid === false) {
        return response(res, { status: 403, message: "Old password is wrong" });
      }

      const password = await bcrypt.hash(body.new_password, 10);
      await usersRepo.editPassword(password, id);
      return response(res, {
        status: 200,
        message: "Password has been changed",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal service error",
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const result = await usersRepo.getUserProfile(req.userPayload.user_id);
      return response(res, {
        status: 200,
        data: result.rows,
        message: "Get success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const id = req.userPayload.user_id;
      let body = req.body;
      console.log(req.file);

      if (req.file) {
        const image = `${req.file.secure_url}`;
        body = { ...body, image };
      }

      const result = await usersRepo.editUsers(bpdy, id);
      return response(res, {
        status: 200,
        data: { id, ...body },
        message: "Edit profile success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = usersController;
