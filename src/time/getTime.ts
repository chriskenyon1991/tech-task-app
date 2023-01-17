import axios from "axios"

export const getTime = async () => {
    const url = 'http://localhost:7000/time'
    axios.get(url, {headers:{'Authorization': 'mysecrettoken'}}).then((response) => {
      return response.data.epoch
    }).catch((err) => {
      console.log(err)
    })
}