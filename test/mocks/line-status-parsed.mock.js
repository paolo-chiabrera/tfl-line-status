export default {
    "ArrayOfLineStatus": {
        "$": {
            "xmlns": "http://webservices.lul.co.uk/",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
        },
        "LineStatus": [{
            "$": {
                "ID": "0",
                "StatusDetails": ""
            },
            "BranchDisruptions": [""],
            "Line": {
                "$": {
                    "ID": "1",
                    "Name": "Bakerloo"
                }
            },
            "Status": {
                "$": {
                    "CssClass": "GoodService",
                    "Description": "Good Service",
                    "ID": "GS",
                    "IsActive": "true"
                },
                "StatusType": {
                    "$": {
                        "Description": "Line",
                        "ID": "1"
                    }
                }
            }
        }, {
            "$": {
                "ID": "1",
                "StatusDetails": ""
            },
            "BranchDisruptions": [""],
            "Line": {
                "$": {
                    "ID": "2",
                    "Name": "Central"
                }
            },
            "Status": {
                "$": {
                    "CssClass": "GoodService",
                    "Description": "Good Service",
                    "ID": "GS",
                    "IsActive": "true"
                },
                "StatusType": {
                    "$": {
                        "Description": "Line",
                        "ID": "1"
                    }
                }
            }
        }]
    }
}
