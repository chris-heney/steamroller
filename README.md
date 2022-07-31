# Steamroller

Many times we are challenged with (sometimes deeply) nested data structures we just need to be unnormalized.
Steamroller is a JavaScript utility function built to take nested data in different formats, and flatten it.

At it's core, Steamroller is a recrusive deserialization utility that will add aditional columns to CSV files, or
additional properties to JSON objects, aditional nodes to XML Node Lists, etc, using a dash-deliminated representation
of the pre-existing hierarchy expanding them to represent 2-demensional data.

Object properties/column-headings are expanded using concatinated strings (see data example below).



## Conversion Utopia (Long Term Roadmap)

Steamroller should be able to denormalize fields-within-fields to spite the format if it is archetected and decoupled
correctly.

It might not be possible, but the long term goal would be to support an ANY-ANY format.  Currently, I am dealing with
"Stringified JSON" as "CSV Fields", but it just as well could be XML in my CSV, or even CSV in my XML, or JSON in XML,
and so on.

**Crazy Examples**
 - Hierarchal XML DATA Document nested in CSV File's field.
 - Hierarchal XML DATA Document nested in Hierarchal JSON field
 - Hierarchal JSON DATA Document nested in XML field.

But why would anyone want this or need this?  See Inspiration section below


## Contribution

All contribution is welcome.  I've been developing for 20 years, but never in an open source environment.  I am open to
advise, assistence in repository management, community communication, or otherwise.



## Usage (roadmap)

Currently only `node steamroller.js` (relatively) works, and only for JSON Strings Embedded in CSV Files.  But it would be
nice if we could invoke it providing several options.

`npm install`

`node steamroller` 


Future (single file): 

`node steamroller --strip-null --translate-boolean --data-format="csv" --export-format="xml" source-file.csv destination-file.csv`


Future (directory of files): 

`node flatten --translate-boolean --data-format="json" --export-format="csv" ./source-directory ./destination-directory`


Future (from API): 

`node flatten --strip-null --data-format="csv" --export-format="xml" ./source-directory ./destination-directory`



## Options / Middleware (roadmap)

Currently `translate-boolean` and `strip-null` are in `/lib` and activated by default as I need them for a current
project.  But it would be nice to have a composer-style autoloader of some sort that would dynamically include and
execute these "filters" as middleware.

 - strip-null
 - translate-boolean
 - recursion-depth
 - verbose



## Data Example - v1 (CSV Format)

*Note: In the example below, I am not able to use curly braces to represent JSON object, instead I will use square brackets as they are allowed [ ]*

Current Export Example (bad / compressed):

    "id","name","phone","email","address"
    "1",'John Doe","(555) 555-5555","john.doe@gmail.com","['line1':'123 Noname St', 'city':'Dallas','state':'TX','zip':'75023']"

Desired Export Example (good / expanded):

    "id","name","phone","email","address-line1","address-city","address-state","address-zip"
    "1",'John Doe","(555) 555-5555","john.doe@gmail.com","123 Noname St","Dallas","TX","75023"

Because of the recursive support, a nested concatination heading would look like, e.g.: `meta-weight-lbs` and `meta-weight-kgs`.



## Features Roadmap

The feature roadmap is going to be based on what the community would like to use it for.

 - Better Commenting
 - Add Typescript Support
 - Recursive Support
   - Data Format Agnostic Recursive Support
 - Improved Options
   - Concatination Character (e.g. Default: "-")
 - Cleaner Code Segmentation
 - Writing of tests
 - Smarter Command Line Usage
   - npx integration
   - package.json scripts section
 - Data Format Detection (e.g. by file extension)
   - Of filetype
   - Of nested serialization
     - PHP Serialization
     - Stringified JSON
 - Additional Data Formats
   - CSV
   - JSON
   - XML
   - SOAP
   - X11
 - Export Transforms (Data Format Conversions)



### Inspiration

Strapi is one of the biggest headless CMS platforms available, and the import/export features are terrible.  I hope to 
use this package in an improved export function which I will also make open source inspired by the community assistance
provided here.

Besides Strapi, I have in my programming life ran into the need to flatten data many times.  I hope this package is
useful to everyone.