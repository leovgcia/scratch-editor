const manifests = {
    "Request": {
        "color": "rgb(9, 125, 9)",
        "description": "Descripción genérica de la clase.",
        "author": "kouraecommunity",
        "blocks": [
            {
                "internal_function": "get_headers",
                "name": "Get headers",
                "description": "Método generado automáticamente para get_headers",
                "blocktype": "operacional",
                "label": "Obtener cabecera <!input:str> de la petición"
            },
            {
                "internal_function": "get_json_body",
                "name": "Get json body",
                "description": "Método generado automáticamente para get_json_body",
                "blocktype": "operacional",
                "label": "obtener dato: <!input:str> del cuerpo de la petición"
            },
            {
                "internal_function": "requestmethod",
                "name": "Requestmethod",
                "description": "Método generado automáticamente para requestmethod",
                "blocktype": "variable",
                "label": "método http"
            },
            {
                "internal_function": "require",
                "name": "Require",
                "description": "Método generado automáticamente para require",
                "blocktype": "config",
                "label": "Requerir librería <!input:str>"
            },
            {
                "internal_function": "respond",
                "name": "Respond",
                "description": "Método generado automáticamente para respond",
                "blocktype": "operacional",
                "label": "responder: <!input:str> con http: <!input:int>"
            }
        ]
    },
    "Variables": {
        "color": "rgb(111, 40, 111)",
        "description": "Descripción genérica de la clase.",
        "author": "kouraecommunity",
        "blocks": [
            {
                "internal_function": "set",
                "name": "Set",
                "description": "Método generado automáticamente para set",
                "blocktype": "operacional",
                "label": "crear nueva variable <!input:str> con valor <!input:str>"
            }
        ]
    },
    "Endpoint": {
        "color": "rgb(25, 25, 172)",
        "description": "Descripción genérica de la clase.",
        "author": "kouraecommunity",
        "blocks": [
            {
                "internal_function": "do_get",
                "name": "Do get",
                "description": "Método generado automáticamente para do_get",
                "blocktype": "definidor",
                "label": "Cuando alguien acceda a <!var:name> con el método GET"
            },
            {
                "internal_function": "do_options",
                "name": "Do options",
                "description": "Método generado automáticamente para do_options",
                "blocktype": "definidor",
                "label": "Cuando alguien acceda a <!var:name> con el método OPTIONS"
            },
            {
                "internal_function": "do_post",
                "name": "Do post",
                "description": "Método generado automáticamente para do_post",
                "blocktype": "definidor",
                "label": "Cuando alguien acceda a <!var:name> con el método POST"
            }
        ]
    },
    "Controls": {
        "color": "rgb(219, 132, 12)",
        "description": "Descripción genérica de la clase.",
        "author": "kouraecommunity",
        "blocks": [
            {
                "internal_function": "ifequals",
                "name": "Ifequals",
                "description": "Método generado automáticamente para ifequals",
                "blocktype": "condicional",
                "label": "si <!input:str> es igual a <!input:str>"
            },
            {
                "internal_function": "ifincluded",
                "name": "Ifincluded",
                "description": "Método generado automáticamente para ifincluded",
                "blocktype": "condicional",
                "label": "Si <!input:str> está incluido en <!input:str>"
            },
            {
                "internal_function": "ifnot",
                "name": "Ifnot",
                "description": "Método generado automáticamente para ifnot",
                "blocktype": "condicional",
                "label": "De lo contrario"
            },
            {
                "internal_function": "ignore",
                "name": "Ignore",
                "description": "Método generado automáticamente para ignore",
                "blocktype": "condicional",
                "label": "No hacer nada y continuar con el flujo"
            }
        ]
    }
};
