<template>
    <div id="div" ref="div" v-html="props.data.import"></div>
</template>
<script setup>
import { onMounted,ref } from "vue";
const props = defineProps({
  data: null,
});
const div=ref();
onMounted(() => {
  console.log(props.data.import);
  div.html=props.data.import;
});
</script>
<style scoped>
image{
    height: 60px;
    width: 60px;
}
#div{
width: 80%;
}

</style>