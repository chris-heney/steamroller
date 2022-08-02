import fs from 'fs'
import { parse } from 'csv-parse'

// @TODO: PSR-Style Autoloading?
import stripNull from './lib/strip-null.js'
import translateBoolean from './lib/translate-boolean.js'
import isJsonString from './lib/is-json-string.js'

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

    // compilation.rows.push( [] )

    for ( const prop in component ){


        // Detect nested component-as-string and recurse!
        if ( isJsonString( String( component[prop] ) ) ){
            let newCompilation = breakdownJSONComponentForCSV( component[prop], componentId + '-' + prop, compilation )

            // @TODO: my initial dataset did not have any nested components, so recursion was not required, but it
            //        would be a really great feature.  To do this: merge headings and rows from the newCompilation
            //        object to the recursing compilation object before the 'continue'-ing to the next property of the
            //        (relatively) initial component
            // @note: Use the same push/splice found in the original invoking function to produce the same working result

            continue
        }

        if ( fieldCount > compilation.headings.length ){
            compilation.headings.push( componentId + '-' + prop )
        }

        compilation.rows.push( component[prop] )
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

                let newRows = [];

                rows.forEach( ( row, i ) => {

                    newRows.push( [] )

                    row.forEach( ( col, j ) => {

                        let val = stripNull( String( col ) )
                        val = translateBoolean( val )

                        
                        if ( isJsonString( val ) ){

                            let component = breakdownJSONComponentForCSV( col, rows[0][j] )

                            // conditionally add additional headings
                            if ( newRows[0].length < rows[i].length + component.headings.length ){
                                console.log('Added ' + component.headings.length + ' column headings at index: ' + j)
                                newRows[0].splice( j+1, 0, ...component.headings )
                            }

                            // Remove the compressed/serialized/stringified object and replace it with actual field-values
                            newRows[i].push( ...component.rows )

                        } else {
                            newRows[i].push( val )
                        }

                    } )

                })

                let csvContent = newRows.map(e => e.join(",")).join("\n")
                fs.writeFileSync( DEST_DIR + '/' + srcFilename, csvContent)
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
