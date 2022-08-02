const stripNull = ( val ) => {
    if ( val === '' ) return ''
    if ( val === 'null' ) return ''
    if ( val.charAt(0) === '[' && val.charAt(1) === ']' ) return ''
    return val
}

export default stripNull