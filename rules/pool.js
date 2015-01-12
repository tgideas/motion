module.exports={
    "name": "livepool",
    "type": "root",
    "children": [
        {
            "name": "project1",
            "type": "proj",
            "match": "/Users/rehorn/Documents/Code/node/livepool/test/examples/",
            "children": [
                {
                    "name": "handler",
                    "type": "group",
                    "children": [
                        {
                            "id": "1746f2e5-31ab-5328-4452-c5d19da65f8a",
                            "match": "find.qq.com/js/delay.js",
                            "action": "delay(5)",
                            "checked": true,
                            "leaf": true
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "a611fd05-ebe8-e83b-7212-73473eb8e033"
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "b75e98ad-9988-a722-6104-bb477daa4c90"
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "8e38126c-1cc0-29e5-94a9-e8954e26bc2f"
                        },
                        {
                            "match": "find.qq.com/|*.idqqimg.com/qqfind/",
                            "action": "./",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "6fafab19-8c7a-8a66-0897-5aa613744b02"
                        },
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "77cd1499-9a17-de66-ffc9-e0cc60a4665e"
                        }
                    ],
                    "checked": true,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "9d94c6c9-8ef2-5e86-7791-d0897617f62e"
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "35e14aaf-ce33-0c65-2a7b-62edbb4524fa"
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "10.12.23.156",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "c8a84960-35f9-9cfb-4df1-1bbaf7acb039"
                        }
                    ],
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "c86b0045-8d0c-da8d-2e12-d99fc941dd54"
                }
            ],
            "checked": false,
            "action": "",
            "id": "2a705271-5fa8-d785-db66-354abeaec96a"
        },
        {
            "name": "motion",
            "type": "proj",
            "match": "/Users/wanbo/Documents/project/Motion/",
            "children": [
                {
                    "name": "handler",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/index.html",
                            "action": "./__index.html",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "d583042f-ceab-fcf5-fe15-fee4a4c9c0b2"
                        },
                        {
                            "match": "find.qq.com/js/find.all.js",
                            "action": "./tools/find.all.qzmin",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "8805f02e-ac71-178f-a293-e545281af556"
                        },
                        {
                            "match": "find.qq.com/js/find.combo.js",
                            "action": "./js/jquery.js|./js/main.js",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "9dddd47a-357d-7829-7fec-09a4945c2bb5"
                        },
                        {
                            "match": "find.qq.com/css/comp.css",
                            "action": "./css/main.css|./css/sub1.css",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "4b59d260-75d9-ad31-a1e6-20007701039e"
                        },
                        {
                            "match": "find.qq.com/js/catalog.js",
                            "action": "http://pub.idqqimg.com/qqfind/js/groupcatalog.js",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "9f9a9e84-ff4e-bf15-a7ec-1743be11659f"
                        },
                        {
                            "match": "tgideas.github.io/",
                            "action": "./",
                            "leaf": true,
                            "checked": true,
                            "name": "",
                            "id": "dccd5242-b249-d4d6-3b46-eb81771a5eb3"
                        }
                    ],
                    "checked": true,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "cdb6c3c2-af93-bae6-3a44-5f97903ed38c"
                },
                {
                    "name": "router",
                    "type": "group",
                    "children": [
                        {
                            "match": "find.qq.com/cgi-bin/|cgi.find.qq.com",
                            "action": "-",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "6f08c12f-fa2d-9e67-bb30-ef885ff87552"
                        },
                        {
                            "match": "find.qq.com|idqqimg.com/qqfind/",
                            "action": "172.23.136.84",
                            "leaf": true,
                            "checked": false,
                            "name": "",
                            "id": "012a8530-5f8b-7672-dcec-1f63af21e791"
                        }
                    ],
                    "checked": false,
                    "match": "",
                    "action": "",
                    "enableDrag": false,
                    "id": "a3bdec54-ec42-1f5e-ef1e-dbe6b6d73ab8"
                }
            ],
            "checked": true,
            "action": "",
            "id": "5fd6d6ee-73ae-841c-8ae4-ab1770609551"
        }
    ]
}