/**
 * Payload Object to be signed and verified by JWT. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId: string
 * @param name: string
 * @param instagram: string
 * @param phone: string
 * @param email: string
 * @param location: string
 */
type Create = {
    userId: string;
    name: string;
    instagram: string;
    phone: string;
    email: string;
    location: {
        latitude: number;
        longitude: number;
    };
  };
  
  export default Create;
  