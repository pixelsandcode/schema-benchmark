const schema = {
    "type": "array",
    "items": {
        "$ref": "#/definitions/MySchemaElement"
    },
    "definitions": {
        "MySchemaElement": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "name": {
                    "type": "string"
                },
                "profile": {
                    "$ref": "#/definitions/Profile"
                }
            },
            "required": [
                "name",
                "profile"
            ],
            "title": "MySchemaElement"
        },
        "Profile": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "city": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                }
            },
            "required": [
                "city",
                "country"
            ],
            "title": "Profile"
        }
    }
}

export default schema;