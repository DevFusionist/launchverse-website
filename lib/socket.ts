const { Server: NetServer } = require("http");
const { Server: SocketIOServer } = require("socket.io");

interface RoomUser {
  userId: string;
  socketId: string;
  isSpeaker: boolean;
  hasStream: boolean;
  displayName?: string; // Add display name for better UI
}

interface SignalData {
  type: "offer" | "answer" | "ice-candidate" | "stream-update";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  targetId: string;
  senderId: string;
  hasStream?: boolean;
  hasAudio?: boolean; // Track audio state
  hasVideo?: boolean; // Track video state
}

interface RoomState {
  users: Map<string, RoomUser>;
  activeSpeaker?: string; // Track active speaker
  createdAt: number;
}

type SocketIO = typeof import("socket.io");
type Socket = InstanceType<SocketIO["Socket"]>;
type Server = InstanceType<SocketIO["Server"]>;

class SocketManager {
  private static instance: SocketManager;
  private io: Server | null = null;
  private rooms = new Map<string, RoomState>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }

    return SocketManager.instance;
  }

  initialize(server: typeof NetServer): Server {
    if (!this.io) {
      const io = new SocketIOServer(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
        path: "/api/socketio",
      });

      this.setupSocketHandlers(io);
      this.io = io;

      // Setup room cleanup interval
      this.heartbeatInterval = setInterval(
        () => this.cleanupInactiveRooms(),
        60000
      );
    }

    return this.io!;
  }

  private cleanupInactiveRooms() {
    const now = Date.now();
    const ROOM_TIMEOUT = 3600000; // 1 hour in milliseconds

    this.rooms.forEach((state, roomId) => {
      if (now - state.createdAt > ROOM_TIMEOUT && state.users.size === 0) {
        console.log(`Cleaning up inactive room: ${roomId}`);
        this.rooms.delete(roomId);
      }
    });
  }

  private setupSocketHandlers(io: Server) {
    io.on("connection", (socket: any) => {
      console.log("Client connected:", socket.id);

      // Handle room joining
      socket.on(
        "join-room",
        (
          roomId: string,
          userId: string,
          isSpeaker: boolean,
          displayName?: string
        ) => {
          this.handleJoinRoom(socket, roomId, userId, isSpeaker, displayName);
        }
      );

      // Handle room leaving
      socket.on("leave-room", (roomId: string, userId: string) => {
        this.handleLeaveRoom(socket, roomId, userId);
      });

      // Handle WebRTC signaling
      socket.on("signal", (data: SignalData) => {
        this.handleSignal(socket, data);
      });

      // Handle stream state updates
      socket.on(
        "stream-state-update",
        (roomId: string, hasAudio: boolean, hasVideo: boolean) => {
          this.handleStreamStateUpdate(socket, roomId, hasAudio, hasVideo);
        }
      );

      // Handle active speaker detection
      socket.on("active-speaker", (roomId: string, speakingLevel: number) => {
        this.handleActiveSpeaker(socket, roomId, speakingLevel);
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });

      // Handle ping for connection health
      socket.on("ping", (callback: Function) => {
        if (typeof callback === "function") {
          callback();
        }
      });
    });
  }

  private handleSignal(socket: any, data: SignalData) {
    if (!data.type || !data.targetId || !data.senderId) {
      console.error("Invalid signal data:", data);
      return;
    }

    const targetSocket = this.io?.sockets.sockets.get(data.targetId);

    if (!targetSocket) {
      console.error("Target socket not found:", data.targetId);
      return;
    }

    // Update stream state when receiving offer or stream update
    if (data.type === "offer" || data.type === "stream-update") {
      const roomId = this.findUserRoom(socket.id);
      if (roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
          const user = room.users.get(socket.id);
          if (user) {
            const hasStream =
              data.type === "stream-update" ? data.hasStream! : true;
            const hasAudio =
              data.hasAudio !== undefined ? data.hasAudio : user.hasStream;
            const hasVideo =
              data.hasVideo !== undefined ? data.hasVideo : user.hasStream;

            user.hasStream = hasStream;

            // Notify others about stream availability
            socket.to(roomId).emit("user-stream-update", {
              socketId: socket.id,
              hasStream,
              hasAudio,
              hasVideo,
            });
          }
        }
      }
    }

    // Forward the signal to the target peer
    targetSocket.emit("signal", {
      ...data,
      senderId: socket.id,
    });

    console.log(`Signal ${data.type} from ${socket.id} to ${data.targetId}`);
  }

  private findUserRoom(socketId: string): string | null {
    for (const [roomId, room] of Array.from(this.rooms.entries())) {
      if (room.users.has(socketId)) {
        return roomId;
      }
    }
    return null;
  }

  private handleStreamStateUpdate(
    socket: any,
    roomId: string,
    hasAudio: boolean,
    hasVideo: boolean
  ) {
    const room = this.rooms.get(roomId);
    if (room) {
      const user = room.users.get(socket.id);
      if (user) {
        const hasStream = hasAudio || hasVideo;
        user.hasStream = hasStream;

        // Notify others about stream state
        socket.to(roomId).emit("user-stream-update", {
          socketId: socket.id,
          hasStream,
          hasAudio,
          hasVideo,
        });
      }
    }
  }

  private handleActiveSpeaker(
    socket: any,
    roomId: string,
    speakingLevel: number
  ) {
    const room = this.rooms.get(roomId);
    if (room && speakingLevel > 0.2) {
      // Threshold for considering someone as speaking
      room.activeSpeaker = socket.id;
      socket.to(roomId).emit("active-speaker-update", socket.id);
    }
  }

  handleJoinRoom(
    socket: any,
    roomId: string,
    userId: string,
    isSpeaker: boolean,
    displayName?: string
  ) {
    socket.join(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        users: new Map<string, RoomUser>(),
        createdAt: Date.now(),
      });
    }

    const room = this.rooms.get(roomId)!;
    const user: RoomUser = {
      userId,
      socketId: socket.id,
      isSpeaker,
      hasStream: false,
      displayName: displayName || userId,
    };

    room.users.set(socket.id, user);

    // Notify others about the new user
    socket.to(roomId).emit("user-joined", user);

    // Send current room state to the new user
    const users = Array.from(room.users.values());

    socket.emit("room-users", users);

    // Send active speaker if exists
    if (room.activeSpeaker) {
      socket.emit("active-speaker-update", room.activeSpeaker);
    }

    console.log(
      `User ${userId} joined room ${roomId} as ${isSpeaker ? "speaker" : "listener"}`
    );
  }

  handleLeaveRoom(socket: any, roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      const user = room.users.get(socket.id);

      if (user) {
        // Notify others about user leaving
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
          userId: user.userId,
        });
      }

      room.users.delete(socket.id);

      // Update active speaker if needed
      if (room.activeSpeaker === socket.id) {
        room.activeSpeaker = undefined;
      }

      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      } else {
        // Notify remaining users with updated room state
        const remainingUsers = Array.from(room.users.values());

        socket.to(roomId).emit("room-users", remainingUsers);
      }
    }

    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId}`);
  }

  handleDisconnect(socket: any) {
    console.log("Client disconnected:", socket.id);

    // Find and cleanup all rooms the user was in

    for (const roomId of Array.from(this.rooms.keys())) {
      const room = this.rooms.get(roomId);
      if (room) {
        const user = room.users.get(socket.id);

        if (user) {
          this.handleLeaveRoom(socket, roomId, user.userId);
        }
      }
    }
  }

  getIO(): Server | null {
    return this.io;
  }

  getRoomUsers(roomId: string): RoomUser[] {
    const room = this.rooms.get(roomId);

    return room ? Array.from(room.users.values()) : [];
  }

  getRoomInfo(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      participants: Array.from(room.users.values()),
      activeSpeaker: room.activeSpeaker,
      createdAt: room.createdAt,
    };
  }
}

module.exports = {
  socketManager: SocketManager.getInstance(),
};
