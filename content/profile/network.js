// echarts-config.js

// 初始化 ECharts 实例

function initECharts() {
    var myChart = echarts.init(document.getElementById('main'));

    var option = {
        backgroundColor: '#f5f5f5',  // 设置背景颜色为浅灰色
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (params.dataType === 'edge') {
                    // return `边: ${params.data.source} -> ${params.data.target}<br>值: ${params.data.value}`;
                    return params.data.value;  // 显示边的value
                } else if (params.data && params.data.remark) {
                    return params.data.remark;  // 显示备注文本
                }
                return params.name;  // 默认显示节点名字

            }

        },
        legend: {
            data: ['Research paper', 'Review paper', 'Patent/software', 'Presentation', 'Media coverage']  // 图例数据

        },
        series: [{
            name: '网络',
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            roam: true,
            label: {
                show: true  // 节点名字直接显示

            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 8],
            edgeLabel: {
                show: false,
                formatter: '{c}'
            },
            data: [
                { name: 'Sheng, 2022', symbolSize: 30, category: 'Research paper', remark: 'nZVI and PAHs effects on bacterial community', url: 'https://www.sciencedirect.com/science/article/abs/pii/S0269749122011071'},

                { name: 'Sheng, 2024', symbolSize: 80, category: 'Review paper', remark: 'Plastic pollution in agricultural landscapes.', url: 'https://www.nature.com/articles/s41467-024-52734-3'},
                { name: 'Sheng, 2024b', symbolSize: 40, category: 'Presentation', remark: 'Latebreaking Poster at ESA 2024', url: 'https://www.esa.org/longbeach2024/'},
                { name: 'Sheng, 2024c', symbolSize: 20, category: 'Presentation', remark: '西湖大学可持续发展与环境前沿交叉论坛 海报展示'},
                { name: 'Sheng, 2025', symbolSize: 60, category: 'Research paper', remark: 'Long-term exposure to microplastics and heat affects <br>bumblebee colony development, behavior patterns and social networks (in prep)'},
                { name: 'Wanger, 2023', symbolSize: 30, category: 'Patent/software', remark: 'Tracking system patent (CN120124651A)'},
                { name: 'Xu, 2024', symbolSize: 50, category: 'Research paper', remark: 'Identifying Cocoa Pollinators', url: 'https://arxiv.org/abs/2412.19915'},
                { name: 'Darras, 2024', symbolSize: 40, category: 'Research paper', remark: 'Eyes on nature', url: 'https://besjournals.onlinelibrary.wiley.com/doi/10.1111/2041-210X.14436'},
            ],
            links: [
                { source: 'Darras, 2024', target: 'Xu, 2024', value: 'Embedded vision camera' },
                { source: 'Sheng, 2024', target: 'Sheng, 2025', value: 'Microplastics, pollinators' },
                { source: 'Darras, 2024', target: 'Sheng, 2025', value: 'Computer vision' },
                { source: 'Darras, 2024', target: 'Wanger, 2023', value: 'Computer vision' },
                { source: 'Sheng, 2025', target: 'Sheng, 2024b', value: 'Priliminary findings' },
                { source: 'Sheng, 2025', target: 'Wanger, 2023', value: 'Software' },
                { source: 'Sheng, 2024', target: 'Sheng, 2024c', value: '-' },
            ],
            // #a1a1ce, #94bcbc, #83a7d2, #2b7e9c, #1b5b7e
            categories: [
                { name: 'Research paper', itemStyle: { color: '#1b5b7e' } },
                { name: 'Review paper', itemStyle: { color: '#2b7e9c' } },
                { name: 'Patent/software', itemStyle: { color: '#83a7d2' } },
                { name: 'Presentation', itemStyle: { color: '#94bcbc' } },
                { name: 'Media coverage', itemStyle: { color: '#a1a1ce' } }
            ],
            force: {
                // repulsion: 1000,
                // edgeLength: [100, 200]
                repulsion: 500,  // 调整斥力

                gravity: 0.1,    // 调整引力

                edgeLength: [100, 150],  // 调整边的长度范围

                layoutAnimation: true,  // 禁用布局动画

                init: 'circle'  // 初始布局方式
            },
            lineStyle: {
                color: 'target',
                curveness: 0,
                width: 2,
                opacity: 1
              }
        }]
    };

    // 使用刚指定的配置项和数据显示图表

    myChart.setOption(option);

    // 设置节点点击事件

    myChart.on('click', function (params) {
        if (params.dataType === 'node' && params.data.url) {
            window.open(params.data.url, '_blank');
        }
    });
}