import { FormData } from "../interface/interface";

const requestData = async (url: string, data: object) => {
    const response: Response = await fetch(url, data);
    return await response;
}

export default requestData;



