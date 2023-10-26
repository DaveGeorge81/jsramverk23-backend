const fetch = require('node-fetch');

function getQuery() {
    return `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY objecttype="ReasonCode" schemaversion="1">
            <INCLUDE>Code</INCLUDE>
            <INCLUDE>Level1Description</INCLUDE>
            <INCLUDE>Level2Description</INCLUDE>
            <INCLUDE>Level3Description</INCLUDE>
        </QUERY>
    </REQUEST>`;
}

const codes = {
    getCodes: async function getCodes(req, res=undefined,) {
        if (res === undefined && process.env.NODE_ENV === 'test') {
            const response = await require(
                "../db/mockCode.json");

            return response;
        }
        const query = getQuery();

        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            });
        const result = await response.json();

        if (res === undefined) {
            return result.RESPONSE.RESULT[0].ReasonCode;
        }
        return res.json({
            data: result.RESPONSE.RESULT[0].ReasonCode
        });
    }
};

module.exports = codes;
