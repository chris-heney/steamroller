const isJsonString = ( val ) => {
    if (val.charAt(0) === '{' && val.charAt(val.length - 1) === '}'){
        return true
    }

    return false
}

export default isJsonString