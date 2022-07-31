const fs = require('fs')
const parse = require('csv-parse').parse

// @TODO: PSR-Style Autoloading?
const stripNull = require('lib/strip-null')
const translateBoolean = require('lib/translate-boolean')
const isJsonString = require('lib/is-json-string')

const SRC_DIR = './test-data'
const DEST_DIR = './parsed-data'


/*
 * Recursive function supporting the denormalization of a stringified JSON object
 * 
 * @param component String A Stringified JSON object to be parsed & flattened
 * @param componentId String The property name to be concatinated as the new flattened property name
 * @param compilation Object The proverbially snowball meant to expand a CSV object
 * @returns compilation Object A container object with the expanded row-headings and array of exanded column-values
 * 
 * @TODO: Abstract this into export
 * @TODO: Create universal conversion method if possible (instead of making a breakdown for every to-from combination)
 */
function breakdownJSONComponentForCSV( component, componentId, compilation ){

    component = JSON.parse( component )

    if ( ! compilation ){
        compilation = {
            headings: [],
            rows:[]
        }
    }

    const fieldCount = Object.keys( component ).length

    compilation.rows.push( [] )

    for ( const prop in component ){

        // Detect nested component-as-string and recurse!
        if ( isJsonString( component[prop] ) ){
            let newCompilation = breakdownJSONComponentForCSV( component[prop], componentId + '-' + prop, compilation )

            // @TODO: my initial dataset did not have any nested components, so recursion was not required, but it
            //        would be a really great feature.  To do this: merge headings and rows from the newCompilation
            //        object to the recursing compilation object before the 'continue'-ing to the next property of the
            //        (relatively) initial component

            continue
        }

        if ( fieldCount > compilation.headings.length ){
            compilation.headings.push( componentId + '-' + prop )
        }

        compilation.rows[ row.length - 1 ].push( component[prop] )
    }

    return compilation
}


function flattenJson( srcFilename ){

    console.log( 'Parsing JSON' )

    try {
        const data = fs.readFileSync( SRC_DIR + '/' + srcFilename, 'utf8' )
    } catch ( err ){
        console.error( err )
    }
}

function flattenCsv( srcFilename ){

    try {

        console.log( 'Parsing CSV' )

        parse( 
            fs.readFileSync( SRC_DIR + '/' + srcFilename, 'utf8' ),
            {}, ( err, rows ) => {

                const originalRowLength = rows.length

                rows.forEach( ( row, i ) => {

                    if ( i === 2 ){
                        console.log(row)
                    }

                    row.forEach( ( col, j ) => {

                        col = stripNull( col )
                        col = translateBoolean( col )

                        if (isJsonString(col)){

                            let component = breakdownJSONComponentForCSV( col, rows[0][j] )

                            // conditionally add additional headings
                            if ( rows[0].length < originalRowLength + component.length ){
                                rows[0].splice( j+1, 1, ...component.headings )
                            }

                            // Remove the compressed/serialized/stringified object and replace it with actual field-values
                            rows[i].splice( j+1, 1, ...component.rows )

                        }

                    } )

                })
            
                fs.writeFileSync( DEST_DIR + '/' + srcFilename, rows)
            }
        )
    } catch (err){
        console.error(err)
    }
}

// Directory Based Initialization
fs.readdir( SRC_DIR, ( err, files ) => {

    if ( err ){
        console.log( err )
        return
    }

    files.forEach( filename => {
        switch (filename.split('.').pop()){
            case 'json':
                flattenJson( filename )
                break
            case 'csv':
                flattenCsv( filename )
                break
        }
    })
})
