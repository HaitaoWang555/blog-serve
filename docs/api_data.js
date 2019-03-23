define({ "api": [
  {
    "version": "0.1.0",
    "type": "get",
    "url": "/test/error",
    "title": "测试错误处理函数",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "param",
            "description": "<p>参数</p>"
          }
        ]
      }
    },
    "group": "test",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\"statusCode\":1,\"msg\":\"没有参数param\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\"msg\":\"成功\",\"data\":{\"param\": \"111111\"}}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "GetTestError"
  },
  {
    "version": "0.1.0",
    "type": "get",
    "url": "/test/list",
    "title": "获取列表数据",
    "group": "test",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\n\"msg\":\"成功\",\n\"data\":{\"list\": [\n{\"id\": \"24e24c31-12f2-4e17-883d-7b9f18b79cf5\",\n\"name\": \"78788\",\n\"priceInCent\": 2450,\n\"created_at\": \"2019-02-27T03:56:19.105Z\",\n\"updated_at\": \"2019-02-27T03:56:19.105Z\"\n}]}}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "GetTestList"
  },
  {
    "version": "0.1.0",
    "type": "post",
    "url": "/test/addone",
    "title": "添加",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>名</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "priceInCent",
            "description": "<p>价格</p>"
          }
        ]
      }
    },
    "group": "test",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\n\"msg\":\"添加成功\",\n\"data\":{\n\"id\": \"24e24c31-12f2-4e17-883d-7b9f18b79cf5\",\n\"name\": \"78788\",\n\"priceInCent\": 2450,\n\"created_at\": \"2019-02-27T03:56:19.105Z\",\n\"updated_at\": \"2019-02-27T03:56:19.105Z\"\n}}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "PostTestAddone"
  },
  {
    "version": "0.1.0",
    "type": "post",
    "url": "/test/getOne",
    "title": "根据id获取列表中某一个",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "uuid",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "group": "test",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\n\"msg\":\"成功\",\n\"data\":{\"list\":\n{\"id\": \"24e24c31-12f2-4e17-883d-7b9f18b79cf5\",\n\"name\": \"78788\",\n\"priceInCent\": 2450,\n\"created_at\": \"2019-02-27T03:56:19.105Z\",\n\"updated_at\": \"2019-02-27T03:56:19.105Z\"\n}}}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "PostTestGetone"
  },
  {
    "version": "0.1.0",
    "type": "post",
    "url": "/test/updateOneById",
    "title": "修改",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "uuid",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>名</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "priceInCent",
            "description": "<p>价格</p>"
          }
        ]
      }
    },
    "group": "test",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\n\"msg\":\"添加成功\",\n\"data\":{\n\"id\": \"24e24c31-12f2-4e17-883d-7b9f18b79cf5\",\n\"name\": \"78788\",\n\"priceInCent\": 2450,\n\"created_at\": \"2019-02-27T03:56:19.105Z\",\n\"updated_at\": \"2019-02-27T03:56:19.105Z\"\n}}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "PostTestUpdateonebyid"
  },
  {
    "version": "0.1.0",
    "type": "put",
    "url": "/test/removeOne",
    "title": "根据id删除列表中某一个",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "uuid",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "group": "test",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "statusCode",
            "description": "<p>响应码</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>提示信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>响应数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"statusCode\":0,\n\"msg\":\"成功\",\n\"data\":{}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/router/test.js",
    "groupTitle": "test",
    "name": "PutTestRemoveone"
  }
] });
