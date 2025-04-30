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
            formatter: '{b}'  // 显示节点名字

        },
        legend: [{
            data: ['节点1', '节点2', '节点3', '节点4', '节点5']
        }],
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
                { name: '节点1', symbolSize: 100, itemStyle: { color: 'red' }, url: 'https://example.com/node1' },
                { name: '节点2', symbolSize: 50, itemStyle: { color: 'blue' }, url: 'https://example.com/node2' },
                { name: '节点3', symbolSize: 50, itemStyle: { color: 'green' }, url: 'https://example.com/node3' },
                { name: '节点4', symbolSize: 50, itemStyle: { color: 'yellow' }, url: 'https://example.com/node4' },
                { name: '节点5', symbolSize: 50, itemStyle: { color: 'purple' }, url: 'https://example.com/node5' }
            ],
            links: [
                { source: '节点1', target: '节点2', value: '连接1' },
                { source: '节点1', target: '节点3', value: '连接2' },
                { source: '节点1', target: '节点4', value: '连接3' },
                { source: '节点1', target: '节点5', value: '连接4' }
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