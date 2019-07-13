import json
from collections import defaultdict, OrderedDict

test_dict = {

    "name": "BeJson",

    "url": "http://www.bejson.com",

    "page": 88,

    "isNonProfit": True,

    "address": {

        "street": "科技园路.",

        "city": "江苏苏州",

        "country": "中国"

    },

    "links": [

        {

            "name": "Google",

            "url": "http://www.google.com"

        },

        {

            "name": "Baidu",

            "url": "http://www.baidu.com"

        },

        {

            "name": "SoSo",

            "url": "http://www.SoSo.com"

        }

    ]

}
json_str = json.dumps(test_dict, indent=4)
with open('test_data.json', 'w') as json_file:
    json_file.write(json_str)
