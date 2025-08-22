<template>
    <div ref="echarts">

    </div>
</template>
<script>
    import { Getreports } from '@/api/http'
    export default {
        methods: {
            async fetchData() {
                try {
                    const res = await Getreports()
                    const myChart = this.$echarts.init(this.$refs.echarts);
                    res.series.forEach(item =>
                        item.emphasis = { focus: 'series' }
                    )
                    const chartoption = {
                        ...res,
                        title: {
                            text: '订单统计',
                            left: 'left'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross'
                            },
                        }
                    }
                    myChart.setOption(chartoption);
                    window.addEventListener('resize', () => {
                        myChart.resize();
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        },
        mounted() {
            this.fetchData()
        }
    }
</script>