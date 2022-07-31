const translateBoolean = ( val ) => {
    if ( val === 'true' ) return 'Yes'
    if ( val === 'false' ) return 'No'
    return val
}

export default translateBoolean