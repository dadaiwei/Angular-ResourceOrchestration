rosApp.constant("RELATIONSTABLE", {
    "基础网络": [
        {
            children: "主机",
            value: true
        },
        {
            children: "私有网络",
            value: true
        }
    ],
    "私有网络": [
        {
            children: "主机",
            value: true
        },
        {
            children: "NAS",
            value: true
        }
    ],
    "主机": [
        {
            children: "硬盘",
            value: true
        }
    ]
})