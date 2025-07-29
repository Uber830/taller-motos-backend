export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    avatar?: string | null;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    // Agrega otros campos relevantes según tu modelo de usuario
} 