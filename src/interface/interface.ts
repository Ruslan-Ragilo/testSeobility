export type FormData = {
    fullName: string,
    email: string,
    phone: string,
    date: string,
    messages: string,
}

export type ResponseState = { 
    message: string,
}

export type validData = {
        isError: boolean,
        errorMessage: string,
}
