import { io } from "socket.io-client";


const SOCKET_URL = 'https://dreamchild-62ce4a3c90d9.herokuapp.com';
// const SOCKET_URL = 'https://ricedeal.onrender.com';


class WSService {


    /* initialzeSocket = async (userId) => {
        // const authContext = useContext(AuthContext)
        // console.log(userId)

        try {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                query: {
                    userId: userId
                }
            })

            // console.log('initialzing socket', this.socket);
            console.log('initialzing socket',);


            this.socket.on("connect", (data) => {
                console.log("=== socket connectd ===");
                // console.log("data: ", data);
            })
            this.socket.on("disconnect", (data) => {
                console.log("=== socket disconnected ===");
            })
            this.socket.on("error", (data) => {
                console.log("=== socket error ===");
            })
        } catch (error) {
            console.log("=== socket is not initialized ===", error);

        }
    } */
    initialzeSocket = async (userId) => {
        if (this.socket && this.socket.connected) {
            console.warn("Socket already connected!");
            return;
        }

        try {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                query: { userId }
            });

            console.log('Initializing socket...');

            this.socket.on("connect", () => {
                console.log("=== Socket connected ===");
            });

            this.socket.on("disconnect", () => {
                console.log("=== Socket disconnected ===");
            });

            this.socket.on("error", (error) => {
                console.error("=== Socket error ===", error);
            });
        } catch (error) {
            console.error("=== Socket initialization failed ===", error);
        }
    };

    on(event, data = {}) {
        this.socket?.on(event, data)
    }

    emit(event, cb) {
        this.socket.emit(event, cb)
    }

    removeListener(listName) {
        this.socket.removeListener(listName)
    }

    disconnectSocket = () => {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null; // Prevent duplicate connections
            console.log("=== Socket manually disconnected ===");
        }
    }
}

const socketServices = new WSService();
export default socketServices;