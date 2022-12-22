const { userService } = require("../services");

class UserController {
  async create(req, res, next) {
    try {
      const generation = parseInt(req.body.generation);
      const { track, name, email, nickName, password, phone } = req.body;
      const profile = req.file ? req.file.location : null;

      const addedUser = await userService.create({
        track,
        generation,
        name,
        email,
        nickName,
        password,
        phone,
        profile,
      });
      return res.status(200).json(addedUser);
    } catch (e) {
      next(e);
    }
  }
  async checkNickname(req, res, next) {
    try {
      const nickName = req.params.nickname;
      const result = await userService.checkNickname(nickName);
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getById(req, res, next) {
    try {
      const { userId } = req.user;
      const result = await userService.getById(userId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
  async getAllByAdmin(req, res, next) {
    try {
      const users = await userService.getAllByAdmin();

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const userDTO = req.user;
      const generation = parseInt(req.body.generation);

      const { track, name, nickName, newPassword, password, phone } = req.body;
      const exUserDTO = {
        track,
        generation,
        name,
        nickName,
        newPassword,
        password,
        phone,
      };
      const result = await userService.update(exUserDTO, userDTO);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateImage(req, res, next) {
    try {
      const newProfile = req.file ? req.file.location : null;
      if (!newProfile) throw new Error("요청 오류, 이미지 없음");

      const userDTO = req.user;
      const result = await userService.updateImage(newProfile, userDTO);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateByAdmin(req, res, next) {
    try {
      const userId = parseInt(req.params.userId);
      const { nickName, role } = req.body;
      const newUserDTO = { nickName, role };
      const result = await userService.updateByAdmin(newUserDTO, userId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const userDTO = req.user;
      const result = await userService.delete(userDTO);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

const userController = new UserController();

module.exports = { userController };
