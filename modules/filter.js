////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function filterMALGenerics(query, MALGenerics)
{
    const result = []
    const queryNew = query.toLowerCase()
    if (queryNew.length > 0)
    {
        for (const anime of MALGenerics)
        {
            if (anime.title.toLowerCase().includes(queryNew))
            {
                result.push(anime)
            }
            else
            {
                for (const synonym of anime.synonyms)
                {
                    if (synonym.toLowerCase().includes(queryNew))
                    {
                        result.push(anime)
                    }
                }
            }
        }
    }
    return result
}

module.exports =
{
    filterMALGenerics: filterMALGenerics
}