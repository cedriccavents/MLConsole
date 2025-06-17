import axios from "axios";

const baseUrl = 'http://localhost:3000/api'

const getData = async (name) => {
    const response = await axios.get(`${baseUrl}/data/${name}`)
    return response
}

const getCorrelations = async (name, feature) => {
    const response = await axios.get(`${baseUrl}/correlations/${name}/${feature}`)
    return response
}

const createVariables = async (vars) => {
    const response = await axios.post(`${baseUrl}/variables`, vars)
    return response
}
const getModel = async (name, subName=null) => {
    let baseUrlNew = `${baseUrl}/models/${name}`
    if (subName){
        baseUrlNew = `${baseUrlNew}/${subName}`
    }
    const response = await axios.get(`${baseUrlNew}`)
    return response
}

export default { getData, createVariables, getModel, getCorrelations }