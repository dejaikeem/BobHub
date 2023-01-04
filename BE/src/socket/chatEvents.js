const { getPublicRooms } = require("./socketUtil.js");
const { logger } = require("../utils");

module.exports = (io, socket) => {
  const check = () => {
    logger.info("Sid", io.sockets.adapter.sids);
    logger.info("Rooms", io.sockets.adapter.rooms);
  };

  const giveRooms = () => {
    socket.emit("giveRooms", getPublicRooms(io));
  };

  const enterRoom = (roomName, partyId, moveRoom) => {
    const welcome = `${socket.nickname}님이 방에 입장하셨습니다.`;
    const roomkey = `${roomName}/${partyId}`
    socket.join(roomkey);
    moveRoom(roomkey);
    const messageInfo = { userId: 0, userName: "", message: welcome };
    socket.to(roomkey).emit("getMessage", messageInfo);
  };

  const sendMessage = (messageInfo, roomKey, addMessage) => {
    socket.to(roomKey).emit("getMessage", messageInfo);
    addMessage(messageInfo);
  };

  const disconnect = () => {
    logger.info("socket is disconnecting");
  };

  const disconnecting = () => {
    logger.info("socket is disconnected");
  };

  const setNickName = (nickname) => {
    if (!nickname) return;
    socket["nickname"] = nickname;
  };

  const leaveRoom = (roomKey) => {
    socket.leave(roomKey);
    const message = `${socket.nickname}님이 방을 나가셨습니다.`;
    const messageInfo = { userId: 0, userName: "", message };
    io.sockets.to(roomKey).emit("getMessage", messageInfo);
  };

  socket.on("getRoomList", giveRooms);
  socket.on("enterRoom", enterRoom);
  socket.on("leaveRoom", leaveRoom);
  socket.on("sendMessage", sendMessage);
  socket.on("disconnecting", disconnecting);
  socket.on("disconnected", disconnect);
  socket.on("nickname", setNickName);
};
