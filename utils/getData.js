import axios from 'axios';

export const GetData = async (url,method,postdata=null) => {
    if(method === 'get'){
        try {
          const response = await axios.get(`${url}`);
          console.log(response.status, "aaaaaaa");
          console.log(response.data.data, "bbbbbb");
            if(response){
                return {
                    status: response.status,
                    data: response.data.data
                }
            }
        } catch (error) {

          console.log(error.response.status, "cccccc");
          console.log(error.response.data.data, "ddddd");
            return {
                status: error.response.status,
                data:error.response.data.data,
            }
        }
    } else {
        try {
            const response = await axios.post(`${url}`, postdata);
            console.log(response.status, "eeeeee");
            console.log(response.data.data, "fffffff");
            if(response){
                return {
                    status: response.status,
                    data: response.data.data
                }
            }
        } catch (error) {
          console.log(error.response.status, "ggggg");
          console.log(error.response.data.data, "hhhhhh");
            return {
                status: error.response.status,
                data: error.response.data.data
            }
        }
    }
}