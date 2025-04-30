// echarts-config.js

// 初始化 ECharts 实例

function initECharts() {
    var myChart = echarts.init(document.getElementById('main'));

    var option = {
        title: {
            text: '力引导分布网络图示例'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (params.data && params.data.remark) {
                    return params.data.remark;  // 显示备注文本

                }
                return params.name;  // 默认显示节点名字

            }

        },
        legend: {
            data: ['Review paper', 'Research paper']  // 图例数据

        },
        series: [{
            name: '网络',
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            roam: true,
            label: {
                show: false  // 关闭节点名字的直接显示

            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                show: true,
                formatter: '{c}'
            },
            data: [
                { name: '节点1', symbolSize: 100, category: 'Review paper', url: 'https://example.com/node1', remark: 'Plastic pollution in agricultural landscapes (2024)' },
                { name: '节点2', symbolSize: 50, category: 'Research paper', url: 'https://example.com/node2' },
                { name: '节点3', symbolSize: 50, url: 'https://example.com/node3' },
                { name: '节点4', symbolSize: 50, url: 'https://example.com/node4' },
                { name: '节点5', symbolSize: 50, url: 'https://example.com/node5' }
            ],
            links: [
                { source: '节点1', target: '节点2', value: '连接1' },
                { source: '节点1', target: '节点3', value: '连接2' },
                { source: '节点1', target: '节点4', value: '连接3' },
                { source: '节点1', target: '节点5', value: '连接4' }
            ],
            // #a4c2db, #73b1c9, #4a9ab0, #2b7e9c, #1b5b7e
            categories: [
                { name: 'Review', itemStyle: { color: '#2b7e9c' } },
                { name: 'Research paper', itemStyle: { color: '#1b5b7e' } },
                { name: 'Conference', itemStyle: { color: '#4a9ab0' } },
                { name: 'Patents/software', itemStyle: { color: '#73b1c9' } },
                { name: 'Media coverage', itemStyle: { color: '#a4c2db' } }
            ],
            force: {
                repulsion: 1000,
                edgeLength: [100, 200]
            }
        }]
    };

    // 使用刚指定的配置项和数据显示图表

    myChart.setOption(option);

    // 设置节点点击事件

    myChart.on('click', function (params) {
        if (params.dataType === 'node') {
            window.open(params.data.url, '_blank');
        }
    });
}