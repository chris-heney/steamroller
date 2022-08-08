const stripArray = ( val ) => {
    if ( val.charAt(0) === '[' && val.charAt( val.length - 1 ) === ']' ) return ''
    return val
}

export default stripArray